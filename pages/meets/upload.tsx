import type { NextPage } from "next";
import Input from "../../component/input";
import { useForm } from "react-hook-form";
const Upload: NextPage = () => {
  const { register } = useForm();
  return (
    <div className="px-4 py-12">
      <label className="w-full h-48  flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-600 hover:text-orange-600 cursor-pointer">
        <svg
          className="h-12 w-12"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input type="file" className="hidden" />
      </label>
      <div className="my-5 flex justify-center space-x-2 px-1">
        <div className="flex items-center flex-start space-x-3 w-[50%] ">
          <label htmlFor="date-input" className="flex space-x-2">
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
            <span>Date</span>
          </label>
          <input
            type="date"
            className="w-[80%] focus:outline-none h-[85%] focus:ring-orange-800 rounded-md border-gray-400 focus:border-orange-800"
            min={
              new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .split("T")[0]
            }
            required
          />
        </div>
        <div className="flex items-center flex-start space-x-3 w-[50%]">
          <label htmlFor="time-input" className="flex space-x-2">
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
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Time</span>
          </label>
          <input
            type="time"
            className="w-[80%] focus:outline-none h-[85%] focus:ring-orange-800 rounded-md border-gray-400 focus:border-orange-800"
            required
          />
        </div>
      </div>
      <div className="mb-2">
        <Input
          label="Title"
          name="title-input"
          register={register("title", { required: true })}
          required={true}
          placeholder="Title of Meet Up"
          type="text"
        />
      </div>
      <div>
        <label
          htmlFor="description-textarea"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          Description
        </label>
        <div>
          <textarea
            id="description-textarea"
            rows={4}
            className="mt-1 shaodw-sm w-full focus:ring-orange-800 focus:ring-2 focus:ring-offset-1  rounded-md  border-gray-400 focus:border-transparent"
          />
        </div>
      </div>
      <button className="w-full mt-5 bg-orange-700 hover:bg-orange-800 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none">
        Upload MeetUp
      </button>
    </div>
  );
};

export default Upload;
