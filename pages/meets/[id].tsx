import type {
  GetServerSideProps,
  NextPage,
  GetServerSidePropsContext,
} from "next";
import { withSessionSSR } from "@/libs/server/session";

import useSWR from "swr";

import { useForm } from "react-hook-form";

import TextArea from "../components/common/textarea";
import Layout from "../components/common/layout";
import SubmitButton from "../components/common/submit-button";
import Comment from "../components/comment";
import MiniProfile from "../components/mini-profile";
import client from "@/libs/server/prisma-client";
import type {
  MeetUp,
  MeetUpLike,
  MeetUpJoin,
  MeetUpCommentLike,
} from "@prisma/client";

import useMutation from "@/libs/client/useMutation";

import { MEETS_API_ROUTE, ROUTE_PATH } from "@/libs/util/apiroutes";
import { useState } from "react";
import cls from "@/libs/util/cls";
import { timeFormatter } from "@/libs/util/time-formatter";
import HeartIcon from "../components/icons/heart";

type MeetUpComment = {
  id: number;
  createdAt: string;
  text: string;
  userId: number;
  user: {
    username: string;
    id: number;
    avatar?: string;
  };
  parent?: MeetUpComment;
  parentId?: number;
  comments?: MeetUpComment[];
  likes?: MeetUpCommentLike[];
};

type MeetUpDetail = MeetUp & {
  userId: number;
  user: { username: string };
  joins: (MeetUpJoin & { user: { username: string } })[];
  likes: (MeetUpLike & { user: { username: string } })[];
  comments: MeetUpComment[];
};

interface MeetDetailProps {
  pageId: string;
  meetUpInit: MeetUpDetail;
  userId: number;
  isLikedInit: boolean;
  isJoinedInit: boolean;
}

interface IResponse {
  status: "ok" | "fail" | "error";
  data: { meetUp: MeetUpDetail; isLiked: boolean; isJoined: boolean };
}

interface ReplyForm {
  reply: string;
}

const MeetDetail: NextPage<MeetDetailProps> = ({
  meetUpInit,
  pageId,
  isJoinedInit,
  isLikedInit,
  userId,
}) => {
  const {
    data: {
      data: { meetUp, isLiked, isJoined },
    },
    mutate,
  } = useSWR<IResponse>(MEETS_API_ROUTE.DETAIL(pageId), {
    fallbackData: {
      status: "ok",
      data: {
        meetUp: meetUpInit,
        isLiked: isLikedInit,
        isJoined: isJoinedInit,
      },
    },
  }) as { data: IResponse } & ReturnType<typeof useSWR>;

  const { trigger: likeTrigger } = useMutation(
    MEETS_API_ROUTE.LIKE(pageId),
    "POST",
    mutate
  );

  const onLikeClick = () => {
    likeTrigger();
  };

  const { trigger: joinTrigger } = useMutation(
    MEETS_API_ROUTE.JOIN(pageId),
    "POST",
    mutate
  );

  const onJoinClick = () => {
    joinTrigger();
  };

  const { register, handleSubmit, setValue } = useForm<ReplyForm>();

  const { trigger: commentTrigger } = useMutation(
    MEETS_API_ROUTE.COMMENTS(pageId),
    "POST",
    mutate
  );

  const onValid = ({ reply }: ReplyForm) => {
    commentTrigger({ reply });
  };

  const [isLikersModalOpened, setIsLikersModalOpened] = useState(false);
  const [isJoinersModalOpened, setIsJoinersModalOpened] = useState(false);

  const onJoinersClick = () => {
    setIsJoinersModalOpened((prev) => !prev);
  };
  const onLikersClick = () => {
    setIsLikersModalOpened((prev) => !prev);
  };

  return (
    <Layout hasBack hasTopBar seoTitle='meetUp' title={meetUp.name}>
      <div className='wrapper py-10 pb-20 text-gray-400 h-full w-full '>
        <div className='topbox px-4 bg-[rgb(20,20,20)] py-2'>
          <div className='picture h-96 bg-orange-300' />
          <MiniProfile
            userName={meetUp.user.username}
            userId={meetUp.userId}
            widthAndHeight={"w-[48px] h-[48px]"}
            text={"view profile →"}
          />
          <div className='descriptionBox mt-4 space-y-2 bg-[rgb(20,20,20)]'>
            <h1 className='text-3xl font-bold text-gray-300'>{meetUp?.name}</h1>
            <span className='text-xl block text-gray-400'>
              장소: {meetUp.location}
            </span>
            <span className='text-xl block text-gray-400'>
              {timeFormatter(meetUp.schedule.toString())}
            </span>
            <span className='text-md'>조회수:{meetUp.viewCount}</span>
            <div className='my-6 text-gray-300'>{meetUp.description}</div>
            <div className='w-full flex items-center px-1 space-x-1 bg-[rgb(20,20,20)]'>
              <button
                className={cls(
                  "flex-1  text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-800 font-medium hover:bg-orange-800",
                  isJoined ? "bg-[#2f8873]" : "bg-orange-700"
                )}
                onClick={onJoinClick}
              >
                {isJoined ? "Joined this meet" : "Join this meet"}
              </button>
              <button
                className='py-2 px-2 aspect-square rounded-md justify-center items-center text-gray-300 bg-color-gray-200 hover:bg-orange-300 group"'
                onClick={onLikeClick}
              >
                <HeartIcon
                  className={cls(
                    "h-6 w-6",
                    isLiked
                      ? "fill-red-500  group-hover:fill-gray-400"
                      : "fill-gray-400 group-hover:fill-red-500"
                  )}
                />
              </button>
            </div>
            <div className='bg-[rgb(20,20,20)] p-2 h-10 flex justify-start items-center'>
              <span
                onClick={onJoinersClick}
                className='hover:text-blue-500 hover:font-bold hover:text-lg cursor-pointer'
              >
                {meetUp.joins?.length}
                명이 참여 하고
              </span>
              ,
              <span
                onClick={onLikersClick}
                className='hover:text-red-500 hover:font-bold hover:text-lg cursor-pointer'
              >
                {meetUp.likes?.length}명이 좋아합니다.
              </span>
            </div>
          </div>
        </div>
        <div className='bg-[rgb(20,20,20)] w-full px-4 '>
          <p>{`comments: ${meetUp.comments?.length}`}</p>
          {meetUp.comments.map((comment, index) => {
            return (
              !comment.parent && (
                <Comment
                  key={`comment${index}`}
                  {...comment}
                  likes={comment.likes!.length}
                  postId={+pageId}
                  writtenAt={comment.createdAt.toString()}
                  kind='MeetUp'
                  isOwner={+userId === comment.user.id}
                  userName={comment.user.username}
                  comments={comment.comments as []}
                />
              )
            );
          })}
          <form onSubmit={handleSubmit(onValid)}>
            <TextArea
              register={register("reply", { required: true })}
              label='Comment'
              required={true}
              name='reply-textarea'
              setValue={setValue}
              value={""}
            />
            <SubmitButton text='Add Comment' />
          </form>
        </div>
      </div>
      <div
        className={cls(
          isJoinersModalOpened
            ? "fixed top-0 left-0 w-screen h-screen bg-black/50 z-20 flex justify-center items-center"
            : "hidden"
        )}
        onClick={onJoinersClick}
      >
        <div className='flex flex-col w-1/2 space-y-5 py-10 px-2 h-2/3 bg-white overflow-y-auto'>
          {meetUp.joins.length ? (
            meetUp.joins.map((join, index) => {
              const {
                user: { username },
              } = join;

              return (
                <div
                  key={index}
                  className='w-full flex justify-between px-5 border-b pb-5 cursor-pointer'
                >
                  <div className='flex space-x-4 items-center'>
                    <div className='pt-2 flex-col'>
                      <div className='text-md font-medium text-gray-400 break-normal'>
                        {username}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className='flex space-x-4 items-center justify-center'>
              <div className='text-md font-medium text-gray-400 break-normal'>
                아직 참여자가 없어요
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={cls(
          isLikersModalOpened
            ? "fixed top-0 left-0 w-screen h-screen bg-black/50 z-20 flex justify-center items-center"
            : "hidden"
        )}
        onClick={onLikersClick}
      >
        <div className='flex flex-col w-1/2 space-y-5 py-10 px-2 h-2/3 bg-white overflow-y-auto'>
          {(meetUp as MeetUpDetail).likes.length ? (
            meetUp.likes.map((like, index) => {
              const {
                user: { username },
              } = like;

              return (
                <div
                  key={index}
                  className='w-full flex justify-between px-5 border-b pb-5 cursor-pointer'
                >
                  <div className='flex space-x-4 items-center'>
                    <div className='pt-2 flex-col'>
                      <div className='text-md font-medium text-gray-400 break-normal'>
                        {username}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className='flex space-x-4 items-center justify-center'>
              <div className='text-md font-medium text-gray-900 break-normal'>
                아직 반응한사람이 없어요
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MeetDetail;

export const getServerSideProps: GetServerSideProps = withSessionSSR(
  async ({ req, params }: GetServerSidePropsContext) => {
    if (!(params?.id && req.session.user)) {
      return { props: {} };
    }
    const id = +params.id.toString();

    await client.meetUp.update({
      where: {
        id,
      },
      data: {
        viewCount: { increment: 1 },
      },
    });

    const { user } = req.session;
    const userId = +user?.id;
    const meetUpData = await client.meetUp.getMeetUpDetail(id, userId);
    if (!meetUpData) {
      return {
        redirect: {
          permanent: false,
          destination: ROUTE_PATH.INDEX,
        },
      };
    }
    const { meetUp, isLiked, isJoined } = meetUpData;
    return {
      props: {
        meetUpInit: JSON.parse(JSON.stringify(meetUp)),
        pageId: id,
        isLikedInit: isLiked,
        isJoinedInit: isJoined,
        userId,
      },
    };
  }
);
