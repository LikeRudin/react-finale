import Input from "./common/input";
import TextArea from "./common/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { TWEETS_API_ROUTE } from "@/libs/util/apiroutes";
import SubmitButton from "./common/submit-button";
import useLocation from "@/libs/client/useLocations";
import EmptyImageIcon from "./icons/empty-image";
import { TweetCategory } from "@/constants/tweet-category";

export type TweetUploadForm = {
  name: string;
  category: string;
  description: string;
  imagepath?: string;
  parentId?: number;
  showLocation: "" | "1";
};

type TweetUploadFormProps = {
  mutate: () => void;
  parentId?: number;
};

const TweetUploadForm = ({ mutate, parentId }: TweetUploadFormProps) => {
  const { latitude, longitude } = useLocation();

  const { register, handleSubmit, setValue, reset } =
    useForm<TweetUploadForm>();

  const { trigger, state } = useMutation(TWEETS_API_ROUTE.INDEX, "POST", () => {
    mutate();
    reset();
  });
  const onValid = (data: TweetUploadForm) => {
    const { name, description, category, showLocation, imagepath } = data;
    trigger({
      name,
      description,
      category,
      showLocation,
      imagepath,
      latitude,
      longitude,
      parentId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className='px-2 bg-inherit py-12 w-full'
    >
      <div className=' flex justify-start items-center space-x-2 w-[90%] text-xs'>
        <div className='space-y-2 w-[80%]'>
          <Input
            label='name'
            name='title-input'
            register={register("name", { required: true })}
            required={true}
            placeholder='Title'
            type='text'
            setValue={setValue}
          />
        </div>
        <div className='mt-1 space-y-2 text-xs'>
          <label htmlFor='showLocation'> Show Location </label>
          <select
            id='showLocation'
            className='w-20 h-10  appearance-none px-2 py-2 border text-xs border-orange-900 border-opacity-30 rounded-md shadow-sm placeholder-orange-800 focus:outline-none focus:ring-orange-400 focus:border-orange-800 placeholder:text-gray-400 text-gray-800'
            {...register("showLocation")}
          >
            <option className='text-2xs' value=''>
              싫어요
            </option>
            <option className='text-2xs' value='1'>
              좋아요
            </option>
          </select>
        </div>
        <div className='mt-1 space-y-2 text-xs'>
          <label htmlFor='category'> Category </label>
          <select
            id='category'
            {...register("category", { required: true })}
            className='w-20 h-10  appearance-none text-xs px-2 py-2 border  border-orange-900 border-opacity-30 rounded-md shadow-sm placeholder-orange-800 focus:outline-none focus:ring-orange-400 focus:border-orange-800 placeholder:text-gray-400 text-gray-800'
          >
            <option value={TweetCategory.ETC}> 잡담해요</option>
            <option value={TweetCategory.CONVERSATION}> 의논해요</option>
            <option value={TweetCategory.FUN}> 재밌어요 </option>
            <option value={TweetCategory.QUESTION}> 궁금해요 </option>
            <option value={TweetCategory.RECOMMEND}> 추천해요 </option>
          </select>
        </div>
        <label className='cursor-pointer flex flex-col items-center '>
          <div className='py-2'>Image</div>
          <EmptyImageIcon className='w-10 h-10' />
          <input
            {...register("imagepath")}
            type='file'
            required={false}
            className='hidden'
          />
        </label>
      </div>
      <div className='flex bg-inherit'>
        <div className='w-[90%]'>
          <TextArea
            setValue={setValue}
            register={register("description", { required: true })}
            name='description-textarea'
            label=''
            required={true}
            value=''
            placeholder='share your life'
          />
        </div>
        <div className='w-[10%] flex items-end py-1 px-2'>
          <SubmitButton
            text={
              state.status === "loading"
                ? "Tweet"
                : state.status === "ok"
                ? "Tweet"
                : "Loading..."
            }
            className='w-12 h-6 mt-5 bg-orange-700 hover:bg-orange-800 text-white px-4 border border-transparent rounded-md shadow-sm text-xs font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none flex justify-center items-center cursor-pointer'
          />
        </div>
      </div>
    </form>
  );
};

export default TweetUploadForm;
