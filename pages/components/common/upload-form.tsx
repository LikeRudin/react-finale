import { useEffect } from "react";
import { useRouter } from "next/router";
import useLocation from "@/libs/client/useLocations";

import { useForm } from "react-hook-form";

import Input from "./input";

import useMutation from "@/libs/client/useMutation";
import { TWEETS_API_ROUTE } from "@/libs/util/apiroutes";

import TextArea from "./textarea";
import SubmitButton from "./submit-button";
import { TweetCategory } from "@/constants/tweet-category";

export type TweetUploadForm = {
  name: string;
  category: string;
  description: string;
  imagepath?: string;
  showLocation: "" | "1";
};

export const UploadTweet = ({ parentId }: { parentId?: number }) => {
  const router = useRouter();
  const { latitude, longitude } = useLocation();

  const { register, handleSubmit, setValue, reset } =
    useForm<TweetUploadForm>();

  const { trigger, state } = useMutation(TWEETS_API_ROUTE.INDEX, "POST");

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

  useEffect(() => {
    if (state.status === "ok") {
      router.replace(`/tweets/${state.data}`);
      reset();
    }
  }, [state, router, reset]);

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className='px-4 bg-inherit py-12 w-full h-screen'
    >
      <Input
        name='imagepath'
        label='Picture'
        register={register("imagepath")}
        type='file'
        required={false}
      />

      <div className='mb-2 space-y-2'>
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
      <div className=' flex justify-start items-center space-x-2 text-xs'>
        <div className='mb-2 space-y-2'>
          <label htmlFor='category'> Category </label>
          <select
            id='category'
            {...register("category", { required: true })}
            className='w-[80%] appearance-none px-2 py-2 border  border-orange-900 border-opacity-30 rounded-md shadow-sm placeholder-orange-800 focus:outline-none focus:ring-orange-400 focus:border-orange-800 placeholder:text-gray-400 text-gray-800'
          >
            <option value={TweetCategory.ETC}> 잡담해요</option>
            <option value={TweetCategory.CONVERSATION}> 의논해요</option>
            <option value={TweetCategory.FUN}> 재밌어요 </option>
            <option value={TweetCategory.QUESTION}> 궁금해요 </option>
            <option value={TweetCategory.RECOMMEND}> 추천해요 </option>
          </select>
        </div>
        <div className='mb-2 space-y-2'>
          <label htmlFor='showLocation'> Show Location </label>
          <select
            id='showLocation'
            className='w-[80%] appearance-none px-2 py-2 border text-md border-orange-900 border-opacity-30 rounded-md shadow-sm placeholder-orange-800 focus:outline-none focus:ring-orange-400 focus:border-orange-800 placeholder:text-gray-400 text-gray-800'
            {...register("showLocation", { required: true })}
          >
            <option value=''> 싫어요 </option>
            <option value='1'> 좋아요 </option>
          </select>
        </div>
      </div>
      <div className='bg-inherit'>
        <TextArea
          setValue={setValue}
          register={register("description", { required: true })}
          name='description-textarea'
          label='Description'
          required={true}
          value=''
        />
        <SubmitButton
          text={state.status === "loading" ? "Submit Tweet" : "Loading..."}
        />
      </div>
    </form>
  );
};

export default UploadTweet;
