import { NextPage } from "next";

const Upload: NextPage = () => {
  return (
    <div className="px-4 py-12">
      <label
        htmlFor="description-textarea"
        className="mb-1 block text-sm font-medium text-gray-800"
      >
        story
      </label>
      <div>
        <textarea
          id="description-textarea"
          rows={4}
          className="mt-1 shaodw-sm w-full focus:ring-orange-800 focus:ring-2 focus:ring-offset-1  rounded-md  border-gray-400 focus:border-transparent"
        />
      </div>

      <button className="w-full mt-5 bg-orange-700 hover:bg-orange-800 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none">
        Write
      </button>
    </div>
  );
};

export default Upload;
