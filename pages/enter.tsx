import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import Input from "../component/input";
import { APIROUTE } from "@/constants/apiroutes";
import Router from "next/router";

function cls(...classnames: string[]) {
  return classnames.join(" ");
}

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

  const { register, handleSubmit, reset } = useForm<EnterForm>();
  const [loginStart, loginData] = useMutation(APIROUTE.ENTER_LOGIN);
  const [signInStart, signInData] = useMutation(APIROUTE.ENTER_SIGNIN);

  const { register: passwordRegister, handleSubmit: handlePasswordSubmit } =
    useForm<PasswordForm>();
  const [confirmPassword, passwordData] = useMutation(APIROUTE.ENTER_PASSWORD);

  const { register: signInRegister, handleSubmit: handleSigninSubmit } =
    useForm<SignInForm>();
  const [createAccount, accountData] = useMutation(APIROUTE.ENTER_CREATION);

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
    signInStart(validForm);
  };
  const onSigninValid = (validForm: SignInForm) => {
    createAccount(validForm);
  };

  useEffect(() => {
    if (
      (passwordData.fetchState === "ok" && passwordData.responseData.ok) ||
      (accountData.fetchState === "ok" && accountData.responseData.ok)
    ) {
      Router.push("/");
    }
  }, [passwordData, signInData]);
  return (
    <div className="mt-16 px-4">
      <h3 className="text-3xl font-semibold text-center">
        Well come to Quo-Meet
      </h3>
      <div className="mt-10">
        <h5 className="text-center">{method}</h5>
        <div className="grid border-b w-full mt-8 grid-cols-2">
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
          {loginData.fetchState === "ok" && loginData.responseData.ok ? (
            <form onSubmit={handlePasswordSubmit(onPasswordValid)}>
              <Input
                label="Password"
                register={passwordRegister("password", { required: true })}
                name="password"
                required={true}
                placeholder="password"
                type="password"
              />
              <button className="w-full mt-5 bg-orange-700 hover:bg-orange-800 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none">
                {method}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onLoginStartValid)}>
              <Input
                label="Email or Phone"
                register={register("emailOrPhone", { required: true })}
                name="emailOrPhone"
                required={true}
                placeholder={"Login with email or phone number"}
                type="text"
              />
              <button className="w-full mt-5 bg-orange-700 hover:bg-orange-800 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none">
                {method}
              </button>
            </form>
          )}
          {loginData.fetchState === "ok" && !loginData.responseData.ok ? (
            <p>{loginData.responseData.error}</p>
          ) : null}
        </>
      )}
      {method === "Sign-in" && (
        <>
          {signInData.fetchState === "ok" && signInData.responseData.ok ? (
            <form onSubmit={handleSigninSubmit(onSigninValid)}>
              <Input
                label="Email"
                register={signInRegister("email", { required: true })}
                name="email"
                required={true}
                placeholder="Enter email address"
                type="email"
              />
              <Input
                label="Phone"
                register={signInRegister("phone", { required: true })}
                name="phone"
                required={true}
                placeholder="Enter phone number including only numbers"
                type="text"
              />
              <Input
                label="UserName"
                register={signInRegister("username", { required: true })}
                name="username"
                required={true}
                placeholder="Enter username, which is not necessarilry unique"
                type="text"
              />
              <Input
                label="Password"
                register={signInRegister("password", { required: true })}
                name="password"
                required={true}
                placeholder="Enter your password"
                type="password"
              />
              <Input
                label="Password Confirm"
                register={signInRegister("passwordconfirm", { required: true })}
                name="passwordconfirm"
                required={true}
                placeholder="Re-enter your password"
                type="password"
              />
              <button className="w-full mt-5 bg-orange-700 hover:bg-orange-800 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none">
                Create new account
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSigninStartValid)}>
              <Input
                label="Email or Phone"
                register={register("emailOrPhone", { required: true })}
                name="emailOrPhone"
                required={true}
                placeholder={"Enter email or phone number to sign in"}
                type="text"
              />
              <button className="w-full mt-5 bg-orange-700 hover:bg-orange-800 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold focus:ring-2 focus:ring-offset-2 focus:ring-orange-700 focus:outline-none">
                {method}
              </button>
            </form>
          )}
        </>
      )}
      <div className="mt-6">
        <div className="relative -top-2 text-center">
          <div>
            <span className="bg-white px-2 text-sm text-gray-500">
              Or enter with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 mt-2 gap-2">
          <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="flex items-center justify-center bg-[#FEE500] text-[#000000 85%] border border-gray-300 rounded-md shadow-sm  text-sm font-medium hover:bg-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
              />
            </svg>
            Login with Kakao
          </button>
        </div>
      </div>
    </div>
  );
}
