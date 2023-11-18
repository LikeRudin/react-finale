import Image from "next/image";
import { CreateImagePath } from "@/constants/tweet-category";
import cls from "@/libs/util/cls";

type ProfileCircleProps = {
  imagePath?: string;
  className?: string;
};

const ProfileCircle = ({ imagePath, className }: ProfileCircleProps) =>
  imagePath ? (
    <Image
      width={32}
      height={32}
      src={CreateImagePath(imagePath)}
      className='w-[40px] h-[40px] rounded-full'
      alt=''
    />
  ) : (
    <div
      className={cls(
        "rounded-full bg-orange-500",
        className || "w-[40px] h-[40px]"
      )}
    />
  );

export default ProfileCircle;
