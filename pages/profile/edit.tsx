import Layout from "../components/common/layout";
import SubmitButton from "../components/common/submit-button";
import TextArea from "../components/common/textarea";
import Input from "../components/common/input";

import type useSWR from "swr";
import useDetailPage from "@/libs/client/useDetailPage";
import useMutation from "@/libs/client/useMutation";
import type { User } from "@prisma/client";

import client from "@/libs/server/prisma-client";

import { useForm } from "react-hook-form";
import { PROFILE_API_ROUTE } from "@/libs/util/apiroutes";

import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { withSessionSSR } from "@/libs/server/session";
import Router from "next/router";
import LoadingCover from "../components/common/loading-cover";

interface EditForm {
  email: string;
  phone: string;
  introduction: string;
  imagePath: string;
  password: string;
}

type EditPageProps = {
  profileInit: User;
};

const Edit: NextPage<EditPageProps> = ({ profileInit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditForm>();

  const userDetail = useDetailPage<User>(PROFILE_API_ROUTE.EDIT, {
    data: profileInit,
  });
  const { trigger, state } = useMutation(PROFILE_API_ROUTE.EDIT, "POST");
  const onValid = async (submitData: EditForm) => {
    await trigger(submitData);
    if (state.status === "ok") {
      Router.replace("/profile");
    }
  };

  switch (userDetail.status) {
    case "ok":
      const { username, email, phone, introduction } = userDetail.data;
      return (
        <Layout title='프로필 편집' seoTitle='edit' hasTopBar hasBack>
          <div className='flex justify-center w-full'>
            <form
              className='w-[80%] px-4 space-y-3 text-gray-300 '
              onSubmit={handleSubmit(onValid)}
            >
              <div className='profile flex items-center cursor-pointer py-4 space-x-4 border-b'>
                <div className='rounded-full w-[52px] h-[52px] bg-orange-500' />
                <div className='flex-col space-y-1'>
                  <p className='text-sm font-medium'>{username}</p>
                  <label className='cursor-pointer'>
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
                value={email as string}
              />
              {errors?.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
              <Input
                label='Phone'
                register={register("phone", {
                  required: "전화번호를 입력해주세요",
                  validate: (item) =>
                    ![...item]
                      .map((x) => Number(x))
                      .filter((x) => Number.isNaN(x)).length ||
                    "'-'가 포함되지않은 숫자만 입력해주세요 ",
                })}
                name='phone'
                required={true}
                placeholder='Enter phone number including only numbers'
                type='text'
                setValue={setValue}
                value={phone as string}
              />
              {errors?.phone && (
                <p className='text-sm text-red-500'>{errors.phone.message}</p>
              )}
              <div>
                <TextArea
                  register={register("introduction")}
                  label='Introduction'
                  name='Introduction'
                  required
                  setValue={setValue}
                  placeholder='tell about you'
                  value={introduction as string}
                />
              </div>
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
                <p className='text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
              {state.status === "fail" && (
                <p className='text-sm text-red-500'>
                  {JSON.stringify(state.error)}
                </p>
              )}
              <div className='mt-5'>
                <SubmitButton text='Edit profile' />
              </div>
            </form>
          </div>
        </Layout>
      );
    default:
      return (
        <Layout title='프로필 편집' seoTitle='edit' hasTopBar hasBack>
          <LoadingCover />
        </Layout>
      );
  }
};

export default Edit;

export const getServerSideProps: GetServerSideProps = withSessionSSR(
  async ({ req }: GetServerSidePropsContext) => {
    const { user } = req.session;
    if (!user) {
      return {
        redirect: {
          permanent: false,
          destination: "/enter",
        },
      };
    }
    const id = +user.id.toString();

    const result = await client.user.getEditProfile(id);
    if (!result) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }
    return {
      props: {
        profileInit: JSON.parse(JSON.stringify(result)),
      },
    };
  }
);
