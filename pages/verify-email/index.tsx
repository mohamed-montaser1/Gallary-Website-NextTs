"use client";

import React from "react";
import styles from "./VerifyEmail.module.scss";
import Input from "@/Components/Input";
import Link from "next/link";
import { useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import useStorage from "@/hooks/useStorage";
export default function Page() {
  let IsCreatedAccount = useStorage.getItem("IsCreatedAccount");
  let router = useRouter();
  if (process.browser) {
    if (IsCreatedAccount == null || !JSON.parse(IsCreatedAccount)) {
      router.push("/sign-up");
    }
  }
  let code: string;
  if (process.browser) {
    code = useStorage.getItem("code")!;
  }
  let [inputValue, setInputValue] = useState("");
  let [err_msg, setErr_msg] = useState("");
  let [success_msg, setSuccess_msg] = useState("");

  const verifyCodeHandler = () => {
    if (inputValue.trim() === "") {
      setSuccess_msg("");
      setErr_msg("Please Enter The Code!");
      return;
    }
    if (isNaN(+inputValue)) {
      setSuccess_msg("");
      setErr_msg("please enter just numbers");
      return;
    }
    if (+code !== +inputValue) {
      setSuccess_msg("");
      setErr_msg("Code Is Wrong");
      return;
    }
    if (+code === +inputValue) {
      console.log(true);
      setErr_msg("");
      setSuccess_msg("Code Is Right !");
      setTimeout(() => {
        useStorage.setItem("IsCreatedAccount", "false");
        useStorage.setItem("isLoggedIn", "true");
        router.back();
      }, 1000);
      return;
    }
  };
  return (
    <>
      <Head>
        <title>Verify Email</title>
      </Head>
      <h2 className={`${styles.alert} ${err_msg ? styles.activeAlert : ""}`}>
        {err_msg}
      </h2>
      <h2
        className={`${styles.success} ${
          success_msg ? styles.activeSuccess : ""
        }`}
      >
        {success_msg}
      </h2>
      <h1 className={styles.h1}>Verify Email</h1>
      <div className={styles.container}>
        <p className={styles.p}>Checkout Your Email !</p>
        <Input
          placeholder="Enter Code Here..."
          small="Code"
          type="text"
          maxLength={5}
          state={inputValue}
          setState={setInputValue}
        />
        <div className={styles.btnContainer}>
          <Link href={"/sign-up"} className="btn-danger">
            Change Your Info
          </Link>
          <button className="btn-primary" onClick={verifyCodeHandler}>
            Verify Email
          </button>
        </div>
      </div>
    </>
  );
}
