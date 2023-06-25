import React, { FC } from "react";
import styles from "./index.module.scss";
import Card from "@/Components/Card/index";

interface Props {}

const index: FC<Props> = ({}) => {
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
