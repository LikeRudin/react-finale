import type { NextPage } from "next";

const Community: NextPage = () => {
  return (
    <div className="px-4 py-10">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item}>
          <div className="cursor-pointer flex flex-col items-start">
            <span className="flex ml-4 items:center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              잡담
            </span>
            <div className="mt-2 px-4 text-gray-700">
              <span className="text-orange-700 font-medium">Q.</span> 의정부
              족발 맛집 어디없나요?
            </div>
            <div className="mt-5 px-4 w-full flex items-center justify-between text-gray-500 font-medium text-xs">
              <span>니콜라스</span>
              <span>18시간 전</span>
            </div>
            <div className="border-b-[2px] w-full flex px-4 py-2.5 space-x-5 mt-3 text-gray-700">
              <span className="flex items-center space-x-2 text-sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>궁금해요</span>
              </span>
              <span className="flex items-center space-x-2 text-sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
                <span>답변 1</span>
              </span>
            </div>
          </div>
        </div>
      ))}
      <button className="fixed hover:bg-orange-700 transition-colors cursor-pointer bottom-24 right-5 shadow-xl bg-orange-600 rounded-full p-4 text-white font-medium">
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
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
          />
        </svg>
      </button>
    </div>
  );
};

export default Community;
