const Edit = () => {
  return (
    <div className="px-4">
      <div className="profile flex items-center cursor-pointer py-4 space-x-4 border-t border-b">
        <div className="rounded-full w-[52px] h-[52px] bg-orange-500" />
        <div className="flex-col space-y-1">
          <p className="text-sm font-medium text-gray-700">니콜라스</p>
          <label>
            <input type="file" className="hidden" />
            <span>Edit Profile Image</span>
          </label>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center mt-3 space-y-2">
        <label
          className="text-gray-800 font-medium text-sm"
          htmlFor="email-input"
        >
          Email
        </label>
        <input
          className="p-2 w-full rounded-md focus:border-outline-none focus:border-none focus:ring-2 focus:ring-offset-2 border-2 border-gray-400 focus:ring-orange-700 "
          id="email-input"
          type="text"
          value="momoth@nomadco.com"
        />
      </div>
      <div className="flex flex-col items-start justify-center mt-3 space-y-2">
        <label
          className="text-gray-800 font-medium text-sm"
          htmlFor="email-input"
        >
          Phone
        </label>
        <input
          className="p-2 w-full rounded-md focus:border-outline-none focus:border-none focus:ring-2 focus:ring-offset-2 border-2 border-gray-400 focus:ring-orange-700 "
          id="phone-input"
          type="text"
          value="00000000000"
        />
      </div>
      <div className="flex flex-col items-start justify-center mt-3 space-y-2">
        <label
          className="text-gray-800 font-medium text-sm"
          htmlFor="introduction-input"
        >
          Email
        </label>
        <input
          className="p-2 h-40 w-full rounded-md focus:border-outline-none focus:border-none focus:ring-2 focus:ring-offset-2 border-2 border-gray-400 focus:ring-orange-700 "
          id="introduction-input"
          type="text"
          value="안녕소년, 나는 간지폭풍이라고 한다"
        />
      </div>

      <button className="w-full p-2 mt-3 rounded-md bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-800 hover:bg-orange-800 text-white font-md text-md shadow-sm hover:shadow-md">
        Edit profile
      </button>
    </div>
  );
};

export default Edit;
