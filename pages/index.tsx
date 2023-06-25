import React, { FC, useEffect } from "react";
import styles from "./index.module.scss";
import Card from "@/Components/Card/index";
import { useRouter } from "next/router";
import useStorage from "@/hooks/useStorage";

interface Props {}

const index: FC<Props> = ({}) => {
  let router = useRouter();
  if (router.query.refresh) {
    setTimeout(() => {
      location.href = location.origin;
    }, 100);
  }
  useEffect(() => {
    if (useStorage.getItem("code")) {
      useStorage.removeItem("code");
    }
  }, []);
  return (
    <>
      <h1 className={`text-big bold ${styles.h1}`}>
        Most Recent Uploaded Images
      </h1>
      <div className={styles.cards}>
        <Card
          title="This Is My Awesome Image BY AI"
          description="This Is Short Description"
          image="/myImage.jpg"
          likes_count={15}
        />
      </div>
      <button className={`btn-primary ${styles.seeMore}`}>
        See More Photos
      </button>
    </>
  );
};

export default index;
