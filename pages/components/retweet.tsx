import { timeFormatter } from "@/libs/util/time-formatter";
import { tweetCategoryParser } from "@/libs/util/category-parser";
import MiniProfile from "./mini-profile";
import { TweetData } from "./tweet-post";
import Link from "next/link";
import ArrowInCircleIcon from "./icons/arrow-in-circle";
import CategoryTextIcon from "./icons/category-text";
import CreatedTime from "./icons/created-time";
const ReTweet = ({
  category,
  user,
  userId,
  name,
  createdAt,
  description,
  id,
}: TweetData) => (
  <div className='w-full flex flex-col items-start px-2 py-5 pb-[] bg-gray-800 border-b-[0.5px] border-b-orange-300 '>
    <div className='px-4'>
      <div className='flex items-center mt-2 space-x-4'>
        <MiniProfile
          userName={user?.username}
          userId={userId}
          widthAndHeight='w-8 h-8'
        />
        <CategoryTextIcon text={tweetCategoryParser(category)} />
        <CreatedTime createdAt={createdAt} />
        <Link href={`/tweets/${id}`}>
          <ArrowInCircleIcon className='w-8 h-8 hover:stroke-orange-300' />
        </Link>
      </div>
      <div>
        <div className='px-4 text-gray-100 text-sm'>{name}</div>
        <div>사진</div>
        <div className='mt-2  text-gray-200'>{description}</div>
      </div>
    </div>
  </div>
);

export default ReTweet;
