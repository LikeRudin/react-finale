import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Layout from "../components/layout";
import useUser from "@/libs/client/useUser";
import client from "@/libs/server/prisma-client";
import { MeetUp } from "@prisma/client";

interface MeetDetailProps {
  meetUp: MeetUp & { user: { username: string } };
}

const MeetDetail: NextPage<MeetDetailProps> = ({ meetUp }) => {
  const { userState, mutate } = useUser();

  return (
    <Layout hasBack seoTitle="meetUp" title={meetUp?.name}>
      <div className="wrapper px-4 py-10">
        <div className="topbox mb-8">
          <div className="picture h-96 bg-orange-300" />
          <div className="profile flex items-center cursor-pointer py-4 space-x-4 border-t border-b">
            <div className="rounded-full w-[52px] h-[52px] bg-orange-500" />
            <div className="flex-col space-y-1">
              <p className="text-sm font-medium text-gray-700">
                {meetUp?.user?.username}
              </p>
              <p className="text-xs font-medium text-gray-500">
                view profile &rarr;
              </p>
            </div>
          </div>
          <div className="descriptionBox mt-4 space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">{meetUp?.name}</h1>
            <span className="text 3xl block text-gray-900">
              {meetUp?.schedule.toString()}
            </span>
            <p className="my-6 text-gray-700">{meetUp?.description}</p>
            <div className="w-full flex items-center px-1 space-x-1">
              <button className="flex-1 bg-orange-700 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-800 font-medium hover:bg-orange-800">
                Join this meet
              </button>
              <button className="py-2 px-2 aspect-square rounded-md justify-center items-center text-gray-700 bg-color-gray-200 hover:bg-gray-300 group">
                <svg
                  className="h-6 w-6 group-hover:fill-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">other meets</h2>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="space-y-1">
                <div className="h-52 w-full my-2 rounded-lg bg-orange-400" />
                <h3 className="text-gray-700">Mogakko</h3>
                <p className="text-sm font-medium text-gray-900">YYYY-MM-DD</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MeetDetail;

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return { props: {} };
  }
  const meetUpHere = await client.meetUp.findUnique({
    where: {
      id: +ctx.params.id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
          meetUps: true,
        },
      },
    },
  });
  return {
    props: {
      meetUp: JSON.parse(JSON.stringify(meetUpHere)),
    },
  };
};
