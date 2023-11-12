import type { NextPage } from "next";
import Link from "next/link";

import useInfiniteList from "@/libs/client/useInfiniteList";
import { TWEETS_API_ROUTE } from "@/libs/util/apiroutes";

import Layout from "@/pages/components/common/layout";
import TweetPost from "../components/tweet-post";
import BottomPadder from "../components/common/bottom-padder";
import LoadingCover from "../components/common/loading-cover";
import TweetUploadForm from "../components/tweet-upload-form";

import ArrowInCircleIcon from "../components/icons/arrow-in-circle";

const Community: NextPage = () => {
  const tweetList = useInfiniteList({
    url: TWEETS_API_ROUTE.INDEX,
    numPerPage: 6,
  });

  switch (tweetList.status) {
    case "ok":
      const { data: tweet, additionalLoading } = tweetList;
      return (
        <Layout title='동네생활' hasTopBar seoTitle='게시판' hasBottomBar>
          <div className='w-full max-h-screen max-w-xl bg-inherit flex flex-col justify-start overflow-y-auto'>
            <TweetUploadForm mutate={() => tweetList.refresh()} />
            {tweet.map((tweet, index) => {
              return (
                <div
                  className='cursor-pointer relative flex flex-col items-start border-b   hover:bg-emerald-900 group/link'
                  key={`tweets${index}`}
                >
                  <Link href={`/tweets/${tweet.id}`}>
                    <ArrowInCircleIcon className='hidden group-hover/link:block group-hover/link:absolute top-5 right-4  w-8 h-8 hover:stroke-orange-300' />
                  </Link>
                  <TweetPost {...tweet} mutate={() => tweetList.refresh()} />
                </div>
              );
            })}
            {
              <button onClick={tweetList.loadTrigger}>
                {additionalLoading === "loading-more"
                  ? "Loading..."
                  : additionalLoading === "reaching-end"
                  ? "No more Tweet"
                  : "Load More"}
              </button>
            }
          </div>
          <BottomPadder />
        </Layout>
      );
    case "loading":
      return (
        <Layout title='동네생활' hasTopBar seoTitle='게시판' hasBottomBar>
          <LoadingCover />
          <BottomPadder />
        </Layout>
      );
    case "error":
      return (
        <Layout title='동네생활' hasTopBar seoTitle='게시판' hasBottomBar>
          <h1>오류가 발생했어요! </h1>
          <button onClick={() => tweetList.refresh()}>새로고침</button>
          <BottomPadder />
        </Layout>
      );
  }
};

export default Community;
