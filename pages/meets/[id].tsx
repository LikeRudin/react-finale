import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

import useSWR from "swr";

import { useForm } from "react-hook-form";
import TextArea from "../components/textarea";
import Layout from "../components/layout";
import SubmitButton from "../components/submit-button";
import Comment from "../components/comment";
import client from "@/libs/server/prisma-client";
import type {
  MeetUp,
  MeetUpLike,
  MeetUpJoin,
  MeetUpCommentLike,
} from "@prisma/client";

import useUser from "@/libs/client/useUser";
import useMutation from "@/libs/client/useMutation";

import { APIROUTE } from "@/constants/apiroutes";
import { useEffect, useState } from "react";
import cls from "@/libs/util/cls";

type MeetUpComment = {
  id: number;
  createdAt: string;
  text: string;
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
  joins: {
    userId: number;
    user: {
      username: string;
    };
  }[];
  likes: {
    userId: number;
    user: {
      username: string;
    };
  }[];
  comments: MeetUpComment[];
};

interface UserData {
  meetUpLikes: {
    meetUpId: number;
  }[];

  id: number;
  email: string | null;
  phone: string | null;
  password: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: string | null;
}
interface MeetDetailProps {
  pageId: string;
  meetUpProp: MeetUpDetail;
}

interface IResponse {
  status: "ok" | "fail" | "error";
  data: { meetUp: MeetUpDetail; isLiked: boolean };
}

interface ReplyForm {
  reply: string;
}

const MeetDetail: NextPage<MeetDetailProps> = ({ meetUpProp, pageId }) => {
  const { data: responseData, mutate } = useSWR<IResponse>(
    APIROUTE.MEETS_DETAIL(pageId),
    {
      fallbackData: {
        status: "ok",
        data: { meetUp: meetUpProp, isLiked: false },
      },
    }
  );
  const {
    data: { meetUp },
  } = responseData as IResponse;

  const router = useRouter();
  const user = useUser<UserData>();
  const [isLiked, setIsLiked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isLikersModalOpened, setIsLikersModalOpened] = useState(false);
  const [isJoinersModalOpened, setIsJoinersModalOpened] = useState(false);

  const onClickJoiners = () => {
    setIsJoinersModalOpened((prev) => !prev);
  };
  const onClickLikers = () => {
    setIsLikersModalOpened((prev) => !prev);
  };

  const { register, handleSubmit, setValue } = useForm<ReplyForm>();
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

  const onValid = async ({ reply }: ReplyForm) => {
    await commentTrigger({ reply });
    mutate();
  };
  const onLikeClick = async () => {
    if (user.status !== "ok") {
      return;
    }
    await likeTrigger();
    user.mutate(
      (prev: { userData: { meetUpLikes: { meetUpId: number }[] } }) => {
        if (
          prev.userData.meetUpLikes.some(
            (item) => item.meetUpId === +String(router?.query?.id)
          )
        ) {
          return {
            ...prev,
            userData: {
              ...prev.userData,
              meetUpLikes: prev.userData.meetUpLikes.filter(
                (item) => item.meetUpId !== +String(router?.query?.id)
              ),
            },
          };
        } else {
          return {
            ...prev,
            userData: {
              ...prev.userData,
              meetUpLikes: [
                ...prev.userData.meetUpLikes,
                {
                  meetUpId: +String(router?.query?.id),
                },
              ],
            },
          };
        }
      },
      true
    );
    setIsLiked(
      user.userData.meetUpLikes.some(
        (item) => item.meetUpId === +String(router.query.id)
      )
    );
    mutate();
  };
  const onJoinClick = async () => {
    await joinTrigger();
    mutate();
  };

  useEffect(() => {
    if (user.status === "ok") {
      setIsLiked(
        user?.userData?.meetUpLikes.some(
          (item) => item.meetUpId === +String(router!.query!.id)
        )
      );
      if (meetUp) {
        setIsJoined(
          meetUp.joins?.some((item) => item.userId === user.userData.id)
        );
      }
    }
  }, [user, isLiked, setIsLiked, onLikeClick, mutate]);

  return (
    <Layout hasBack seoTitle="meetUp" title={meetUp.name}>
      <div className="wrapper px-4 py-10">
        <div className="topbox mb-8">
          <div className="picture h-96 bg-orange-300" />
          <div className="profile flex items-center cursor-pointer py-4 space-x-4 border-t border-b">
            <div className="rounded-full w-[52px] h-[52px] bg-orange-500" />
            <div className="flex-col space-y-1">
              <p className="text-sm font-medium text-gray-700">
                {meetUp.user?.username}
              </p>
              <p className="text-xs font-medium text-gray-500">
                view profile &rarr;
              </p>
            </div>
          </div>
          <div className="descriptionBox mt-4 space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">{meetUp?.name}</h1>
            <span className="text-xl block text-gray-900">
              장소: {meetUp.location}
            </span>
            <span className="text-xl block text-gray-900">
              {meetUp?.schedule
                .toString()
                .split("T")
                .map((word, index) => (!index ? `${word} ` : word.slice(0, 5)))}
            </span>
            <span className="text-md">조회수:{meetUp.viewCount}</span>
            <p className="my-6 text-gray-700">{meetUp.description}</p>

            <div className="w-full flex items-center px-1 space-x-1">
              <button
                className={cls(
                  "flex-1  text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-800 font-medium hover:bg-orange-800",
                  isJoined ? "bg-black" : "bg-orange-700"
                )}
                onClick={onJoinClick}
              >
                {isJoined ? "Joined this meet" : "Join this meet"}
              </button>
              <button
                className="py-2 px-2 aspect-square rounded-md justify-center items-center text-gray-700 bg-color-gray-200 hover:bg-gray-300 group"
                onClick={onLikeClick}
              >
                <svg
                  className={cls(
                    "h-6 w-6",
                    isLiked
                      ? "fill-red-500  group-hover:fill-gray-400"
                      : "fill-gray-400 group-hover:fill-red-500"
                  )}
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
          <div className="p-1 h-10 flex justify-start items-center">
            <span className="hover:text-blue-500 hover:font-bold hover:text-lg cursor-pointer">
              {meetUp.joins?.length}
              명이 참여 하고
            </span>
            ,
            <span className="hover:text-red-500 hover:font-bold hover:text-lg cursor-pointer">
              {meetUp.likes?.length}명이 좋아합니다.
            </span>
          </div>
        </div>
        <p>{`comments: ${meetUp.comments?.length}`}</p>
        <div className="mt-1">
          {user.status === "ok" &&
            meetUp.comments?.map((comment, index) => {
              const {
                id,
                text,
                createdAt,
                user: { username, id: userId, avatar },
                parent,
                comments,
                likes,
              } = comment;
              return (
                !parent && (
                  <Comment
                    comments={comments as []}
                    key={index}
                    meetUpId={meetUp.id.toString()}
                    likes={likes?.length}
                    owner={userId === user.userData.id}
                    writtenAt={createdAt}
                    userId={String(user.userData.id)}
                    avatar={avatar}
                    text={text}
                    userName={username}
                    id={id.toString()}
                  />
                )
              );
            })}
          <form onSubmit={handleSubmit(onValid)}>
            <TextArea
              register={register("reply", { required: true })}
              label="comments"
              required={true}
              name="reply-textarea"
              setValue={setValue}
              value={""}
            />
            <SubmitButton text="Add Comment" />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default MeetDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context?.params?.id) {
    return { props: {} };
  }

  const pageId = context.params.id.toString();

  await client.meetUp.update({
    where: {
      id: +pageId,
    },
    data: {
      viewCount: { increment: 1 },
    },
  });
  const meetUp = await client.meetUp.findUnique({
    where: {
      id: +pageId,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      likes: {
        select: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      joins: {
        select: {
          userId: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      comments: {
        select: {
          id: true,
          createdAt: true,
          text: true,
          user: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
          likes: {
            select: {
              id: true,
              userId: true,
            },
          },
          parent: true,
          parentId: true,
          comments: {
            include: { user: true, comments: true, likes: true },
          },
        },
      },
    },
  });
  return {
    props: {
      meetUpProp: JSON.parse(JSON.stringify(meetUp)),
      pageId,
    },
  };
};
