import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { ROUTE_PATH } from "@/constants/apiroutes";

import cls from "@/libs/util/cls";

interface LayoutProps {
  title?: string;
  hasBack?: boolean;
  hasBottomBar?: boolean;
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
}: LayoutProps) => {
  const router = useRouter();
  const onBackClick = () => router.back();
  return (
    <div className="text-[#2f8873] font-semibold drop-sh">
      <Head>
        <title>{`${seoTitle} | Quo-Meet`}</title>
        {metaText && (
          <meta property="og:title" content={metaText} key="title" />
        )}
      </Head>
      <div className="fixed bg-[rgba(7,6,6,0.58)] w-full h-12 max-w-xl text-md px-10 font-bold fiexed border-b top-0 flex items-center justify-center scrollbar-hide text-[[#2d987f]]">
        {hasBack && (
          <button className="absolute left-5" onClick={onBackClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 hover:text-red-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
          </button>
        )}
        {title && <span className="text-[#2f8873]">{title}</span>}
      </div>
      <div
        className={cls(
          "w-full h-screen max-w-max-xl pt-12 bg-[rgb(25,25,25)]",
          hasBottomBar ? "pb-20" : ""
        )}
      >
        {children}
      </div>
      {hasBottomBar && (
        <nav className="w-full max-w-xl fixed bottom-0 border-t bg-[rgb(26,22,22)]  text-xs px-10 pb-5 pt-3 flex justify-between ">
          <Link
            href={ROUTE_PATH.INDEX}
            className={cls(
              "flex flex-col items-center space-y-2 ",
              router.pathname === ROUTE_PATH.INDEX
                ? "text-white"
                : "hover:text-orange-400 transition-colors"
            )}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org.2000/svg"
            >
              <path
                stroke="round"
                strokeLinejoin="round"
                strokeWidth={0.8}
                d="M12.002 0a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm8.54 4.931a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm0 9.862a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm-8.54 4.931a2.138 2.138 0 100 4.276 2.138 2.138 0 100-4.276zm-8.542-4.93a2.138 2.138 0 100 4.276 2.138 2.138 0 100-4.277zm0-9.863a2.138 2.138 0 100 4.277 2.138 2.138 0 100-4.277zm8.542-3.378L2.953 6.777v10.448l9.049 5.224 9.047-5.224V6.777zm0 1.601l7.66 13.27H4.34zm-1.387.371L3.97 15.037V7.363zm2.774 0l6.646 3.838v7.674zM5.355 17.44h13.293l-6.646 3.836z"
              />
            </svg>
            <span>모여서함께</span>
          </Link>
          <Link
            href={ROUTE_PATH.COMMUNITY}
            className={cls(
              "flex flex-col items-center space-y-2",
              router.pathname === ROUTE_PATH.COMMUNITY
                ? "text-white"
                : "hover:text-orange-400 transition-colors"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
              />
            </svg>
            <span>동네생활</span>
          </Link>
          <Link
            href={ROUTE_PATH.CHAT}
            className={cls(
              "flex flex-col items-center space-y-2",
              router.pathname === ROUTE_PATH.CHAT
                ? "text-white"
                : "hover:text-orange-400 transition-colors"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
            <span>채팅</span>
          </Link>
          <Link
            href={ROUTE_PATH.LIVE}
            className={cls(
              "flex flex-col items-center space-y-2",
              router.pathname === ROUTE_PATH.LIVE
                ? "text-white"
                : "hover:text-orange-400 transition-colors"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <span>라이브</span>
          </Link>
          <Link
            href={ROUTE_PATH.PROFILE}
            className={cls(
              "flex flex-col items-center space-y-2",
              router.pathname === ROUTE_PATH.PROFILE
                ? "text-white"
                : "hover:text-orange-400 transition-colors"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>내계정</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Layout;
