import Link from "next/link";
import Image from "next/image";
import cls from "@/libs/util/cls";
import ProfileCircle from "./common/profile-circle";
type MiniProfileProps = {
  userName: string;
  userId: number;
  imagepath?: string | null;
  text?: string;
  widthAndHeight: string;
};

const MiniProfile = ({
  userName,
  userId,
  imagepath,
  text,
  widthAndHeight,
}: MiniProfileProps) => {
  return (
    <Link
      href={`/profile/${userId}`}
      className='flex items-center cursor-pointer py-2 space-x-2 '
    >
      <ProfileCircle
        imagePath={imagepath as string}
        className={widthAndHeight}
      />

      <div className='flex-col space-y-1'>
        <p className='text-sm font-medium text-orange-100'>{userName}</p>
        <p className='text-xs font-medium text-gray-400'>{text}</p>
      </div>
    </Link>
  );
};

export default MiniProfile;
