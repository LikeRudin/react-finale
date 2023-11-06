import Link from "next/link";
import Image from "next/image";
import cls from "@/libs/util/cls";
type MiniProfileProps = {
  userName: string;
  userId: number;
  imagepath?: string;
  text?: string;
  widthAndHeight: number | string;
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
      {imagepath ? (
        <Image
          width={widthAndHeight as number}
          height={widthAndHeight as number}
          src={imagepath}
          alt=''
        />
      ) : (
        <div
          className={cls(
            `rounded-full bg-orange-500`,
            widthAndHeight as string
          )}
        />
      )}

      <div className='flex-col space-y-1'>
        <p className='text-sm font-medium text-orange-100'>{userName}</p>
        <p className='text-xs font-medium text-gray-400'>{text}</p>
      </div>
    </Link>
  );
};

export default MiniProfile;
