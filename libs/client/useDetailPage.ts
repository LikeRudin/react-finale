import useSWR from "swr";
import type { KeyedMutator } from "swr";

type UseDetailPage<T> =
  | { status: "ok"; data: T; mutate: KeyedMutator<any> }
  | { status: "error"; error: object | string };

const useDetailPage = <T>(url: string, fallbackData?: {}): UseDetailPage<T> => {
  const { data, error, mutate } = useSWR(
    url,
    (url: string) =>
      fetch(url, {
        headers: {
          method: "GET",
        },
      })
        .then((response) => response.json())
        .then((parsed) => {
          if (parsed.ok) {
            return parsed.data;
          } else {
            throw error(parsed.error);
          }
        })
        .catch((error) => {
          return error;
        }),
    {
      fallbackData,
    }
  );
  return data ? { status: "ok", data, mutate } : { status: "error", error };
};

export default useDetailPage;
