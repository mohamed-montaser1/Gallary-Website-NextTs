"use client";
import React, { FC, useEffect, useState } from "react";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import useLogin from "@/Context/loginContext";
import useStorage from "@/hooks/useStorage";

const Navbar: FC = () => {
  let [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    if (process.browser) {
      useStorage.getItem("isLoggedIn")?.startsWith("true")
        ? setIsLoggedIn(true)
        : setIsLoggedIn(false);
    }
  }, []);
  return (
    <>
      <div className={styles.navbar}>
        <Link href={"/"}>
          <h2 className={styles.logo}>Gallary</h2>
        </Link>
        {isLoggedIn && (
          <div className={styles.listContainer}>
            <Link href={"/"} className={`${styles.listItem}`}>
              Home
            </Link>
            <Link href={"/profile"} className={styles.listItem}>
              My Profile
            </Link>
          </div>
        )}
        {!isLoggedIn && (
          <Link href={"/sign-in"}>
            <button className="btn-primary">Sign In</button>
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
