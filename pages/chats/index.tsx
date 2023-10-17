const Chats = () => {
  return (
    <div className="divide-y-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="profile flex items-center cursor-pointer px-4 py-2 space-x-4 "
        >
          <div className="rounded-full w-[48px] h-[48px] bg-orange-500" />
          <div className="flex-col space-y-1">
            <p className="text-sm font-medium text-gray-700">Max</p>
            <p className="text-xs font-medium text-gray-500">
              우~ 이번주 금요일~ 우~ 금요일에 시간 어때요~
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Chats;
