import { useState } from "react";
import useSWRMutation from "swr/mutation";

type UseMutationState<T> =
  | { fetchState: "ok"; data: T }
  | { fetchState: "fail"; error: object | string }
  | { fetchState: "loading" };

type useMetationResult<T> = [(data: any) => void, UseMutationState<T>];

const useMutation = <T = any>(url: string): useMetationResult<T> => {
  const [state, setState] = useState<UseMutationState<T>>({
    fetchState: "loading",
  });

  const { trigger } = useSWRMutation(
    url,
    async (url, { arg }: { arg: { requestData: string } }) => {
      setState({ fetchState: "loading" });
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      })
        .then((response) => response.json())
        .then((parsed) => {
          const { ok, data, error } = parsed;
          ok
            ? setState({ fetchState: "ok", data })
            : setState({ fetchState: "fail", error: error as string });
          return parsed;
        })
        .catch((error) => {
          setState({ fetchState: "fail", error });
          return error;
        });
    }
  );
  return [trigger, { ...state }];
};

export default useMutation;
