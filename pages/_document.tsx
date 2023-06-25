import { LoginProvider } from "@/Context/loginContext";
import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <LoginProvider>
          <Main /> 
          <NextScript />
        </LoginProvider>
      </body>
    </Html>
  );
}
