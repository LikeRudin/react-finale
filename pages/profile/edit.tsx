import Layout from "../components/layout";
import SubmitButton from "../components/submit-button";
import TextArea from "../components/textarea";
import Input from "../components/input";
import useUser from "@/libs/client/useUser";
import useMutation from "@/libs/client/useMutation";
import type { User } from "@prisma/client";
import Router from "next/router";

import { useForm } from "react-hook-form";
import { APIROUTE } from "@/libs/util/apiroutes";
import { useEffect } from "react";

interface EditForm {
  email: string;
  phone: string;
  introduction: string;
  imagePath: string;
  password: string;
}

const Edit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditForm>();
  const user = useUser();
  const { trigger, state } = useMutation(APIROUTE.ANY_USE_USER(""), "POST");
  const onValid = async (submitData: EditForm) => {
    await trigger(submitData);
    if (state.status === "ok" && user.status === "ok") {
      Router.replace("/profile");
    }
  };

  return (
    <Layout title='프로필 편집' seoTitle='edit' hasBack hasBottomBar>
      {user.status === "ok" && (
        <form
          className='px-4 space-y-2 text-gray-300'
          onSubmit={handleSubmit(onValid)}
        >
          <div className='profile flex items-center cursor-pointer py-4 space-x-4 border-t border-b'>
            <div className='rounded-full w-[52px] h-[52px] bg-orange-500' />
            <div className='flex-col space-y-1'>
              <p className='text-sm font-medium'>
                {(user.userData as User).username}
              </p>
              <label>
                <input
                  type='file'
                  className='hidden'
                  {...register("imagePath")}
                />
                <span>Edit Profile Image</span>
              </label>
            </div>
          </div>
          <Input
            label='Email'
            register={register("email", {
              required: "이메일을 입력해주세요",
              validate: (item) =>
                item.includes("@") || "올바른 형식의 이메일을 입력해주세요",
            })}
            name='email'
            required={true}
            placeholder='Enter email address'
            type='email'
            setValue={setValue}
            value={(user.userData as User).email as string}
          />
          {errors?.email && (
            <p className='text-sm text-red-500'>{errors.email.message}</p>
          )}
          <Input
            label='Phone'
            register={register("phone", {
              required: "전화번호를 입력해주세요",
              validate: (item) =>
                ![...item].map((x) => Number(x)).filter((x) => Number.isNaN(x))
                  .length || "'-'가 포함되지않은 숫자만 입력해주세요 ",
            })}
            name='phone'
            required={true}
            placeholder='Enter phone number including only numbers'
            type='text'
            setValue={setValue}
            value={(user.userData as User).phone as string}
          />
          {errors?.phone && (
            <p className='text-sm text-red-500'>{errors.phone.message}</p>
          )}

          <TextArea
            register={register("introduction")}
            label='Introduction'
            name='Introduction'
            required
            setValue={setValue}
            placeholder='tell about you'
            value={(user.userData as User).introduction as string}
          />

          <div>
            <Input
              label='Password'
              register={register("password", {
                required: "비밀번호를 입력해주세요",
              })}
              name='password'
              required={true}
              placeholder='Enter your password'
              type='password'
              setValue={setValue}
              value=''
            />
            {errors?.password && (
              <p className='text-sm text-red-500'>{errors.password.message}</p>
            )}
            {state.status === "fail" && (
              <p className='text-sm text-red-500'>
                {JSON.stringify(state.error)}
              </p>
            )}
          </div>
          <SubmitButton text='Edit profile' />
        </form>
      )}
    </Layout>
  );
};

export default Edit;
