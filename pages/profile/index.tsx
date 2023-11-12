import { ActivityLog, Notification } from "@prisma/client";
import Layout from "../components/common/layout";
import useDetailPage from "@/libs/client/useDetailPage";
import { activityLogParser } from "@/libs/util/activity-log-parser";
import Link from "next/link";
import { useState } from "react";
import cls from "@/libs/util/cls";
import { notificationLogParser } from "@/libs/util/notification-log-parser";
import CheckIcon from "../components/icons/check";
import HeartIcon from "../components/icons/heart";
import FilledCalendar from "../components/icons/filled-calendar";
import ArrowInCircleIcon from "../components/icons/arrow-in-circle";
import CreatedTime from "../components/icons/created-time";
import Modal from "../components/modal";
import LoadingCover from "../components/common/loading-cover";
import { PROFILE_API_ROUTE } from "@/libs/util/apiroutes";

interface UserData {
  meetUpLikes: {
    meetUpId: number;
  }[];
  introduction?: string;
  id: number;
  email: string | null;
  phone: string | null;
  password: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: string | null;
  activityLogs: ActivityLog[];
  notifications: Notification[];
}

const Profile = () => {
  const [isActivityModalOpened, setIsActivityModalOpened] = useState(false);
  const [isNotificationModalOpened, setIsNotificationModalOpened] =
    useState(false);
  const userDetail = useDetailPage<UserData>(PROFILE_API_ROUTE.ME);
  const onActivityLogClick = () => setIsActivityModalOpened((prev) => !prev);
  const onNotificationLogClick = () =>
    setIsNotificationModalOpened((prev) => !prev);

  switch (userDetail.status) {
    case "ok":
      const { username, activityLogs, notifications, introduction } =
        userDetail.data;
      return (
        <Layout title='프로필' seoTitle='내계정' hasBottomBar hasTopBar>
          <div className='px-4 text-gray-300 h-full w-full'>
            <div className='profile px-4 flex items-center cursor-pointer py-4 space-x-4 border-t border-b'>
              <div className='rounded-full w-[52px] h-[52px] bg-orange-500' />
              <div className='flex-col space-y-1'>
                <p className='text-sm font-medium text-gray-300'>{username}</p>
                <Link
                  href='/profile/edit'
                  className='text-xs font-medium hover:text-orange-400'
                >
                  Edit profile &rarr;
                </Link>
              </div>
            </div>
            <div className='intoduction-box mt-2 px-4 flex flex-col space-y-3 justify-start '>
              <span className='text-sm font-md text-gray-300'>
                Introduction
              </span>
              <div className='h-24 w-full text-sm text-gray-400 rounded-md break-normal bg-color-white shadow-sm border-2 border-gray-400'>
                {introduction ||
                  "Edif profile을 눌러서 소개문구를 작성해보세요."}
              </div>
            </div>
            <div className='p-4'>
              <h3 className='text-sm font-md text-gray-300'>활동내역</h3>
              <div className='activity-box mt-4 grid grid-cols-3'>
                <div className='flex flex-col items-center justify-center space-y-2'>
                  <button
                    className='flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-orange-600 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-700 focus:ring-offset-2 border-1 border-orange-600 text-white'
                    onClick={onActivityLogClick}
                  >
                    <FilledCalendar className='w-6 h-6' />
                  </button>
                  <span>내 활동 로그</span>
                </div>
                <div className='flex flex-col items-center justify-center space-y-2'>
                  <button
                    className='flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-orange-600 hover:bg-orange-800 focus:outline-none focus:ring-1 focus:ring-orange-700 focus:ring-offset-2 border-1 border-orange-600 text-white'
                    onClick={onNotificationLogClick}
                  >
                    <CheckIcon className='w-6 h-6' />
                  </button>
                  <span>알람</span>
                </div>
                <div className='flex flex-col items-center justify-center space-y-2'>
                  <button className='flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-orange-600 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-700 focus:ring-offset-2 border-1 border-orange-600 text-white'>
                    <HeartIcon className='h-6 w-6 fill-none' />
                  </button>
                  <span>Like</span>
                </div>
              </div>
            </div>
            <Modal
              trigger={isActivityModalOpened}
              onClickTrigger={onActivityLogClick}
            >
              <div className='flex flex-col space-y-5 py-10 px-2 h-2/3 bg-white overflow-y-auto'>
                {activityLogs?.map((log, index) => {
                  const { createdAt, type, placeId } = log;
                  const { message, link } = activityLogParser({
                    activity: type,
                    id: placeId as number,
                  });
                  return (
                    <Link
                      href={link}
                      key={index}
                      className='w-full flex justify-between px-5 border-b pb-5 cursor-pointer'
                    >
                      <div className='flex space-x-4 items-center'>
                        <div className='pt-2 flex-col'>
                          <div className='text-md font-medium text-gray-800 break-normal'>
                            {message}
                          </div>
                          <div className='flex items-center space-x-1 text-sm text-gray-800'>
                            <CreatedTime createdAt={createdAt} />
                            <div className='text-gray-800'>
                              <ArrowInCircleIcon className='w-6 h-6' />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Modal>
            <Modal
              trigger={isNotificationModalOpened}
              onClickTrigger={onNotificationLogClick}
            >
              <div className='flex flex-col space-y-5 py-10 px-2 h-2/3 bg-white overflow-y-auto'>
                {notifications?.map((log, index) => {
                  const { createdAt, type, placeId } = log;
                  const { message, link } = notificationLogParser({
                    notification: type,
                    id: placeId,
                  });
                  return (
                    <Link
                      href={link}
                      key={index}
                      className='w-full flex justify-between px-5 border-b pb-5 cursor-pointer'
                    >
                      <div className='flex space-x-4 items-center'>
                        <div className='pt-2 flex-col'>
                          <div className='text-md font-medium text-gray-800 break-normal'>
                            {message}
                          </div>
                          <div className='flex items-center space-x-1 text-sm text-gray-800'>
                            <CreatedTime createdAt={createdAt} />
                            <div className='text-gray-800'>
                              <ArrowInCircleIcon className='w-6 h-6' />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Modal>
          </div>
        </Layout>
      );

    default:
      return (
        <Layout title='프로필' seoTitle='내계정' hasBottomBar hasTopBar>
          <LoadingCover />
        </Layout>
      );
  }
};

export default Profile;
