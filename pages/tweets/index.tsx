import type { NextPage } from "next";

import CircleLinkButton from "../components/common/circle-link-button";
import Layout from "@/pages/components/common/layout";

import useInfiniteList from "@/libs/client/useInfiniteList";
import { TWEETS_API_ROUTE } from "@/libs/util/apiroutes";
import TweetPost from "../components/tweet-post";

import type { TweetData } from "../components/tweet-post";
import React from "react";
import BottomPadder from "../components/common/bottom-padder";
import LoadingCover from "../components/common/loading-cover";

type Tweets = TweetData[];

const Community: NextPage = () => {
  const tweetList = useInfiniteList({
    url: TWEETS_API_ROUTE.INDEX,
    numPerPage: 6,
  });

  return (
    <Layout title='동네생활' hasTopBar seoTitle='게시판' hasBottomBar>
      <div className='w-full max-h-screen max-w-xl bg-inherit flex flex-col justify-start space-y-1 overflow-y-auto'>
        {tweetList.status !== "loading" && tweetList.status !== "error-init" ? (
          (tweetList.data as Tweets).map((tweet, index) => {
            console.log(tweet);
            return (
              <div
                className='cursor-pointer flex flex-col items-start border-b   hover:bg-emerald-900'
                key={`tweets${index}`}
                onClick={(event: React.MouseEvent) => event.preventDefault()}
              >
                {
                  //href={`/tweets/${tweet.id}`}
                }
                <TweetPost {...tweet} />
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
      <CircleLinkButton tooltip='New Tweet' linkAddress='/tweets/upload' />
    </Layout>
  );
};

export default Community;
