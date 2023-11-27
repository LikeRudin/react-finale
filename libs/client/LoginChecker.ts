import useSWR from "swr";
import Router from "next/router";
import { useEffect } from "react";
import { PROFILE_API_ROUTE } from "../util/apiroutes";

const LoginChecker = () => {
  const { data, error } = useSWR(PROFILE_API_ROUTE.AUTHENTICATION, (url) =>
    fetch(url).then((res) => res.json())
  );

  const isLoggedInButInLoginPage =
    data && data.ok && Router.pathname.includes("enter");

  const isNotLoggedInButInLoggedInPage =
    data && !data.ok && !Router.pathname.includes("enter");

  useEffect(() => {
    if (isLoggedInButInLoginPage) {
      Router.replace("/");
    }
    if (isNotLoggedInButInLoggedInPage || error) Router.replace("/enter");
  }, [isNotLoggedInButInLoggedInPage, isLoggedInButInLoginPage, error]);
  console.log("it runned");
  console.log(data);
};

export default LoginChecker;
