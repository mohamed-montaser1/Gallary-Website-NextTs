import React, { FC, useEffect, useState } from "react";
import styles from "./Card.module.scss";
import Image from "next/image";
import useStorage from "@/hooks/useStorage";
import Popup from "../Popup";
import { PostType } from "@/types/posts";
import { UserInDataType } from "@/hooks/useLogin";

interface Props {
  title: string;
  description: string;
  user: UserInDataType;
  setUser: React.Dispatch<React.SetStateAction<UserInDataType>>;
  _id: string;
  post: PostType;
}

const Card: FC<Props> = ({ title, description, user, _id, setUser, post }) => {
  let [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  let [showPopup, setShowPopup] = useState<boolean>(false);
  let [imageSrc, setImageSrc] = useState<string>("");
  let [likes_count, setLikes_count] = useState<number>(post.likes.length || 0);
  let [isLiked, setIsLiked] = useState<boolean>(false);
  useEffect(() => {
    if (process.browser) {
      useStorage.getItem("isLoggedIn")?.startsWith("true")
        ? setIsLoggedIn(true)
        : setIsLoggedIn(false);
    }
  }, []);

  const handleFullScreenImage = (e: React.MouseEvent<HTMLImageElement>) => {
    setShowPopup(true);
    let target = e.target as HTMLImageElement;
    setImageSrc(target.src);
  };

  const handleAddLove = () => {
    for (let i = 0; i < user.liked_posts.length; i++) {
      if (user.liked_posts[i]._id! === post._id) {
        setIsLiked(true);
      }
    }

    if (isLiked) {
      handleRemoveLove();
      location.reload();
      return;
    }
    handleAddLoveToPost();
    location.reload();
    return;
  };

  const handleAddLoveToPost = () => {
    fetch("/api/post/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")!,
      },
      body: JSON.stringify({
        postId: post._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setLikes_count((prev) => prev + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleRemoveLove = () => {
    for (let i = 0; i < user.liked_posts.length; i++) {
      if (user.liked_posts[i]._id! === post._id) {
        handleAddLoveToPost();
        return;
      }
    }
    fetch("/api/post/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")!,
      },
      body: JSON.stringify({
        postId: post._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setLikes_count((prev) => prev - 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {showPopup && <Popup imageSrc={imageSrc} setState={setShowPopup} />}
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={post.image}
            alt="image"
            width={300}
            height={240}
            onClick={handleFullScreenImage}
          />
        </div>
        <div className={`${styles.body}`}>
          <div className={styles.text}>
            <h2 className={`text-small bold ${styles.h2}`}>{title}</h2>
            <p className={`text-vs normal ${styles.p}`}>
              {description.length < 39
                ? description.slice(0, 38)
                : `${description.slice(0, 38)}...`}
            </p>
          </div>
          <div className={styles.controllers}>
            {isLoggedIn && (
              <button className={`btn-primary`} onClick={() => handleAddLove()}>
                <Image
                  src="/heart-icon.svg"
                  alt="heart icon"
                  width={30}
                  height={30}
                />
              </button>
            )}
            <p style={{ textAlign: "center" }}>{likes_count} likes</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
