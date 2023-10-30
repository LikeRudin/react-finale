import Layout from "../components/layout";
import useUser from "@/libs/client/useUser";
import useMutation from "@/libs/client/useMutation";
import { useForm } from "react-hook-form";
import TextArea from "../components/textarea";
import SubmitButton from "../components/submit-button";
import React from "react";
import Input from "../components/input";
import { APIROUTE } from "@/constants/apiroutes";

interface UserData {
  id: number;
  email: string;
  phone: string;
  password: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: string | null;
}

interface EditForm extends Text {
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
  const { trigger, state } = useMutation(APIROUTE.ANY_USE_USER(), "POST");
  console.log(user.userData);
  const onValid = async (submitData: EditForm) => {
    await trigger(submitData);
    if (state.status === "ok" && user.status === "ok") {
      user.mutate(state.data);
    }
  };

  return (
    <Layout title="프로필 편집" seoTitle="edit" hasBack hasBottomBar>
      {user.status === "ok" && (
        <form
          className="px-4 space-y-2 text-gray-300"
          onSubmit={handleSubmit(onValid)}
        >
          <div className="profile flex items-center cursor-pointer py-4 space-x-4 border-t border-b">
            <div className="rounded-full w-[52px] h-[52px] bg-orange-500" />
            <div className="flex-col space-y-1">
              <p className="text-sm font-medium">
                {(user.userData as UserData).username}
              </p>
              <label>
                <input
                  type="file"
                  className="hidden"
                  {...register("imagePath")}
                />
                <span>Edit Profile Image</span>
              </label>
            </div>
          </div>
          <Input
            label="Email"
            register={register("email", {
              required: "이메일을 입력해주세요",
              validate: (item) =>
                item.includes("@") || "올바른 형식의 이메일을 입력해주세요",
            })}
            name="email"
            required={true}
            placeholder="Enter email address"
            type="email"
            setValue={setValue}
            value={(user.userData as UserData).email}
          />
          {errors?.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
          <Input
            label="Phone"
            register={register("phone", {
              required: "전화번호를 입력해주세요",
              validate: (item) =>
                ![...item].map((x) => Number(x)).filter((x) => Number.isNaN(x))
                  .length || "'-'가 포함되지않은 숫자만 입력해주세요 ",
            })}
            name="phone"
            required={true}
            placeholder="Enter phone number including only numbers"
            type="text"
            setValue={setValue}
            value={(user.userData as UserData).phone}
          />
          {errors?.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
          <TextArea
            register={register("introduction")}
            type="text"
            label="Introduction"
            name="Introduction"
            required
            setValue={setValue}
            placeholder="tell about you"
            value={(user.userData as UserData).introduction.toString()}
          />
          <div>
            <Input
              label="Password"
              register={register("password", {
                required: "비밀번호를 입력해주세요",
              })}
              name="password"
              required={true}
              placeholder="Enter your password"
              type="password"
              setValue={setValue}
            />
            {errors?.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
            {state.status === "fail" && (
              <p className="text-sm text-red-500">
                {JSON.stringify(state.error)}
              </p>
            )}
          </div>
          <SubmitButton text="Edit profile" />
        </form>
      )}
    </Layout>
  );
};

export default Edit;
