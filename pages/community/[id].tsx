import type { NextPage } from "next";

const CommunityPostDetail: NextPage = () => {
  return (
    <div>
      <div>
        <div className="profile flex items-center px-4 cursor-pointer py-4 space-x-4 border-t border-b">
          <div className="rounded-full w-[52px] h-[52px] bg-orange-500" />
          <div className="flex-col space-y-1">
            <p className="text-sm font-medium text-gray-700">니콜라스</p>
            <p className="text-xs font-medium text-gray-500">
              view profile &rarr;
            </p>
          </div>
        </div>
      </div>
      <div className="content border-b-2 border-b-gray-300 mb-2">
        <div className="cursor-pointer flex flex-col items-start">
          <span className="flex ml-4 items:center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            잡담
          </span>
          <div className="mt-2 px-4 text-gray-700">
            <span className="text-orange-700 font-medium">Q.</span> 의정부 족발
            맛집 어디없나요?
          </div>
          <div className="mt-5 px-4 w-full flex items-center justify-between text-gray-500 font-medium text-xs">
            <span>18시간 전</span>
          </div>
          <div className="meta-info border-b-[2px] w-full flex px-4 py-2.5 space-x-5 mt-3 text-gray-700">
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
      <div>
        <div className="flex items-start space-x-3 px-2 border-b border-b-gray-200 mb-1">
          <div className="w-8 h-8 mt-1  bg-slate-300 rounded-full" />
          <div>
            <span className="text-sm block font-medium text-gray-800">린</span>
            <span className="text-xs text-gray-600 mt-1">2시간 전</span>
            <p className="text-gray-800 mt-2">족발은 이제 그만..!</p>
          </div>
        </div>
      </div>
      <div className="px-4 mt-2">
        <label
          htmlFor="description-textarea"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          Replys
        </label>
        <div>
          <textarea
            id="description-textarea"
            rows={4}
            className="mt-1 shaodw-sm w-full focus:ring-orange-800 focus:ring-2 focus:ring-offset-1  rounded-md  border-gray-400 focus:border-transparent"
          />
        </div>
      </div>
      <div className="px-4">
        <button className="w-full mt-5 bg-orange-700 hover:bg-orange-800 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none">
          Add Reply
        </button>
      </div>
    </div>
  );
};

export default CommunityPostDetail;
