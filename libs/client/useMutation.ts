import useSWRMutation from "swr/mutation";
import { HTTPMethod } from "../server/request-validator";
import { callbackify } from "util";

type UseMutationState<T> =
  | { status: "ok"; data: T }
  | { status: "fail"; error: object | string }
  | { status: "error"; error: object | string }
  | { status: "loading" };

type useMetationResult<T> = {
  trigger: (data?: any) => void;
  state: UseMutationState<T>;
};

const useMutation = <T = any>(
  url: string,
  type: HTTPMethod,
  callback?: () => void
): useMetationResult<T> => {
  const { trigger, data, error } = useSWRMutation(
    url,
    async (url, { arg }) => {
      return fetch(url, {
        method: `${type}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      })
        .then((response) => response.json())
        .then((parsed) => {
          if (parsed.ok) {
            return { status: "ok", data: parsed.data };
          } else {
            return { status: "fail", error: parsed.error as string };
          }
        })
        .catch((error) => {
          return error;
        });
    },
    {
      onSuccess: () => {
        if (callback) {
          callback();
        }
      },
    }
  );
  const state = data
    ? data
    : error
    ? { status: "error", error }
    : { status: "loading" };
  return { trigger, state };
};

export default useMutation;
