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
import type { TweetComment, User } from "@prisma/client";
import { timeFormatter } from "@/libs/util/time-formatter";
import ThumbUpIcon from "./icons/thumb-up";
import EditIcon from "./icons/edit";
import DeleteIcon from "./icons/delete";
import ReplyIcon from "./icons/reply-square";
import cls from "@/libs/util/cls";
import MiniProfile from "./mini-profile";
import ArrowReplyIcon from "./icons/arrow-reply";
import CreatedTime from "./icons/created-time";

type LikesType = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  commentId: number;
};

export type CommentType = TweetComment & {
  user: User;
  comments: [] | undefined;
  likes: LikesType[] | undefined;
  parent: CommentType;
};

interface CommentProps {
  userName: string;
  avatar?: string;
  text: string;
  writtenAt: Date;
  id: number;
  userId: number;
  isOwner: boolean;
  postId: number;
  parentId?: number;
  comments?: CommentType[];
  likes?: number;
  kind: "MeetUp" | "Review" | "Tweet";
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
  isOwner = false,
  comments = [],
  parentId = 0,
  likes = 0,
  kind,
}: CommentProps) => {
  const { register, handleSubmit, setValue } = useForm<any>();

  const [isEditing, setisEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const onReplyClick = () => {
    setisEditing(false);
    setIsReplying((prev) => !prev);
  };
  const onEditClick = () => {
    setIsReplying(false);
    setisEditing((prev) => !prev);
  };

  const apiRoute = {
    MeetUp: MEETS_API_ROUTE,
    Tweet: TWEETS_API_ROUTE,
    Review: REVIEWS_API_ROUTE,
  }[kind];

  const { trigger: deleteTrigger } = useMutation(
    apiRoute.COMMENTS_EDIT(postId, id),
    "DELETE",
    () => mutate(apiRoute.DETAIL(postId))
  );
  const { trigger: EditTrigger } = useMutation(
    apiRoute.COMMENTS_EDIT(postId, id),
    "POST",
    () => mutate(apiRoute.DETAIL(postId))
  );
  const { trigger: ReplyTrigger } = useMutation(
    apiRoute.COMMENTS_REPLY(postId, id),
    "POST",
    () => mutate(apiRoute.DETAIL(postId))
  );
  const { trigger: LikeTrigger } = useMutation(
    apiRoute.COMMENTS_LIKE(postId, id),
    "POST",
    () => mutate(apiRoute.DETAIL(postId))
  );

  const onLikeClick = () => {
    LikeTrigger();
  };

  const onDeleteClick = () => {
    const choice = confirm("정말 삭제하시겠습니까?");
    if (choice) {
      deleteTrigger();
    }
  };

  const onEditValid = ({ edit }: EditForm) => {
    setisEditing(false);
    EditTrigger({ edit });
  };

  const onReplyValid = ({ reply }: ReplyForm) => {
    setIsReplying(false);
    ReplyTrigger({ reply, parentId: id });
  };

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
            <div className='w-[50%] text-md font-medium text-gray-300 items-center flex space-x-2 p-1'>
              {isOwner && (
                <>
                  <button onClick={onEditClick}>
                    <EditIcon
                      className={cls(
                        "w-5 h-5 hover:stroke-orange-300",
                        isEditing ? "stroke-red-400" : "stroke-currentColor"
                      )}
                    />
                  </button>
                  <button onClick={onDeleteClick}>
                    <DeleteIcon className='w-5 h-5 hover:stroke-orange-300' />
                  </button>
                </>
              )}
            </div>
          </div>
          <CreatedTime createdAt={writtenAt} />
        </div>
      </div>
      <div className='w-full'>
        <div className='text-gray-300 mt-1 w-full'>{text}</div>
        <div className='w-full flex items-center justify-end space-x-1 px-4'>
          <button className='grid grid-cols-2' onClick={onLikeClick}>
            <ThumbUpIcon className='w-5 h-5 hover:stroke-orange-300' />
            <span>{likes}</span>
          </button>
          {!parentId && (
            <button className='grid grid-cols-2' onClick={onReplyClick}>
              <ReplyIcon className='w-5 h-5 hover:stroke-orange-300' />
              <span>{comments?.length}</span>
            </button>
          )}
        </div>
        {isEditing && (
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
                parentId === id && (
                  <Comment
                    comments={comments as []}
                    key={index}
                    isOwner={ownerId === userId}
                    writtenAt={createdAt}
                    userId={userId}
                    avatar={avatar as string}
                    text={text}
                    userName={username}
                    parentId={parentId}
                    likes={likes?.length}
                    postId={postId}
                    id={replyId}
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
