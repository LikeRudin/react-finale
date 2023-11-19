import Layout from "../components/common/layout";
import useDetailPage from "@/libs/client/useDetailPage";
import { PROFILE_API_ROUTE } from "@/libs/util/apiroutes";
import { withSessionSSR } from "@/libs/server/session";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import client from "@/libs/server/prisma-client";
import type { User, MeetUp, Tweet } from "@prisma/client";

import type { NextPage } from "next";
import Image from "next/image";
import LoadingCover from "../components/common/loading-cover";

type UserData = User & { meetUps: MeetUp[]; tweets: Tweet[] };

type OtherProfileProps = {
  profileInit: UserData;
  otherUserId: number;
};

const Profile: NextPage<OtherProfileProps> = ({ profileInit, otherUserId }) => {
  const userDetail = useDetailPage<UserData>(
    PROFILE_API_ROUTE.OTHERS(otherUserId),
    {
      profile: profileInit,
    }
  );
  switch (userDetail.status) {
    case "ok":
      const {
        data: { username, avatar, introduction, meetUps, tweets },
      } = userDetail;
      return (
        <Layout
          title={`${username}'s profile`}
          seoTitle={username}
          hasBack
          hasTopBar
        >
          <div>
            <div>
              <Image
                src={avatar as string}
                alt={`${username}'s avatar`}
                width={48}
                height={48}
              />
              <h1>{username}</h1>
              <p>{introduction}</p>
            </div>

            <div>
              <h2>MeetUps</h2>
              {meetUps.map((meetUp, index) => (
                <div key={index}>{/* TODO: meetUp 뿌리기*/}</div>
              ))}
            </div>

            <div className='tweets-section'>
              <h2>Tweets</h2>
              {tweets.map((tweet, index) => (
                <div key={index}>{/* TODO: Tweet 뿌리기*/}</div>
              ))}
            </div>
          </div>
        </Layout>
      );
    default:
      return (
        <Layout hasBack hasTopBar title="Other's profile" seoTitle='other'>
          <LoadingCover />
        </Layout>
      );
  }
};
export default Profile;

export const getServerSideProps: GetServerSideProps = withSessionSSR(
  async ({ req, params }: GetServerSidePropsContext) => {
    if (!(params?.id && req.session.user)) {
      return { props: {} };
    }
    const id = +params.id.toString();

    const result = await client.user.getOtherProfile(id);
    if (!result) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }
    return {
      props: {
        profileInit: JSON.parse(JSON.stringify(result)),
        otherUserId: id,
      },
    };
  }
);
