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
import SubmitButton from "./submit-button";
import TextArea from "./textarea";
import type { TweetComment, TweetCommentLike, User } from "@prisma/client";
import { timeFormatter } from "@/libs/util/time-formatter";
import ThumbUpIcon from "./icons/thumb-up";
import EditIcon from "./icons/edit";
import DeleteIcon from "./icons/delete";
import ReplyIcon from "./icons/reply";
import cls from "@/libs/util/cls";
import MiniProfile from "./mini-profile";

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
  owner = true,
  comments = [],
  parentId = 0,
  likes = 0,
  kind,
}: CommentProps) => {
  const { register, handleSubmit, setValue } = useForm<any>();

  const apiRoute = {
    MeetUp: MEETS_API_ROUTE,
    Tweet: TWEETS_API_ROUTE,
    Review: REVIEWS_API_ROUTE,
  }[kind];

  const [isEditing, setisEditing] = useState(false);
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
    setisEditing(false);
    setIsReplying((prev) => !prev);
  };
  const onEditClick = () => {
    setIsReplying(false);
    setisEditing((prev) => !prev);
  };
  const onDeleteClick = async () => {
    const choice = confirm("정말 삭제하시겠습니까?");
    if (choice) {
      await deleteTrigger();
      mutate(apiRoute.DETAIL(postId));
    }
  };

  const onEditValid = async ({ edit }: EditForm) => {
    setisEditing(false);
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
          <MiniProfile
            userName={userName}
            imagepath={avatar}
            userId={+userId}
            widthAndHeight={"w-[32px] h-[32px]"}
          />

          <div className='w-[50%] text-md font-medium text-gray-300 items-center flex space-x-2 p-1'>
            {owner && (
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
      </div>
      <div className='w-full'>
        <div className='text-gray-300 mt-1 w-full'>{text}</div>
        <div className='w-full flex items-center justify-end space-x-1 px-4'>
          <span className='text-xs text-gray-400 mt-1'>{writtenAt}</span>
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
                parentId.toString() === id && (
                  <Comment
                    comments={comments as []}
                    key={index}
                    owner={String(ownerId) === userId}
                    writtenAt={timeFormatter(createdAt.toString())}
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
