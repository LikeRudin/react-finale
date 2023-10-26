import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import type { MeetUp } from "@prisma/client";

import TextArea from "../components/textarea";
import Layout from "../components/layout";
import SubmitButton from "../components/submit-button";

import client from "@/libs/server/prisma-client";
import useUser from "@/libs/client/useUser";
import useMutation from "@/libs/client/useMutation";

import { APIROUTE } from "@/constants/apiroutes";

interface MeetDetailProps {
  meetUp: MeetUp & { user: { username: string } };
}

interface ReplyForm {
  reply: string;
}

const MeetDetail: NextPage<MeetDetailProps> = ({ meetUp }) => {
  const router = useRouter();
  const [mutate, user] = useUser();
  const { register, handleSubmit } = useForm<ReplyForm>();
  const { trigger: likeTrigger, state: likeState } = useMutation(
    APIROUTE.MEETS_LIKE(String(router.query.id)),
    "POST"
  );
  const { trigger: joinTrigger, state: joinState } = useMutation(
    APIROUTE.MEETS_JOIN(String(router.query.id)),
    "POST"
  );

  const { trigger: commentTrigger, state: commentState } = useMutation(
    APIROUTE.MEETS_COMMENTS(String(router.query.id)),
    "POST"
  );

  const onValid = ({ reply }: ReplyForm) => {
    commentTrigger({ reply });
  };
  const onLikeClick = () => {
    likeTrigger();
  };
  const onJoinClick = () => {
    joinTrigger();
  };
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
            <span className="text-xl block text-gray-900">
              장소: {meetUp?.location}
            </span>
            <span className="text-xl block text-gray-900">
              {meetUp?.schedule
                .toString()
                .split("T")
                .map((word, index) => (!index ? `${word} ` : word.slice(0, 5)))}
            </span>
            <span className="text-md">조회수:{meetUp?.viewCount}</span>
            <p className="my-6 text-gray-700">{meetUp?.description}</p>
            <div className="w-full flex items-center px-1 space-x-1">
              <button
                className="flex-1 bg-orange-700 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-800 font-medium hover:bg-orange-800"
                onClick={onJoinClick}
              >
                Join this meet
              </button>
              <button
                className="py-2 px-2 aspect-square rounded-md justify-center items-center text-gray-700 bg-color-gray-200 hover:bg-gray-300 group"
                onClick={onLikeClick}
              >
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
        <div className="flex items-start space-x-3 px-2 border-b border-b-gray-200 mb-1">
          <div className="w-8 h-8 mt-1  bg-slate-300 rounded-full" />
          <div>
            <span className="text-sm block font-medium text-gray-800">린</span>
            <span className="text-xs text-gray-600 mt-1">2시간 전</span>
            <p className="text-gray-800 mt-2">족발은 이제 그만..!</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onValid)}>
        <TextArea
          register={register("reply", { required: true })}
          label="Reply"
          required={true}
          name="reply-textarea"
        />
        <SubmitButton text="Add Reply" />
      </form>
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

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context?.params?.id) {
    return { props: {} };
  }
  await client.meetUp.update({
    where: {
      id: +context.params.id.toString(),
    },
    data: {
      viewCount: { increment: 1 },
    },
  });
  const meetUpHere = await client.meetUp.findUnique({
    where: {
      id: +context.params.id.toString(),
    },
    include: {
      user: {
        select: {
          username: true,
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
