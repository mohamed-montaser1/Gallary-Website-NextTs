import React, { useState, useEffect } from "react";
import styles from "./ControlPanel.module.scss";
import useStorage from "@/hooks/useStorage";
import { useRouter } from "next/router";
import Head from "next/head";

export default function ControlPanel() {
  let router = useRouter();

  useEffect(() => {
    function checkIfLoggedin() {
      if (!useStorage.getItem("token")) {
        router.push("/");
      }
    }
    if (router.isReady) {
      checkIfLoggedin();
    }
  }, [router.isReady]);

  let [showPopup, setShowPopup] = useState<boolean>(false);
  const handleDeleteAccount = () => {
    setShowPopup(true);
  };
  const hanldeFinalDelete = () => {
    fetch("/api/auth/delete", {
      method: "delete",
      headers: {
        Authorization: useStorage.getItem("token") || "",
      },
    }).then(() => {
      localStorage.clear();
      location.reload();
    });
  };
  return (
    <>
      <Head>
        <title>Control Panel</title>
      </Head>
      <div className={`container ${styles.container}`}>
        <h1 className="h1">Control Panel</h1>
        <div className={styles.card}>
          <div className={styles.key}>Email:</div>
          <div className={styles.value}>mastrocoding@gmail.com</div>
        </div>
        <div className={styles.card}>
          <div className={styles.key}>Password:</div>
          <div className={styles.value}>w*************v</div>
        </div>
        <button
          className={`btn-danger ${styles.dangerButton}`}
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
      </div>
      {showPopup && (
        <div className={styles.popUp}>
          <div className={styles.alert}>
            <h4>
              Are You Sure? You Account Will Be Deleted And You Won't Able To
              Restore It.
            </h4>
            <div className={styles.btnContainer}>
              <button className={`btn-danger`} onClick={hanldeFinalDelete}>
                Yes I'm Sure.
              </button>
              <button
                className={`btn-primary`}
                onClick={() => setShowPopup(false)}
              >
                No I Not
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
