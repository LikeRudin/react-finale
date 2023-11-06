import type { NextPage } from "next";
import Layout from "../components/layout";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { withSessionSSR } from "@/libs/server/session";
import client from "@/libs/server/prisma-client";
import type { Tweet, TweetComment, TweetLike, User } from "@prisma/client";
import useSWR from "swr";
import { ROUTE_PATH, TWEETS_API_ROUTE } from "@/libs/util/apiroutes";
import { tweetCategoryParser } from "@/libs/util/category-parser";
import MiniProfile from "@/pages/components/mini-profile";
import { timeFormatter } from "@/libs/util/time-formatter";

type TweetData = {
  tweet: Tweet & { user: User } & { comments: TweetComment[] } & {
    tweets: Tweet[];
  } & { likes: TweetLike[] };
  isLiked: boolean;
};

type TweetDetailProps = {
  tweetInit: TweetData["tweet"];
  isLikedInit: boolean;
} & {
  userId: number;
  pageId: number;
};

interface TweetSWRResponse {
  status: "ok" | "fail" | "error";
  data: { tweet: TweetData["tweet"]; isLiked: boolean };
}

const TweetDetail: NextPage<TweetDetailProps> = ({
  tweetInit,
  isLikedInit,
  userId,
  pageId,
}) => {
  const {
    data: {
      data: { tweet, isLiked },
    },
    mutate,
  } = useSWR(TWEETS_API_ROUTE.DETAIL(pageId.toString()), {
    fallbackData: {
      status: "ok",
      data: {
        tweet: tweetInit,
        isLiked: isLikedInit,
      },
    },
  }) as { data: TweetSWRResponse } & ReturnType<typeof useSWR>;
  return (
    <Layout title={tweet.name} seoTitle={tweet.name} hasBack hasTopBar>
      <div className='h-full'>
        <div className='mb-2 border-b'>
          <div className='cursor-pointer flex flex-col items-start py-5'>
            <span className='flex ml-4 items:center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
              {tweetCategoryParser(tweet.category)}
            </span>
            <div className='px-4'>
              <div className='flex items-center mt-2 space-x-6'>
                <MiniProfile
                  userName={tweet.user.username}
                  userId={tweet.userId}
                />
                <div className='mt-2 px-4 text-gray-100 text-sm'>
                  {tweet.name}
                </div>
              </div>
              <div>사진</div>
              <div className='mt-2  text-gray-200'>{tweet.description}</div>
              <div className='mt-5  w-full flex items-center justify-between text-gray-200 font-medium text-xs'>
                <span>{timeFormatter(tweet.createdAt.toString())}</span>
              </div>
              <div className='w-full flex  py-2.5 space-x-5 mt-3 text-sm text-gray-300'>
                <span className='flex items-center space-x-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-4 h-4 '
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z'
                    />
                  </svg>
                  <span>추천 {tweet.likes.length}</span>
                </span>
                <span className='flex items-center space-x-2 text-sm'>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    ></path>
                  </svg>
                  <span>댓글 {tweet.comments.length}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='flex items-start space-x-3 px-5 border-b border-b-gray-200 p-4'>
            <div className='w-8 h-8 mt-1 bg-slate-300 rounded-full' />
            <div>
              <span className='text-sm block font-medium text-gray-300'>
                린
              </span>
              <span className='text-xs text-gray-600 mt-1'>2시간 전</span>
              <p className='text-gray-300 mt-2'>족발은 이제 그만..!</p>
            </div>
          </div>
        </div>
        <div className='px-4 mt-2'>
          <label
            htmlFor='description-textarea'
            className='mb-1 block text-sm font-medium text-gray-300'
          >
            Reply
          </label>
          <div>
            <textarea
              id='description-textarea'
              rows={4}
              className='mt-1 shaodw-sm w-full focus:ring-orange-800 focus:ring-2 focus:ring-offset-1  rounded-md  border-gray-400 focus:border-transparent'
            />
          </div>
        </div>
        <div className='px-4'>
          <button className='w-full mt-5 bg-orange-700 hover:bg-orange-800 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none'>
            Add Reply
          </button>
        </div>
      </div>
    </Layout>
  );
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

    const tweetData = await client.tweet.getTweetDetail(id, userId);
    if (!tweetData) {
      return {
        redirect: {
          permanent: false,
          destination: ROUTE_PATH.TWEET,
        },
      };
    }
    const { tweet, isLiked } = tweetData;
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
