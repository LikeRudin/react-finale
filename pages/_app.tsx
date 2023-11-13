import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='w-full max-w-[46rem] min-w-md mx-auto'>
      <Component {...pageProps} />
    </div>
  );
}
