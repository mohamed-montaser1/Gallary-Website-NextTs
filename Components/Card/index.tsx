import React, { FC, useEffect, useState } from "react";
import styles from "./Card.module.scss";
import Image from "next/image";
import useLogin from "@/Context/loginContext";
import useStorage from "@/hooks/useStorage";

interface Props {
  title: string;
  description: string;
  likes_count: number;
  image: string;
}

const Card: FC<Props> = ({ description, likes_count, title, image }) => {
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
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image src={image} alt="image" width={300} height={240} />
        </div>
        <div className={`${styles.body}`}>
          <div className={styles.text}>
            <h2 className={`text-small bold ${styles.h2}`}>{title}</h2>
            <p className={`text-vs normal ${styles.p}`}>{description}</p>
          </div>
          <div className={styles.controllers}>
            {isLoggedIn ? (
              <button className="btn-primary">
                <Image
                  src="/heart-icon.svg"
                  alt="heart icon"
                  width={30}
                  height={30}
                />
              </button>
            ) : (
              ""
            )}
            <p style={{ textAlign: "center" }}>{likes_count} likes</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
