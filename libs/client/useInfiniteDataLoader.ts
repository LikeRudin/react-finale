import useSWRInfinite from "swr/infinite";

interface FetchOption {
  url: string;
  pageSize: number;
}

const useInfiniteDataLoader = ({ url, pageSize }: FetchOption) => {
  const { data, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite(
      (index, previousPageData) => {
        if (previousPageData && !previousPageData.length) {
          return null;
        }
        return `${url}&page=${index + 1}`;
      },
      async (url: string) => fetch(url).then((res) => res.json())
    );

  const datas = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < pageSize);
  return { datas, mutate, isLoadingMore, isEmpty, isReachingEnd };
};

export default useInfiniteDataLoader;
