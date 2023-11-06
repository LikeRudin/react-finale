import useSWR from "swr";
import { APIROUTE } from "@/libs/util/apiroutes";
import type { KeyedMutator } from "swr";

type PageInfo = "MEETUP" | "PROFILE" | "CHAT" | "LIVE" | "";

type UseUserState<T> =
  | { status: "ok"; userData: T; mutate: KeyedMutator<any> }
  | { status: "fail"; error: object | string }
  | { status: "error"; error: object | string }
  | { status: "loading" };

const useUser = <T>(page: PageInfo = ""): UseUserState<T> => {
  const { data, error, mutate } = useSWR(
    APIROUTE.ANY_USE_USER(page.toLowerCase()),
    (url: string) =>
      fetch(url)
        .then((response) => response.json())
        .then((parsed) => {
          const { ok, data, error } = parsed;
          const result = ok
            ? { status: "ok", userData: data }
            : { status: "fail", error: error as string };
          return result;
        })
        .catch((error) => {
          return error;
        })
  );
  const user: UseUserState<T> = data
    ? { ...data, mutate }
    : error
    ? { status: "error", error }
    : { status: "loading" };
  return user;
};

export default useUser;
