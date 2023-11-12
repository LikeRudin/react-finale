import { useEffect } from "react";
import { useRouter } from "next/router";
import useLocation from "@/libs/client/useLocations";

import { useForm } from "react-hook-form";

import Input from "../components/common/input";

import useMutation from "@/libs/client/useMutation";
import { TWEETS_API_ROUTE } from "@/libs/util/apiroutes";

import TextArea from "../components/common/textarea";
import SubmitButton from "../components/common/submit-button";
import Layout from "../components/common/layout";
import { TweetCategory } from "@/constants/tweet-category";
import { NextPage } from "next";

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
    <>
      {parentId ? (
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
      ) : (
        <Layout title='Tweet 작성' hasTopBar hasBack hasBottomBar>
          <form
            onSubmit={handleSubmit(onValid)}
            className='px-4 bg-inherit py-12 w-full'
          >
            <label className='w-full h-48  flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-600 hover:text-orange-600 cursor-pointer'>
              <svg
                className='h-12 w-12'
                stroke='currentColor'
                fill='none'
                viewBox='0 0 48 48'
                aria-hidden='true'
              >
                <path
                  d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <input
                {...register("imagepath")}
                type='file'
                className='hidden'
              />
            </label>
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
                  {...register("showLocation")}
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
                text={
                  state.status === "loading" ? "Submit Tweet" : "Loading..."
                }
              />
            </div>
          </form>
        </Layout>
      )}
    </>
  );
};

export default UploadTweet as NextPage;
