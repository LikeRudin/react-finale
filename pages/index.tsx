import { NextPage } from "next";
import Link from "next/link";

import HeartIcon from "./components/icons/heart";
import PeopleIcon from "./components/icons/people";
import BubbleComment from "./components/icons/bubble-comment";
import CalendarIcon from "./components/icons/calender";
import EditIcon from "./components/icons/edit";
import CircleLinkButton from "@/pages/components/common/circle-link-button";
import Layout from "@/pages/components/common/layout";

import { MEETS_API_ROUTE } from "@/libs/util/apiroutes";
import cls from "@/libs/util/cls";

import useInfiniteList from "@/libs/client/useInfiniteList";

import CreatedTime from "./components/icons/created-time";
import BottomPadder from "./components/common/bottom-padder";
import LoadingCover from "./components/common/loading-cover";

const Home: NextPage = () => {
  const meetUpList = useInfiniteList({
    url: MEETS_API_ROUTE.INDEX,
    numPerPage: 10,
  });

  switch (meetUpList.status) {
    case "ok":
      const { data: meetUps, loadTrigger, additionalLoading } = meetUpList;
      return (
        <Layout hasBottomBar hasTopBar title='모여서함께' seoTitle='모여서함께'>
          <div className='w-full max-w-xl max-h-screen overflow-y-auto bg-inherit flex flex-col justify-start    '>
            {meetUps.map((item, index) => {
              const {
                user: { username },
                id,
                name,
                createdAt,
                schedule,
                comments,
                joins,
                likes,
                location,
                isOpened,
              } = item;
              return (
                <Link
                  href={`/meets/${id}`}
                  key={index}
                  className='pt-3 flex justify-between px-4 border-b pb-5 cursor-pointer  hover:bg-emerald-900'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='w-20 h-20 aspect-square bg-orange-400 rounded-md' />
                    <div className='pt-2 flex-col'>
                      <h3 className='text-md font-medium text-gray-100'>
                        {name}
                      </h3>
                      <div
                        className={cls(
                          "flex flex-start items-center text-sm",
                          isOpened ? "text-orange-100" : "text-gray-400"
                        )}
                      >
                        <CalendarIcon className='w-6 h-6' />
                        <CreatedTime createdAt={schedule} />
                      </div>
                      <p className='text-sm'>/{location}</p>
                      <span className='font-medium mt-1 text-sm text-gray-100'>
                        {`Host: ${String(username)}`}
                      </span>
                    </div>
                  </div>
                  <div className='flex flex-col justify-between items-end'>
                    <span className='text-xs text-gray-400 flex justify-center'>
                      <EditIcon className='w-4 h-4' />
                      <CreatedTime createdAt={createdAt} />
                    </span>
                    <div className='flex space-x-2 items-end justify-end'>
                      <div className='flex space-x-0.5 items-center text-sm text-gray-100'>
                        <PeopleIcon className='w-4 h-4' />
                        <span>{joins.length}</span>
                      </div>
                      <div className='flex space-x-0.5 items-center text-sm text-gray-100'>
                        <HeartIcon className='w-4 h-4' />
                        <span>{likes.length}</span>
                      </div>
                      <div className='flex space-x-0.5 items-center text-sm text-gray-100'>
                        <BubbleComment className='w-4 h-4' />
                        <span>{comments.length}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
            <button onClick={loadTrigger}>
              {additionalLoading === "loading-more"
                ? "Loading..."
                : additionalLoading === "reaching-end"
                ? "No more MeetUp"
                : "Load More"}
            </button>
          </div>
          <BottomPadder />
          <CircleLinkButton tooltip='New MeetUp' linkAddress='/meets/upload' />
        </Layout>
      );
    case "loading":
      return (
        <Layout hasBottomBar hasTopBar title='모여서함께' seoTitle='모여서함께'>
          <LoadingCover />
        </Layout>
      );
    case "error":
      return (
        <Layout hasBottomBar hasTopBar title='모여서함께' seoTitle='모여서함께'>
          <h1>알 수 없는 오류가 발생했어요</h1>
          <button onClick={() => meetUpList.refresh()}>눌러서 새로고침</button>
        </Layout>
      );
  }
};

export default Home;
