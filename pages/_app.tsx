import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";
import useLogin from "@/hooks/useLogin";
import "@/styles/globals.scss";
import "@/pages/loading.scss";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import { useEffect, useState } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: ["Airal", "sans-serif"],
});

export default function App({ Component, pageProps }: AppProps) {
  let [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    setIsLoggedIn(useLogin.getIsLoggedIn() as boolean);
  }, []);

  return (
    <>
      <main className={montserrat.className}>
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
