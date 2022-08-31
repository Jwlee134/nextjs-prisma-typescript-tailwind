import { useRouter } from "next/router";
import { useEffect } from "react";
import { SWRConfig } from "swr";
import "../global.css";
import useUser from "../lib/client/useUser";

export default function App({ Component, pageProps }: any) {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (
      router.pathname !== "/create-account" &&
      router.pathname !== "/log-in"
    ) {
      if (user !== undefined && !user.id) router.replace("/create-account");
    }
  }, [router, user]);

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(`/api${url}`).then((response) => response.json()),
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
