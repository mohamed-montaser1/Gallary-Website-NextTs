import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";
import useLogin from "@/hooks/useLogin";
import "@/styles/globals.scss";
import "@/pages/loading.scss";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { useEffect, useState } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  fallback: ["Airal", "sans-serif"],
});

export default function App({ Component, pageProps }: AppProps) {
  let [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    setIsLoggedIn(useLogin.getIsLoggedIn() as boolean);
  }, []);

  return (
    <>
      <main className={roboto.className}>
        <Navbar isLoggedIn={isLoggedIn} />
        <Sidebar
          key={(Math.random() * 1_000_000 * 20_18) & 20}
          isLoggedIn={isLoggedIn}
        />
        <Component {...pageProps} isLoggedIn={isLoggedIn} />
      </main>
    </>
  );
}
