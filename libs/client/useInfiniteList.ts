import useSWRInfinite from "swr/infinite";
import type { KeyedMutator } from "swr";
type FetchOption = {
  url: string;
  numPerPage?: number;
};

type LoadTrigger<T = any> = () => Promise<T[][] | undefined>;

type useInfiniteList<T> =
  | { status: "loading"; refresh: KeyedMutator<T[][]> }
  | {
      status: "ok";
      data: T[];
      refresh: KeyedMutator<T[][]>;
      loadTrigger: LoadTrigger<T>;
    }
  | {
      status: "loading-more";
      refresh: KeyedMutator<T[][]>;
      data: T[];
      loadTrigger: LoadTrigger<T>;
    }
  | {
      status: "reaching-end";
      refresh: KeyedMutator<T[][]>;
      data: T[];
      loadTrigger: LoadTrigger<T>;
    }
  | { status: "error-init"; refresh: KeyedMutator<T[][]>; error: T }
  | {
      status: "error-later";
      refresh: KeyedMutator<T[][]>;
      data: T[];
      error: T;
      loadTrigger: LoadTrigger<T>;
    };

const useInfiniteList = <T = any>({
  url,
  numPerPage,
}: FetchOption): useInfiniteList<T> => {
  const {
    data: datas,
    error,
    size,
    setSize,
    isValidating,
    mutate,
  } = useSWRInfinite<T[]>(
    (index, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null;
      return `${url}?page=${index + 1}&pageSize=${numPerPage}`;
    },
    async (url) => {
      return fetch(url, {
        method: `GET`,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((parsed) => {
          if (parsed.ok) {
            return parsed.data;
          }
          throw error(parsed.error);
        })
        .catch((error) => {
          return error;
        });
    }
    // .then((result) => {
    //   if (!result.ok) {
    //     throw new Error(result.error);
    //   }
    //   return result.data;
    // })
    // .catch((error) => {
    //   throw error;
    // })
  );
  const isLoading = !datas && !error;

  const isLoadingMore =
    isValidating && size > 0 && datas && typeof datas[size - 1] === "undefined";

  const isReachingEnd =
    datas?.[0]?.length === 0 ||
    (datas && datas[datas.length - 1]?.length < (numPerPage || 10));

  const isErrorInit = !datas && error;
  const isErrorLater = datas && error;

  const refresh = mutate;

  const loadTrigger = () => setSize(size + 1);

  if (isLoading) {
    return { status: "loading", refresh };
  } else if (isErrorInit) {
    return { status: "error-init", error, refresh };
  }

  const data = datas!.flatMap((item) => item);
  if (isLoadingMore) {
    return { status: "loading-more", data, loadTrigger, refresh };
  }
  if (isReachingEnd) {
    return { status: "reaching-end", data, loadTrigger, refresh };
  } else if (isErrorLater) {
    return { status: "error-later", data, error, loadTrigger, refresh };
  } else {
    return {
      status: "ok",
      data,
      loadTrigger,
      refresh,
    };
  }
};

export default useInfiniteList;
