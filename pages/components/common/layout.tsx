import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { ROUTE_PATH } from "@/libs/util/apiroutes";
import LoginChecker from "@/libs/client/LoginChecker";

import cls from "@/libs/util/cls";

import BackIcon from "../icons/back";
import UserInCircleIcon from "../icons/user-in-circle";
import HexagonIcon from "../icons/hexagon";
import EarthIcon from "../icons/earth";
import ChatIcon from "../icons/chat";
import CameraIcon from "../icons/camera";

interface LayoutProps {
  title?: string;
  hasBack?: boolean;
  hasBottomBar?: boolean;
  hasTopBar?: boolean;
  children: ReactNode;
  seoTitle?: string;
  metaText?: string;
}

const Layout = ({
  title,
  hasBack,
  hasBottomBar,
  children,
  seoTitle,
  metaText,
  hasTopBar,
}: LayoutProps) => {
  LoginChecker();
  const router = useRouter();
  const onBackClick = () => router.back();
  return (
    <div className='text-[#42b298] font-semibold '>
      <Head>
        <title>{`${seoTitle} | Quo-Meet`}</title>
        {metaText && (
          <meta property='og:title' content={metaText} key='title' />
        )}
      </Head>

      {hasTopBar && (
        <div className='fixed bg-[rgba(7,6,6,0.58)] w-full h-12 max-w-[46rem] text-md px-10 font-bold fiexed border-b top-0 flex items-center justify-center scrollbar-hide text-[[#2d987f]]'>
          {hasBack && (
            <button className='absolute left-5' onClick={onBackClick}>
              <BackIcon className='w-6 h-6 hover:text-red-400' />
            </button>
          )}
          {title && <span>{title}</span>}
        </div>
      )}
      <div className='flex w-full h-screen max-w-max-xl pt-12 bg-[rgb(25,25,25)] '>
        {hasBottomBar && (
          <nav className=' w-[10rem] h-full  border-t bg-[rgb(26,22,22)]  text-xs px-3 pb-5 pt-3 flex flex-col justify-start space-y-4 items-start '>
            <div>Quo-Meet</div>
            <Link
              href={ROUTE_PATH.INDEX}
              className={cls(
                "flex items-center space-x-2 ",
                router.pathname === ROUTE_PATH.INDEX
                  ? "text-white"
                  : "hover:text-orange-400 transition-colors"
              )}
            >
              <HexagonIcon className='w-6 h-6' />
              <span>모여서함께</span>
            </Link>
            <Link
              href={ROUTE_PATH.TWEET}
              className={cls(
                "flex items-center space-x-2 ",
                router.pathname === ROUTE_PATH.TWEET
                  ? "text-white"
                  : "hover:text-orange-400 transition-colors"
              )}
            >
              <EarthIcon className='w-6 h-6' />
              <span>트윗</span>
            </Link>
            <Link
              href={ROUTE_PATH.CHAT}
              className={cls(
                "flex items-center space-x-2 ",
                router.pathname === ROUTE_PATH.CHAT
                  ? "text-white"
                  : "hover:text-orange-400 transition-colors"
              )}
            >
              <ChatIcon className='w-6 h-6' />
              <span>채팅</span>
            </Link>
            <Link
              href={ROUTE_PATH.LIVE}
              className={cls(
                "flex items-center space-x-2 ",
                router.pathname === ROUTE_PATH.LIVE
                  ? "text-white"
                  : "hover:text-orange-400 transition-colors"
              )}
            >
              <CameraIcon className='w-6 h-6' />
              <span>라이브</span>
            </Link>
            <Link
              href={ROUTE_PATH.PROFILE}
              className={cls(
                "flex items-center space-x-2 ",
                router.pathname === ROUTE_PATH.PROFILE
                  ? "text-white"
                  : "hover:text-orange-400 transition-colors"
              )}
            >
              <UserInCircleIcon className='w-6 h-6' />
              <span>내계정</span>
            </Link>
          </nav>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
