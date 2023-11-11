import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import Input from "./components/common/input";
import { APIROUTE } from "@/libs/util/apiroutes";
import Router from "next/router";
import cls from "@/libs/util/cls";
import SubmitButton from "./components/common/submit-button";

import EmptyBubbleIcon from "./components/icons/empty-bubble";
import GitHubIcon from "./components/icons/github";
import Layout from "./components/common/layout";

interface EnterForm {
  emailOrPhone: string;
}

interface PasswordForm {
  password: string;
}

interface SignInForm {
  email: string;
  phone: string;
  username: string;
  password: string;
  passwordconfirm: string;
}

export default function Enter() {
  const [method, setMethod] = useState<"Login" | "Sign-in">("Login");

  const { register, handleSubmit, reset, setValue } = useForm<EnterForm>();
  const { trigger: loginStart, state: loginState } = useMutation(
    APIROUTE.ENTER_LOGIN,
    "POST"
  );
  const { trigger: signInStart, state: signInState } = useMutation(
    APIROUTE.ENTER_SIGNIN,
    "POST"
  );

  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    setValue: setPasswordValue,
  } = useForm<PasswordForm>();
  const { trigger: confirmPassword, state: passwordState } = useMutation(
    APIROUTE.ENTER_PASSWORD,
    "POST"
  );

  const {
    register: signInRegister,
    handleSubmit: handleSigninSubmit,
    formState: { errors: signInErrors },
    setValue: setSignInValue,
  } = useForm<SignInForm>();
  const { trigger: createAccount, state: accountData } = useMutation(
    APIROUTE.ENTER_CREATION,
    "POST"
  );

  const onLoginClick = () => setMethod("Login");
  const onSigninClick = () => setMethod("Sign-in");

  const onLoginStartValid = (validForm: EnterForm) => {
    reset();
    loginStart(validForm);
  };
  const onPasswordValid = (validForm: PasswordForm) => {
    confirmPassword(validForm);
  };

  const onSigninStartValid = (validForm: EnterForm) => {
    reset();
    signInStart(validForm);
  };
  const onSigninValid = (validForm: SignInForm) => {
    createAccount(validForm);
  };

  useEffect(() => {
    if (passwordState.status === "ok" || accountData.status === "ok") {
      Router.push("/");
    }
  }, [passwordState, signInState, accountData.status]);
  return (
    <Layout seoTitle='enter'>
      <div className='w-full h-full flex items-start justify-center'>
        <div className='px-4 w-[80%]'>
          <h3 className='text-3xl font-semibold text-center'>
            Well come to Quo-Meet
          </h3>
          <div className='mt-10'>
            <h5 className='text-center'>{method}</h5>
            <div className='grid border-b w-full mt-8 grid-cols-2'>
              <button
                onClick={onLoginClick}
                className={cls(
                  "pb-4 font-semibold text-sm border-b-2",
                  method === "Login"
                    ? " border-orange-700"
                    : "border-transparent hover:text-gray-400 text-gray-500"
                )}
              >
                Login
              </button>
              <button
                onClick={onSigninClick}
                className={cls(
                  "pb-4 font-semibold text-sm border-b-2",
                  method === "Sign-in"
                    ? " border-orange-700"
                    : "border-transparent hover:text-gray-400 text-gray-500"
                )}
              >
                Sign in
              </button>
            </div>
          </div>
          {method === "Login" && (
            <>
              {loginState.status === "ok" ? (
                <>
                  <form onSubmit={handlePasswordSubmit(onPasswordValid)}>
                    <Input
                      label='Password'
                      register={passwordRegister("password", {
                        required: true,
                      })}
                      name='password'
                      required={true}
                      placeholder='password'
                      type='password'
                      value=''
                      setValue={setPasswordValue}
                    />
                    <SubmitButton text={method} />
                  </form>
                  {passwordState.status === "fail" && (
                    <p>{JSON.stringify(passwordState.error)}</p>
                  )}
                </>
              ) : (
                <>
                  <form onSubmit={handleSubmit(onLoginStartValid)}>
                    <Input
                      label='Email or Phone'
                      register={register("emailOrPhone", { required: true })}
                      name='emailOrPhone'
                      required={true}
                      placeholder='Login with email or phone number'
                      type='text'
                      setValue={setValue}
                      value=''
                    />
                    <button className='w-full mt-5 bg-orange-700 hover:bg-orange-800 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none'>
                      {method}
                    </button>
                  </form>
                  {loginState.status === "fail" && (
                    <p>{JSON.stringify(loginState.error)}</p>
                  )}
                </>
              )}
            </>
          )}
          {method === "Sign-in" && (
            <>
              {signInState.status === "ok" ? (
                <>
                  <form onSubmit={handleSigninSubmit(onSigninValid)}>
                    <Input
                      label='Email'
                      register={signInRegister("email", {
                        required: "이메일을 입력해주세요",
                        validate: (item) =>
                          item.includes("@") ||
                          "올바른 형식의 이메일을 입력해주세요",
                      })}
                      name='email'
                      required={true}
                      placeholder='Enter email address'
                      type='email'
                      setValue={setSignInValue}
                      value=''
                    />
                    {signInErrors?.email && (
                      <p className='text-sm text-red-500'>
                        {signInErrors.email.message}
                      </p>
                    )}
                    <Input
                      label='Phone'
                      register={signInRegister("phone", {
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
                      setValue={setSignInValue}
                      value=''
                    />
                    {signInErrors?.phone && (
                      <p className='text-sm text-red-500'>
                        {signInErrors.phone.message}
                      </p>
                    )}

                    <Input
                      label='UserName'
                      register={signInRegister("username", {
                        required: "사용자 이름을 입력해주세요",
                        maxLength: {
                          value: 10,
                          message: "사용자 이름은 10자를 초과할 수 없습니다.",
                        },
                      })}
                      name='username'
                      required={true}
                      placeholder='Enter username, which is not necessarilry unique'
                      type='text'
                      setValue={setSignInValue}
                      value=''
                    />
                    {signInErrors?.username && (
                      <p className='text-sm text-red-500'>
                        {signInErrors.username.message}
                      </p>
                    )}

                    <Input
                      label='Password'
                      register={signInRegister("password", {
                        required: "비밀번호를 입력해주세요",
                        minLength: {
                          value: 10,
                          message: "적어도 10자 이상을 입력해야합니다",
                        },
                      })}
                      name='password'
                      required={true}
                      placeholder='Enter your password'
                      type='password'
                      setValue={setSignInValue}
                      value=''
                    />
                    {signInErrors?.password && (
                      <p className='text-sm text-red-500'>
                        {signInErrors.password.message}
                      </p>
                    )}
                    <Input
                      label='Password Confirm'
                      register={signInRegister("passwordconfirm", {
                        required: true,
                      })}
                      name='passwordconfirm'
                      required={true}
                      placeholder='Re-enter your password'
                      type='password'
                      setValue={setSignInValue}
                      value=''
                    />
                    {signInErrors?.passwordconfirm && (
                      <p className='text-sm text-red-500'>
                        {signInErrors.passwordconfirm.message}
                      </p>
                    )}
                    <button className='w-full mt-5 bg-orange-700 hover:bg-orange-800 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none'>
                      Create new account
                    </button>
                  </form>
                  {accountData.status === "fail" && (
                    <p>{JSON.stringify(accountData.error)}</p>
                  )}
                </>
              ) : (
                <>
                  <form onSubmit={handleSubmit(onSigninStartValid)}>
                    <Input
                      label='Email or Phone'
                      register={register("emailOrPhone", { required: true })}
                      name='emailOrPhone'
                      required={true}
                      placeholder={"Enter email or phone number to sign in"}
                      type='text'
                      setValue={setValue}
                      value=''
                    />
                    <button className='w-full mt-5 bg-orange-700 hover:bg-orange-800 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none'>
                      {method}
                    </button>
                  </form>
                  {signInState.status === "fail" && (
                    <div className='text-red-500 mt-2'>
                      <p>{JSON.stringify(signInState.error)}</p>
                      <p>{"비밀번호가 기억나지 않으세요?"}</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
          <div className='mt-6'>
            <div className='relative -top-2 text-center'>
              <div>
                <span className='bg-white px-2 text-sm text-gray-500'>
                  Or enter with
                </span>
              </div>
            </div>
            <div className='grid grid-cols-2 mt-2 gap-2'>
              <button className='flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'>
                <GitHubIcon className='w-5 h-5' />
              </button>
              <button className='flex items-center justify-center bg-[#FEE500] text-[#000000 85%] border border-gray-300 rounded-md shadow-sm  text-sm font-medium hover:bg-yellow-400'>
                <EmptyBubbleIcon className='w-6 h-6' />
                Login with Kakao
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
