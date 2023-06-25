import Navbar from "@/Components/Navbar";
import useLogin from "@/Context/loginContext";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: ["Airal", "sans-serif"],
});

export default function App({ Component, pageProps }: AppProps) {
  let { token } = useLogin();
  let isLoggedIn = false;
  if (token?.replace("Bearer", "").trim() !== "") {
    isLoggedIn = true;
  }
  return (
    <>
      <main className={montserrat.className}>
        <Navbar />
        <Component {...pageProps} />
      </main>
    </>
  );
}
