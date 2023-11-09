import { timeFormatter } from "@/libs/util/time-formatter";

type CreatedTimeProps = {
  createdAt: Date;
};

const CreatedTime = ({ createdAt }: CreatedTimeProps) => (
  <div className='px-4 flex items-center justify-between text-gray-300 font-medium text-xs'>
    <span>{timeFormatter(createdAt?.toString())}</span>
  </div>
);

export default CreatedTime;
