import React, { useEffect, useState } from "react";
import styles from "./SignIn.module.scss";
import Input from "@/Components/Input/index";
import Link from "next/link";
import Head from "next/head";
import {useRouter} from "next/navigation"
import useStorage from "@/hooks/useStorage";
export default function Page() {
  let router = useRouter();
  let [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    if (process.browser) {
      useStorage.getItem("isLoggedIn")?.startsWith("true")
        ? setIsLoggedIn(true)
        : setIsLoggedIn(false);
    }
  }, []);
  if (isLoggedIn) {
    router.push("/");
  }
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <h1 className={styles.h1}>Sign In</h1>
      <div className={styles.form}>
        <Input placeholder="Your Email..." small="Email" type="text" />
        <Input
          placeholder="Your Password..."
          small="Password"
          type="password"
        />
        <button className="btn-primary">Sign In</button>
        <Link href={"/sign-up"} className={styles.signUp}>
          Don’t Have An Email? Sign Up
        </Link>
      </div>
    </>
  );
}
