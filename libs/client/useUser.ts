import useSWR from "swr";
import { APIROUTE } from "@/constants/apiroutes";
import type { KeyedMutator } from "swr";

type UseUserState<T> =
  | { status: "ok"; data: T }
  | { status: "fail"; error: object | string }
  | { status: "error"; error: object | string }
  | { status: "loading" };

type UserSWR<T> = [mutate: KeyedMutator<any>, user: UseUserState<T>];

const useUser = <T = any>(): UserSWR<T> => {
  const { mutate, data, error } = useSWR(APIROUTE.ANY_USE_USER, (url: string) =>
    fetch(url)
      .then((response) => response.json())
      .then((parsed) => {
        const { ok, data, error } = parsed;
        const result = ok
          ? { fetchState: "ok", user: data }
          : { fetchState: "fail", error: error as string };
        return result;
      })
      .catch((error) => {
        return error;
      })
  );
  const user: UseUserState<T> = data
    ? data
    : error
    ? { status: "error", error }
    : { status: "loading" };
  return [mutate, user];
};

export default useUser;
