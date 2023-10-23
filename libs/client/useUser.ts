import useSWR from "swr";
import { APIROUTE } from "@/constants/apiroutes";
import { useState } from "react";

type ProfileResponse<T> =
  | {
      fetchState: "loading";
    }
  | { fetchState: "ok"; user: T }
  | { fetchState: "fail"; error: object | string };

const useUser = <T = any>() => {
  const [state, setState] = useState<ProfileResponse<T>>({
    fetchState: "loading",
  });
  const { mutate } = useSWR(APIROUTE.ANY_USE_USER, (url: string) =>
    fetch(url)
      .then((response) => response.json())
      .then((parsed) => {
        const { ok, data, error } = parsed;
        ok
          ? setState({ fetchState: "ok", user: data })
          : setState({ fetchState: "fail", error: error as string });
        return parsed;
      })
      .catch((error) => {
        setState({ fetchState: "fail", error });
      })
  );
  return { ...state, mutate };
};

export default useUser;
