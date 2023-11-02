import { ActivityLog, Notification } from "@prisma/client";
import Layout from "../components/layout";
import useUser from "@/libs/client/useUser";
import { activityLogParser } from "@/libs/util/activity-log-parser";
import Link from "next/link";
import { useState } from "react";
import cls from "@/libs/util/cls";
import { notificationLogParser } from "@/libs/util/notification-log-parser";

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
  const user = useUser<UserData>("PROFILE");
  const onActivityLogClick = () => setIsActivityModalOpened((prev) => !prev);
  const onNotificationLogClick = () =>
    setIsNotificationModalOpened((prev) => !prev);
  return (
    <Layout title='프로필' seoTitle='내계정' hasBottomBar>
      {user.status === "ok" ? (
        <div className='px-4 py-16 text-gray-300 h-full'>
          <div className='profile px-4 flex items-center cursor-pointer py-4 space-x-4 border-t border-b'>
            <div className='rounded-full w-[52px] h-[52px] bg-orange-500' />
            <div className='flex-col space-y-1'>
              <p className='text-sm font-medium text-gray-300'>
                {user.userData.username}
              </p>
              <Link
                href='/profile/edit'
                className='text-xs font-medium hover:text-orange-400'
              >
                Edit profile &rarr;
              </Link>
            </div>
          </div>
          <div className='intoduction-box mt-2 px-4 flex flex-col space-y-3 justify-start '>
            <span className='text-sm font-md text-gray-300'>Introduction</span>
            <div className='h-24 w-full text-sm text-gray-400 rounded-md break-normal bg-color-white shadow-sm border-2 border-gray-400'>
              {user.status === "ok" && user.userData.introduction
                ? user.userData.introduction
                : "소개문구를 작성해보세요."}
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
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z'
                    />
                  </svg>
                </button>
                <span>내 활동 로그</span>
              </div>
              <div className='flex flex-col items-center justify-center space-y-2'>
                <button
                  className='flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-orange-600 hover:bg-orange-800 focus:outline-none focus:ring-1 focus:ring-orange-700 focus:ring-offset-2 border-1 border-orange-600 text-white'
                  onClick={onNotificationLogClick}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4.5 12.75l6 6 9-13.5'
                    />
                  </svg>
                </button>
                <span>알람</span>
              </div>
              <div className='flex flex-col items-center justify-center space-y-2'>
                <button className='flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-orange-600 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-700 focus:ring-offset-2 border-1 border-orange-600 text-white'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
                    />
                  </svg>
                </button>
                <span>Like</span>
              </div>
            </div>
          </div>
          <div
            className={cls(
              isActivityModalOpened
                ? "fixed top-0 left-0 w-screen h-screen bg-black/50 z-20 flex justify-center items-center"
                : "hidden"
            )}
            onClick={onActivityLogClick}
          >
            <div className='flex flex-col space-y-5 py-10 px-2 h-2/3 bg-white overflow-y-auto'>
              {user.userData?.activityLogs?.map((log, index) => {
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
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-6 h-6'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5'
                            />
                          </svg>
                          <span>{createdAt.toString()}</span>
                        </div>
                      </div>
                      <div className='text-gray-800'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-6 h-6'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          <div
            className={cls(
              isNotificationModalOpened
                ? "fixed top-0 left-0 w-screen h-screen bg-black/50 z-20 flex justify-center items-center"
                : "hidden"
            )}
            onClick={onNotificationLogClick}
          >
            <div className='flex flex-col space-y-5 py-10 px-2 h-2/3 bg-white overflow-y-auto'>
              {user.userData?.notifications?.map((log, index) => {
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
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-6 h-6'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5'
                            />
                          </svg>
                          <span>{createdAt.toString()}</span>
                        </div>
                      </div>
                      <div className='text-gray-800'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='w-6 h-6'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <p>loading</p>
      )}
    </Layout>
  );
};

export default Profile;
