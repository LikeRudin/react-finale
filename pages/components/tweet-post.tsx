import { tweetCategoryParser } from "@/libs/util/category-parser";
import type {
  Tweet,
  TweetComment,
  TweetCommentLike,
  TweetLike,
  User,
} from "@prisma/client";
import Link from "next/link";
import MiniProfile from "./mini-profile";
import ThumbUpIcon from "./icons/thumb-up";
import BubbleComment from "./icons/bubble-comment";
import { timeFormatter } from "@/libs/util/time-formatter";
import useMutation from "@/libs/client/useMutation";
import { TWEETS_API_ROUTE } from "@/libs/util/apiroutes";
import { mutate } from "swr";
import cls from "@/libs/util/cls";
import ReplyIcon from "./icons/reply-square";
import React, { useState } from "react";
import Comment from "./comment";
import ReTweet from "./retweet";
import ModalComment from "./modal-comment";
import CategoryTextIcon from "./icons/category-text";
import CreatedTime from "./icons/created-time";
import ArrowInCircleIcon from "./icons/arrow-in-circle";

export type TweetCommentData = TweetComment & {
  user: User;
  likes: TweetCommentLike[];
  parent: TweetComment;
  comments: TweetCommentData[];
};

export type TweetData = Tweet & {
  user: User;
  comments: TweetCommentData[];
  tweets: TweetData[];
  likes: TweetLike[];
  parent: TweetData;
  parentId: number;
  isLiked?: boolean;
};
const TweetPost = ({
  parentId,
  parent,
  category,
  user,
  name,
  createdAt,
  userId,
  description,
  tweets,
  comments,
  id,
  isLiked = false,
  likes,
}: TweetData) => {
  const [isRetweetModalOpened, setIsRetweetModalOpened] = useState(false);
  const [isCommentModalOpened, setIsCommentModalOpened] = useState(false);

  const toggleRetweetModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsRetweetModalOpened((prev) => !prev);
  };

  const toggleCommentModal = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsCommentModalOpened((prev) => !prev);
  };

  const { trigger: likeTrigger } = useMutation(
    TWEETS_API_ROUTE.LIKE(id.toString()),
    "POST",
    () => mutate(`/tweets/${id}`)
  );
  const onLikeClick = (event: React.MouseEvent) => {
    event.preventDefault();
    likeTrigger();
  };

  return (
    <div className='w-full mb-2 h-full'>
      <div className='w-full flex flex-col items-start'>
        {parentId ? (
          <div className='text-sm text-gray-100'>
            <Link className='text-orange-200' href={`/tweets/${parentId}`}>
              {`${parent?.user?.username} 님의 ${parent?.name}`}
            </Link>
            를 끌어올림
          </div>
        ) : null}

        <div className='px-4'>
          <div className='flex items-center mt-2 space-x-6'>
            <MiniProfile
              userName={user?.username}
              userId={userId}
              widthAndHeight='w-8 h-8'
            />
            <CategoryTextIcon text={tweetCategoryParser(category)} />
            <CreatedTime createdAt={createdAt} />
            <Link href={`/tweets/${id}`}>
              <ArrowInCircleIcon className='w-8 h-8 hover:stroke-orange-300' />
            </Link>
          </div>
          <div className='w-full flex items-center'>
            <div className='w-full'>
              <div className='px-4 text-gray-100 text-sm'>{name}</div>
              <div>사진</div>
              <div className='mt-2  text-gray-200'>{description}</div>
            </div>
          </div>
          <div className='w-full flex items-center justify-between text-xs'>
            <div className='flex justify-end px-4 py-2.5 space-x-5 mt-2 text-gray-300'>
              <button
                className='flex items-center space-x-2 group'
                onClick={toggleCommentModal}
              >
                <BubbleComment className='w-5 h-5 group-hover:stroke-orange-300' />
                <span className='group-hover:text-orange-300'>
                  댓글 {comments?.length}
                </span>
              </button>
              <button
                className='flex items-center space-x-2 group'
                onClick={toggleRetweetModal}
              >
                <ReplyIcon
                  className={cls(
                    "w-5 h-5 group-hover:stroke-orange-300",
                    isLiked ? "stroke-orange-500" : "stroke-white"
                  )}
                />
                <span className='group-hover:text-orange-300'>
                  리트윗 {tweets?.length}
                </span>
              </button>

              <button
                className='flex items-center space-x-2 group'
                onClick={onLikeClick}
              >
                <ThumbUpIcon
                  className={cls(
                    "w-5 h-5 group-hover:stroke-orange-300",
                    isLiked ? "stroke-orange-500" : "stroke-white"
                  )}
                />
                <span className='group-hover:stroke-orange-300'>
                  추천 {likes?.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cls(
          isRetweetModalOpened
            ? "fixed top-0 left-0 w-screen h-screen bg-black/50 z-20 flex justify-center items-center"
            : "hidden"
        )}
        onClick={toggleRetweetModal}
      >
        <div className='flex flex-col w-2/3 space-y-5 py-1 h-2/3 bg-gray-800 overflow-y-auto'>
          {tweets?.length ? (
            tweets.map((retweet, index) => (
              <ReTweet key={`retweet-${index}`} {...retweet} />
            ))
          ) : (
            <div className='flex space-x-4 items-center justify-center'>
              <div className='text-md font-medium text-gray-900 break-normal'>
                리트윗이 없어요.
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={cls(
          isCommentModalOpened
            ? "fixed top-0 left-0 w-screen h-screen bg-black/50 z-20 flex justify-center items-center"
            : "hidden"
        )}
        onClick={toggleCommentModal}
      >
        <div className='flex flex-col w-2/3 space-y-5 py-10 px-2 h-2/3 bg-white overflow-y-auto'>
          {comments?.length ? (
            comments.map((comment, index) => {
              const {
                createdAt,
                user: { username },
                parent,
              } = comment;
              return (
                !parent && (
                  <ModalComment
                    userName={username}
                    writtenAt={timeFormatter(createdAt.toString())}
                    {...comment}
                  />
                )
              );
            })
          ) : (
            <div className='flex space-x-4 items-center justify-center'>
              <div className='text-md font-medium text-gray-900 break-normal'>
                댓글이 없어요.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TweetPost;
