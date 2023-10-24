import { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import "./styles.css";

const PRSWeb = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient();

  return (
    <>
      <Head>
        <title>711dubs!!!!</title>
        <html lang="en" data-theme="halloween" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <main>
          <Component {...pageProps} />
          <Toaster position="bottom-right" />
        </main>
      </QueryClientProvider>
    </>
  );
};

export default PRSWeb;
