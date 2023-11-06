import type { NextPage } from "next";
import Link from "next/link";

import Button from "@/pages/components/button";
import Layout from "@/pages/components/layout";
import MiniProfile from "@/pages/components/mini-profile";

import useSWR from "swr";
import { TWEETS_API_ROUTE } from "@/libs/util/apiroutes";
import type { Tweet, TweetComment, TweetLike, User } from "@prisma/client";
import { tweetCategoryParser } from "@/libs/util/category-parser";
import { timeFormatter } from "@/libs/util/time-formatter";

type Tweets = (Tweet & { user: User } & { comments: TweetComment[] } & {
  tweets: Tweet[];
} & { likes: TweetLike[] })[];

const Community: NextPage = () => {
  const { data } = useSWR(TWEETS_API_ROUTE.INDEX);

  return (
    <Layout title='동네생활' hasTopBar seoTitle='게시판' hasBottomBar>
      <div className='w-full  max-w-xl bg-inherit  flex flex-col justify-start space-y-5 overflow-y-auto'>
        {data?.status === "ok" &&
          (data.data as Tweets).map((item, index) => {
            const {
              name,
              category: categoryString,
              longitude,
              latitude,
              showLocation,
              description,
              user: { username },
              tweets,
              comments,
              createdAt,
              likes,
              id,
              userId,
            } = item;
            const category = tweetCategoryParser(categoryString);
            return (
              <Link
                className='cursor-pointer flex flex-col items-start pt-4 border-b pb-5  hover:bg-emerald-900'
                href={`/tweets/${id}`}
                key={`tweets${index}`}
              >
                <span className='flex ml-4 items:center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                  {category}
                </span>
                <div className='flex  items-center mt-2 px-4 space-x-6 '>
                  <MiniProfile
                    userName={username}
                    userId={userId}
                    text={"view profile →"}
                  />
                  <span className='text-gray-100 font-medium'>{name}</span>
                </div>

                <div>사진</div>
                <div className='mt-2 px-6 text-gray-200 font-sm'>
                  {description}
                </div>
                <div className='w-full grid grid-cols-2'>
                  <div className='mt-2 px-4  flex items-center justify-between text-gray-300 font-medium text-xs'>
                    <span>{timeFormatter(createdAt.toString())}</span>
                  </div>
                  <div className=' flex justify-end px-4 py-2.5 space-x-5 mt-2 text-sm text-gray-300'>
                    <div className='flex  items-center  space-x-2'>
                      <span>
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
                      </span>
                      <span className='text-sm'>추천 {likes.length}</span>
                    </div>
                    <div className='flex items-center space-x-2'>
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
                      </span>
                      <span className='text-sm'>댓글 {comments.length}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        <Button tooltip='New Tweet' linkAddress='/tweets/upload' />
      </div>
    </Layout>
  );
};

export default Community;
