import type { NextPage } from "next";
import Layout from "../components/common/layout";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { withSessionSSR } from "@/libs/server/session";
import client from "@/libs/server/prisma-client";
import type {
  Tweet,
  TweetComment,
  TweetCommentLike,
  TweetLike,
  User,
} from "@prisma/client";

import { ROUTE_PATH, TWEETS_API_ROUTE } from "@/libs/util/apiroutes";

import TextArea from "../components/common/textarea";
import SubmitButton from "../components/common/submit-button";
import useMutation from "@/libs/client/useMutation";
import { useForm } from "react-hook-form";

import cls from "@/libs/util/cls";

import TweetPost from "../components/tweet-post";
import { useState } from "react";
import { UploadTweet } from "./upload-mockup";
import Comment from "../components/comment";
import type { CommentType } from "../components/comment";
import useDetailPage from "@/libs/client/useDetailPage";
import LoadingCover from "../components/common/loading-cover";

type TweetCommentData = CommentType & {
  user: User;
  likes: TweetCommentLike[];
  parent: TweetComment;
  comments: TweetCommentData[];
};

type TweetData = Tweet & {
  user: User;
  comments: TweetCommentData[];
  tweets: TweetData[];
  likes: TweetLike[];
  parent: TweetData;
  parentId: number;
};

type TweetDetail = { tweet: TweetData; isLiked: boolean };

type ReplyForm = {
  reply: string;
};

type TweetDetailProps = {
  tweetInit: TweetData;
  isLikedInit: boolean;
} & {
  userId: number;
  pageId: number;
};

const TweetDetail: NextPage<TweetDetailProps> = ({
  tweetInit,
  isLikedInit,
  userId,
  pageId,
}) => {
  const tweetDetail = useDetailPage<TweetDetail>(
    TWEETS_API_ROUTE.DETAIL(pageId),
    {
      tweet: tweetInit,
      isLiked: isLikedInit,
    }
  );

  const { register, handleSubmit, setValue } = useForm<ReplyForm>();
  const [submitForm, setSubmitForm] = useState<"Comment" | "Retweet">(
    "Comment"
  );
  const onCommentClick = () => setSubmitForm("Comment");
  const onRetweetClick = () => setSubmitForm("Retweet");

  const { trigger: commentTrigger } = useMutation(
    TWEETS_API_ROUTE.COMMENTS(pageId.toString()),
    "POST",
    tweetDetail.mutate
  );

  const onValid = ({ reply }: ReplyForm) => {
    commentTrigger({ reply });
  };

  switch (tweetDetail.status) {
    case "ok":
      const { tweet, isLiked } = tweetDetail.data;
      return (
        <Layout title={tweet.name} seoTitle={tweet.name} hasBack hasTopBar>
          <div className='h-full w-full'>
            <div className='w-full border-b mt-5'>
              <TweetPost
                {...tweet}
                isLiked={isLiked}
                mutate={() => tweetDetail.mutate()}
              />
            </div>
            <div className='grid border-b w-full mt-8 grid-cols-2'>
              <button
                onClick={onCommentClick}
                className={cls(
                  "pb-4 font-semibold text-sm border-b-2",
                  submitForm === "Comment"
                    ? " border-orange-700"
                    : "border-transparent hover:text-gray-400 text-gray-500"
                )}
              >
                Comment
              </button>
              <button
                onClick={onRetweetClick}
                className={cls(
                  "pb-4 font-semibold text-sm border-b-2",
                  submitForm === "Retweet"
                    ? " border-orange-700"
                    : "border-transparent hover:text-gray-400 text-gray-500"
                )}
              >
                Retweet
              </button>
            </div>

            {submitForm === "Comment" && (
              <div className='bg-[rgb(20,20,20)] w-full px-4 '>
                {tweet.comments.map((comment, index) => {
                  const { parent } = comment;
                  return (
                    !parent && (
                      <Comment
                        key={index}
                        {...comment}
                        userName={comment.user.username}
                        postId={tweet.id}
                        writtenAt={tweet.createdAt}
                        isOwner={tweet.userId === userId}
                        likes={tweet.likes.length}
                        kind='Tweet'
                        parentId={undefined}
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
            )}
            {submitForm === "Retweet" && <UploadTweet parentId={tweet.id} />}
          </div>
        </Layout>
      );
    default:
      return (
        <Layout title='Tweet Detail' seoTitle='Tweet' hasBack hasTopBar>
          <LoadingCover />
        </Layout>
      );
  }
};

export default TweetDetail;

export const getServerSideProps: GetServerSideProps = withSessionSSR(
  async ({ req, params }: GetServerSidePropsContext) => {
    if (!(params?.id && req.session.user)) {
      return { props: {} };
    }
    const id = +params.id.toString();

    await client.tweet.update({
      where: {
        id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    const { user } = req.session;
    const userId = +user?.id.toString();

    const TweetResponse = await client.tweet.getTweetDetail(id, userId);
    if (!TweetResponse) {
      return {
        redirect: {
          permanent: false,
          destination: ROUTE_PATH.TWEET,
        },
      };
    }
    const { tweet, isLiked } = TweetResponse;
    return {
      props: {
        tweetInit: JSON.parse(JSON.stringify(tweet)),
        isLikedInit: isLiked,
        userId,
        pageId: id,
      },
    };
  }
);
