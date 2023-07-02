import React, { useEffect, useState } from "react";
import styles from "./SignIn.module.scss";
import Input from "@/Components/Input/index";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/navigation";
import useStorage from "@/hooks/useStorage";
import ValidationError from "@/lib/ValidationError";
import { loginResult } from "../sign-up";
import Auth from "@/Services/authenticationServices";
import useLogin from "@/hooks/useLogin";

export default function Page({ isLoggedIn }: { isLoggedIn: boolean }) {
  let router = useRouter();
  let [email, setEmail] = useState<string>("");
  let [password, setPassword] = useState<string>("");
  let [err_msg, setErr_msg] = useState<string>("");
  let [success_msg, setSuccess_msg] = useState<string>("");

  if (isLoggedIn) {
    router.push("/");
  }
  const signInHandler = async () => {
    if (email.trim() === "" && password.trim() === "") {
      let error = new ValidationError(
        "Please Fill out Email And Password Inputs"
      );
      setErr_msg(error.message);
      return;
    }
    if (email.trim() === "") {
      let error = new ValidationError("Please Fill out The Email Input");
      setErr_msg(error.message);
      return;
    }
    let pattern = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)?$/;
    if (!pattern.test(email)) {
      let error = new ValidationError("Please Enter A Valid Email");
      setErr_msg(error.message);
      return;
    }
    if (password.trim() === "") {
      let error = new ValidationError("Please Fill out The Password Input");
      setErr_msg(error.message);
      return;
    }
    if (password.length < 7) {
      let error = new ValidationError("Password Should Be Bigger Than 6 chars");
      setErr_msg(error.message);
      return;
    }
    setErr_msg("");
    let authentication = new Auth(email, password);
    let login: loginResult = await authentication.login();
    console.log(login);
    if (login.error) {
      setErr_msg(login.errorMessage);
      return;
    }
    setSuccess_msg(`Login Successfully`);
    useStorage.setItem("isLoggedIn", "true");
    useStorage.setItem("IsCreatedAccount", "false");
    useStorage.setItem("token", login.token);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className={`${styles.container} container notLoggedIn`}>
        <h1 className="h1">Sign In</h1>
        <div className={styles.form}>
          <Input
            placeholder="Your Email..."
            small="Email"
            type="text"
            state={email}
            setState={setEmail}
          />
          <Input
            placeholder="Your Password..."
            small="Password"
            type="password"
            state={password}
            setState={setPassword}
          />
          <button className="btn-primary" onClick={signInHandler}>
            Sign In
          </button>
          <Link href={"/sign-up"} className={styles.signUp}>
            Don’t Have An Email? Sign Up
          </Link>
        </div>
      </div>
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
    </>
  );
}
