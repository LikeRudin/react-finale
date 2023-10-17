const Profile = () => {
  return (
    <div className="px-2 py-16">
      <div className="profile flex items-center cursor-pointer py-4 space-x-4 border-t border-b">
        <div className="rounded-full w-[52px] h-[52px] bg-orange-500" />
        <div className="flex-col space-y-1">
          <p className="text-sm font-medium text-gray-700">Alicia keys</p>
          <button className="text-xs font-medium text-gray-500">
            Edit profile &rarr;
          </button>
        </div>
      </div>
      <div className="intoduction-box mt-2 flex flex-col justify-start ">
        <span className="text-sm font-md text-gray-700">Introduction</span>
        <div className="h-24 w-full text-sm text-gray-800 rounded-md break-normal bg-color-white shadow-sm border-2 border-gray-400">
          반갑다 친구들 나는 간지 폭풍이라고 한다
        </div>
      </div>
      <h3 className="text-sm font-md text-gray-700">활동내역</h3>
      <div className="activity-box mt-4 grid grid-cols-3">
        <div className="flex flex-col items-center justify-center space-y-2">
          <button className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-orange-600 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-700 focus:ring-offset-2 border-1 border-orange-600 text-white">
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>
          </button>
          <span>Opened-Meetup</span>
        </div>
        <div className="flex flex-col items-center justify-center space-y-2">
          <button className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-orange-600 hover:bg-orange-800 focus:outline-none focus:ring-1 focus:ring-orange-700 focus:ring-offset-2 border-1 border-orange-600 text-white">
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
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </button>
          <span>checked-Meetup</span>
        </div>
        <div className="flex flex-col items-center justify-center space-y-2">
          <button className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm bg-orange-600 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-700 focus:ring-offset-2 border-1 border-orange-600 text-white">
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
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
          <span>Like</span>
        </div>
      </div>
      <div className="flex flex-col space-y-5 py-10 px-2">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="flex justify-between px-4 border-b pb-5 cursor-pointer"
          >
            <div className="flex space-x-4">
              <div className="w-20 aspect-square bg-orange-400 rounded-md" />
              <div className="pt-2 flex-col">
                <h3 className="text-md font-medium text-gray-900">hello</h3>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  <span>YYYY-MM-DD</span>
                </div>
                <span className="font-medium mt-1 text-sm text-gray-600">
                  host: 또자 & 플린
                </span>
              </div>
            </div>
            <div className="flex space-x-2 items-end justify-end">
              <div className="flex space-x-0.5 items-center text-sm text-gray-600">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
                <span>1</span>
              </div>
              <div className="flex space-x-0.5 items-center text-sm text-gray-600">
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
                <span>1</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
