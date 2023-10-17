const ChatDetail = () => {
  return (
    <div className="pt-10 pb-16 px-4 space-y-4">
      <div className="chat-bubble flex items-start space-x-2">
        <div className="chat-avatar w-8 h-8 rounded-full bg-orange-300" />
        <div className="chat-message w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md break-normal">
          <p>족발 먹자</p>
        </div>
      </div>
      <div className="chat-bubble flex flex-row-reverse items-start space-x-2 space-x-reverse">
        <div className="chat-avatar w-8 h-8 rounded-full bg-orange-300" />
        <div className="chat-message w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md break-normal">
          <p>제발 ~ 그만</p>
        </div>
      </div>

      <div className="chat-input-box fixed p-2 bg-white inset-x-0">
        <div
          className="chat-input relative max-w-md items-center w-full mx-async function name(params:type) {
            
        }"
        >
          <input
            type="text"
            className="w-full p-2 rounded-lg border-gray-400 focus:outline-none focus:border-outline-none focus:ring-orange-800 focus:ring-offset-2 focus:border-transparent "
          />
          <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
            <button className="flex items-center justify-center p-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-md ">
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
