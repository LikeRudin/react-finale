import type { NextPage } from "next";

import Layout from "@/pages/components/common/layout";

import useInfiniteList from "@/libs/client/useInfiniteList";
import { TWEETS_API_ROUTE } from "@/libs/util/apiroutes";

import type { TweetData } from "../components/tweet-post";
import React from "react";

import TweetPost from "../components/tweet-post";
import BottomPadder from "../components/common/bottom-padder";
import LoadingCover from "../components/common/loading-cover";
import TweetUploadForm from "../components/tweet-upload-form";
import Link from "next/link";
import ArrowInCircleIcon from "../components/icons/arrow-in-circle";

type Tweets = TweetData[];

const Community: NextPage = () => {
  const tweetList = useInfiniteList({
    url: TWEETS_API_ROUTE.INDEX,
    numPerPage: 6,
  });

  return (
    <Layout title='동네생활' hasTopBar seoTitle='게시판' hasBottomBar>
      <div className='w-full max-h-screen max-w-xl bg-inherit flex flex-col justify-start overflow-y-auto'>
        <TweetUploadForm mutate={() => tweetList.refresh()} />
        {tweetList.status !== "loading" && tweetList.status !== "error-init" ? (
          (tweetList.data as Tweets).map((tweet, index) => {
            return (
              <div
                className='cursor-pointer relative flex flex-col items-start border-b   hover:bg-emerald-900 group/link'
                key={`tweets${index}`}
                onClick={(event: React.MouseEvent) => event.preventDefault()}
              >
                <Link href={`/tweets/${tweet.id}`}>
                  <ArrowInCircleIcon className='hidden group-hover/link:block group-hover/link:absolute top-5 right-4  w-8 h-8 hover:stroke-orange-300' />
                </Link>
                <TweetPost {...tweet} mutate={() => tweetList.refresh()} />
              </div>
            );
          })
        ) : (
          <LoadingCover />
        )}
        {tweetList.status === "loading" ||
        tweetList.status === "error-init" ? null : (
          <button onClick={tweetList.loadTrigger}>
            {tweetList.status === "loading-more"
              ? "Loading..."
              : tweetList.status === "reaching-end"
              ? "No more Tweet"
              : "Load More"}
          </button>
        )}
      </div>

      <BottomPadder />
    </Layout>
  );
};

export default Community;
