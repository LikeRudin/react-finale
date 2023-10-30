import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url)
            .then((response) => response.json())
            .then((parsed) => {
              const { ok, data, error } = parsed;
              const result = ok
                ? { status: "ok", data: data }
                : { status: "fail", error: error as string };
              return result;
            })
            .catch((error) => {
              return error;
            }),
      }}
    >
      <div className="w-full max-w-xl min-w-md mx-auto">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}
