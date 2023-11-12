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
import cls from "@/libs/util/cls";
import ReplyIcon from "./icons/reply-square";
import React, { useState } from "react";

import ReTweet from "./retweet";
import ModalComment from "./modal-comment";
import CategoryTextIcon from "./icons/category-text";
import CreatedTime from "./icons/created-time";

import Modal from "./modal";

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

type TweetPostProps = TweetData & {
  mutate: () => void;
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
  mutate,
}: TweetPostProps) => {
  const [isRetweetModalOpened, setIsRetweetModalOpened] = useState(false);
  const [isCommentModalOpened, setIsCommentModalOpened] = useState(false);

  const toggleRetweetModal = () => setIsRetweetModalOpened((prev) => !prev);

  const toggleCommentModal = () => setIsCommentModalOpened((prev) => !prev);

  const { trigger: likeTrigger } = useMutation(
    TWEETS_API_ROUTE.LIKE(id),
    "POST",
    () => mutate()
  );
  const onLikeClick = () => {
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
              imagepath={user.avatar}
              widthAndHeight='w-8 h-8'
            />
            <CategoryTextIcon text={tweetCategoryParser(category)} />
            <CreatedTime createdAt={createdAt} />
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
                <ReplyIcon className='w-5 h-5 group-hover:stroke-orange-300 stroke-white' />
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
      <Modal onClickTrigger={toggleRetweetModal} trigger={isRetweetModalOpened}>
        <div className='flex flex-col w-[30rem]  space-y-5 py-10 h-2/3 bg-gray-800 overflow-y-auto'>
          {tweets?.length ? (
            tweets.map((retweet, index) => (
              <ReTweet
                key={`retweet-${index}`}
                avatar={retweet.user.avatar}
                {...retweet}
              />
            ))
          ) : (
            <div className='flex space-x-4 items-center justify-center'>
              <div className='text-md font-medium text-orange-300 break-normal'>
                리트윗이 없어요.
              </div>
            </div>
          )}
        </div>
      </Modal>
      <Modal trigger={isCommentModalOpened} onClickTrigger={toggleCommentModal}>
        <div className='flex flex-col w-[30rem]  space-y-5 py-10 h-2/3 bg-gray-800 overflow-y-auto'>
          {comments?.length ? (
            comments.map((comment, index) => {
              const { createdAt, user, parent } = comment;
              return (
                !parent && (
                  <ModalComment
                    key={`comment${index}`}
                    userName={user?.username}
                    avatar={user?.avatar}
                    writtenAt={timeFormatter(createdAt.toString())}
                    {...comment}
                  />
                )
              );
            })
          ) : (
            <div className='flex space-x-4 items-center justify-center'>
              <div className='text-md font-medium text-orange-300 break-normal'>
                댓글이 없어요.
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
export default TweetPost;
