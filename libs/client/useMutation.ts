import { useState } from "react";
import useSWRMutation from "swr/mutation";

type UseMutationState<T> =
  | { fetchState: "ok"; responseData: T }
  | { fetchState: "fail"; error: object }
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
        .then((data) => {
          setState({ fetchState: "ok", responseData: data });
        })
        .catch((error) => {
          setState({ fetchState: "fail", error });
        });
    }
  );
  return [trigger, { ...state }];
};

export default useMutation;
