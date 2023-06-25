import React, { useEffect, useState } from "react";
import styles from "./SignUp.module.scss";
import Input from "@/Components/Input/index";
import Link from "next/link";
import ValidationError from "@/lib/ValidationError";
import Auth from "@/Services/authenticationServices";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Mailer from "@/Services/mailer";
import useStorage from "@/hooks/useStorage";
import useLogin from "@/Context/loginContext";

interface registerResult {
  message?: string;
  error?: boolean;
  success: boolean;
  errorMessage?: string;
}

interface loginResult {
  success: boolean;
  token: string;
}

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

  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [err_msg, setErr_msg] = useState("");
  let [success_msg, setSuccess_msg] = useState("");
  let { token, setToken } = useLogin();

  const handleSignUp = async () => {
    if (name.trim() === "" && email.trim() === "" && password.trim() === "") {
      let error = new ValidationError("Please Fill out The Inputs");
      setErr_msg(error.message);
      return;
    }
    if (name.trim() === "" && email.trim() === "") {
      let error = new ValidationError("Please Fill out Name And Email Inputs");
      setErr_msg(error.message);
      return;
    }
    if (name.trim() === "" && password.trim() === "") {
      let error = new ValidationError(
        "Please Fill out Name And Password Inputs"
      );
      setErr_msg(error.message);
      return;
    }
    if (email.trim() === "" && password.trim() === "") {
      let error = new ValidationError(
        "Please Fill out Email And Password Inputs"
      );
      setErr_msg(error.message);
      return;
    }
    if (name.trim() === "") {
      let error = new ValidationError("Please Fill out The Name Input");
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
    let authentication = new Auth(name, email, password);
    let register: registerResult = await authentication.register();
    let login: loginResult = await authentication.login();
    useStorage.setItem("token", login.token);
    setToken!(login.token);
    if (register.error === true) {
      setErr_msg(register.errorMessage!);
      return;
    }
    setSuccess_msg("Created Account Successfully");
    let mailer = new Mailer(email);
    type mailerResponseValue = {
      code: string;
      message: string;
      success: boolean;
    };
    mailer.sendMail().then((value: mailerResponseValue) => {
      useStorage.setItem("code", value.code);
      useStorage.setItem("IsCreatedAccount", "true");
      setTimeout(() => {
        router.push("/verify-email");
      }, 600);
    });
  };

  return (
    <>
      <Head>
        <title>Sign Up</title>
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
      <h1 className={styles.h1}>Sign Up</h1>
      <div className={styles.form}>
        <Input
          placeholder="Your Name..."
          small="Name"
          type="text"
          state={name}
          setState={setName}
        />
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
        <button className="btn-primary" onClick={handleSignUp}>
          Sign Up
        </button>
        <Link href={"/sign-in"} className={styles.signIn}>
          Have Already An Email? Sign In
        </Link>
      </div>
    </>
  );
}