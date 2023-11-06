import Image from "next/image";
import useMutation from "@/libs/client/useMutation";
import {
  MEETS_API_ROUTE,
  REVIEWS_API_ROUTE,
  COMMUNITY_API_ROUTE,
} from "@/libs/util/apiroutes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import SubmitButton from "./submit-button";
import TextArea from "./textarea";
import type { TweetComment, TweetCommentLike, User } from "@prisma/client";

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
  owner: boolean;
  postId: string;
  parentId?: number;
  comments?: CommentType[];
  likes?: number;
  kind: "MeetUp" | "Review" | "Community";
}

interface EditForm {
  edit: string;
}

interface ReplyForm {
  reply: string;
}

const Comment = ({
  id,
  userId,
  postId,
  userName,
  avatar,
  text,
  writtenAt,
  owner = true,
  comments = [],
  parentId = 0,
  likes = 0,
  kind,
}: CommentProps) => {
  const { register, handleSubmit, setValue } = useForm<any>();

  const apiRoute = {
    MeetUp: MEETS_API_ROUTE,
    Community: COMMUNITY_API_ROUTE,
    Review: REVIEWS_API_ROUTE,
  }[kind];

  const [isEditting, setisEditting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const { trigger: deleteTrigger } = useMutation(
    apiRoute.COMMENTS_EDIT(postId, id),
    "DELETE"
  );
  const { trigger: EditTrigger } = useMutation(
    apiRoute.COMMENTS_EDIT(postId, id),
    "POST"
  );
  const { trigger: ReplyTrigger } = useMutation(
    apiRoute.COMMENTS_REPLY(postId, id),
    "POST"
  );
  const { trigger: LikeTrigger } = useMutation(
    apiRoute.COMMENTS_LIKE(postId, id),
    "POST"
  );

  const onLikeClick = async () => {
    await LikeTrigger();
    mutate(apiRoute.DETAIL(postId));
  };
  const onReplyClick = () => {
    setisEditting(false);
    setIsReplying((prev) => !prev);
  };
  const onEditClick = () => {
    setIsReplying(false);
    setisEditting((prev) => !prev);
  };
  const onDeleteClick = async () => {
    const choice = confirm("정말 삭제하시겠습니까?");
    if (choice) {
      await deleteTrigger();
      mutate(apiRoute.DETAIL(postId));
    }
  };

  const onEditValid = async ({ edit }: EditForm) => {
    setisEditting(false);
    await EditTrigger({ edit });
    mutate(apiRoute.DETAIL(postId));
  };

  const onReplyValid = async ({ reply }: ReplyForm) => {
    setIsReplying(false);
    await ReplyTrigger({ reply, parentId: id });
    mutate(apiRoute.DETAIL(postId));
  };

  return (
    <div className='w-full flex flex-col items-start space-x-3 border-b border-b-gray-200 mb-1'>
      <div className='flex flex-col w-full'>
        <div className='flex w-full'>
          {avatar ? (
            <Image
              src={avatar}
              className='w-8 h-8 rounded-full'
              width={8}
              height={8}
              alt=''
            />
          ) : (
            <div className='w-8 h-8 mt-1  bg-slate-300 rounded-full' />
          )}
          <div className='text-md font-medium text-gray-300 flex space-x-2 p-1'>
            <div className='flex justify-center items-center'>{userName}</div>
            <button onClick={onLikeClick}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z'
                />
              </svg>
              {likes}
            </button>
            {!parentId && (
              <button onClick={onReplyClick}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
                  />
                </svg>
              </button>
            )}
            {owner && (
              <>
                <button onClick={onEditClick}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke={isEditting ? "red" : "currentColor"}
                    className='w-5 h-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
                    />
                  </svg>
                </button>
                <button onClick={onDeleteClick}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
        <span className='text-xs text-gray-400 mt-1'>{writtenAt}</span>
      </div>
      <div className='w-full'>
        <div className='text-gray-300 mt-2 w-full'>{text}</div>
        {isEditting && (
          <form className='w-full' onSubmit={handleSubmit(onEditValid)}>
            <TextArea
              label='Edit'
              name='edit'
              register={register("edit", { required: true })}
              required={true}
              setValue={setValue}
              value={text}
            />
            <SubmitButton text='Edit' />
          </form>
        )}
        {isReplying && (
          <form className='w-full' onSubmit={handleSubmit(onReplyValid)}>
            <TextArea
              label='Reply'
              name='reply'
              register={register("reply", { required: true })}
              required={true}
              setValue={setValue}
              value={""}
            />
            <SubmitButton text='Reply to Comment' />
          </form>
        )}
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
                  <Comment
                    comments={comments as []}
                    key={index}
                    owner={String(ownerId) === userId}
                    writtenAt={createdAt.toString()}
                    userId={userId}
                    avatar={avatar as string}
                    text={text}
                    userName={username}
                    parentId={parentId}
                    likes={likes?.length}
                    postId={postId}
                    id={replyId.toString()}
                    kind={kind}
                  />
                )
              );
            })
          : null}
      </div>
    </div>
  );
};

export default Comment;
