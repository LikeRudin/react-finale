import { timeFormatter } from "@/libs/util/time-formatter";
import cls from "@/libs/util/cls";
type CreatedTimeProps = {
  createdAt: Date;
  className?: string;
};

const CreatedTime = ({ createdAt, className }: CreatedTimeProps) => (
  <div
    className={cls(
      className
        ? className
        : "px-2 flex items-center justify-between text-gray-300 font-medium text-xs"
    )}
  >
    <span>{timeFormatter(createdAt.toString().substring(0, 16))}</span>
  </div>
);

export default CreatedTime;
