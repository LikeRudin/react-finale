import Image from "next/image";
import useMutation from "@/libs/client/useMutation";
import {
  MEETS_API_ROUTE,
  REVIEWS_API_ROUTE,
  TWEETS_API_ROUTE,
} from "@/libs/util/apiroutes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import SubmitButton from "./common/submit-button";
import TextArea from "./common/textarea";
import type { TweetComment, TweetCommentLike, User } from "@prisma/client";
import { timeFormatter } from "@/libs/util/time-formatter";
import ThumbUpIcon from "./icons/thumb-up";
import EditIcon from "./icons/edit";
import DeleteIcon from "./icons/delete";
import ReplyIcon from "./icons/reply-square";
import cls from "@/libs/util/cls";
import MiniProfile from "./mini-profile";
import ArrowReplyIcon from "./icons/arrow-reply";

type CommentType = TweetComment & {
  user: User;
  comments: TweetComment[];
  likes: TweetCommentLike[];
};

interface CommentProps {
  userName: string;
  avatar?: string;
  text: string;
  writtenAt: string;
  id: string;
  userId: string;
  parentId?: number;
  comments?: CommentType[];
}

const ModalComment = ({
  id,
  userId,
  userName,
  avatar,
  text,
  writtenAt,
  comments = [],
  parentId = 0,
}: CommentProps) => {
  return (
    <div className='border-t-[1px] border-t-gray-700 w-full flex flex-col items-start space-x-3 px-2  border-b-gray-200 bg-gray-800 rounded-sm mb-1'>
      <div className='flex flex-col w-full'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center w-[50%]'>
            <div className='flex'>
              {parentId ? (
                <ArrowReplyIcon className='w-4 h-4 -scale-x-100' />
              ) : null}
              <MiniProfile
                userName={userName}
                imagepath={avatar}
                userId={+userId}
                widthAndHeight={"w-[32px] h-[32px] stroke-gray-300"}
              />
            </div>
          </div>
          <span className=' text-xs text-gray-400 mt-1'>{writtenAt}</span>
        </div>
      </div>
      <div className='w-full'>
        <div className='text-gray-300 mt-1 w-full'>{text}</div>

        {comments && comments.length
          ? comments.map((comment, index): any => {
              const {
                id: replyId,
                text,
                createdAt,
                user: { username, id: ownerId, avatar },
                comments,
                parentId,
                likes,
              } = comment;
              return (
                parentId &&
                parentId.toString() === id && (
                  <ModalComment
                    comments={comments as []}
                    key={index}
                    writtenAt={timeFormatter(createdAt.toString())}
                    userId={userId}
                    avatar={avatar as string}
                    text={text}
                    userName={username}
                    parentId={parentId}
                    id={replyId.toString()}
                  />
                )
              );
            })
          : null}
      </div>
    </div>
  );
};

export default ModalComment;
