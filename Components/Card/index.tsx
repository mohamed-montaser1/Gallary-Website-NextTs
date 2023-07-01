import React, { FC, useEffect, useState } from "react";
import styles from "./Card.module.scss";
import Image from "next/image";
import useStorage from "@/hooks/useStorage";
import Popup from "../Popup";
import { PostType } from "@/types/posts";
import { UserInDataType } from "@/hooks/useLogin";
import { useRouter } from "next/router";

interface Props {
  title: string;
  description: string;
  user: UserInDataType;
  setUser: React.Dispatch<React.SetStateAction<UserInDataType>>;
  _id: string;
  post: PostType;
  myPhotos: boolean;
}

const Card: FC<Props> = ({
  title,
  description,
  user,
  _id,
  setUser,
  post,
  myPhotos,
}) => {
  let [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  let [showPopup, setShowPopup] = useState<boolean>(false);
  let [imageSrc, setImageSrc] = useState<string>("");
  let [likes_count, setLikes_count] = useState<number>(post.likes.length || 0);
  let [isLiked, setIsLiked] = useState<boolean>(false);

  let router = useRouter();

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

  const handleAddLove = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(post.likes);
    for (let i = 0; i < post.likes.length; i++) {
      let likes = post.likes[i] as unknown;
      likes = likes as string;
      if (likes === user._id) {
        setIsLiked(true);
      }
    }
    if (isLiked) {
      let target = e.target as HTMLButtonElement;
      target.classList.add(styles.liked);
      return;
    }

    handleAddLoveToPost(e);
    return;
  };

  const handleAddLoveToPost = (e: React.MouseEvent<HTMLButtonElement>) => {
    let target = e.target as HTMLButtonElement;
    target.style.pointerEvents = "none";
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
        if (result.error === true) {
          alert("You Liked This Photo Already!");
          setIsLiked(true);
          return;
        }
        setLikes_count((prev) => prev + 1);
        setIsLiked(true);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleOpenPhoto = (e: React.MouseEvent<HTMLDivElement>) => {
    let target = e.target as HTMLDivElement;
    if (
      target.classList.contains("Card_card__I50fD") ||
      target.classList.contains("Card_p__L4PVm") ||
      target.classList.contains("Card_h2__5wjGW")
    ) {
      router.push(`/post/${post._id}`);
      return;
    }
  };

  const deletePost = () => {
    fetch(`/api/post/delete/${post._id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          alert("Error While Deleting Post!");
          return;
        }
        alert("Deleted Successfully!");
        location.reload();
      })
      .catch((error) => console.log(error));
  };

  const handleUpdatePost = () => {
    router.push(`/post/update/${post._id}`);
  };

  return (
    <>
      {showPopup && <Popup imageSrc={imageSrc} setState={setShowPopup} />}
      <div className={styles.card} onClick={handleOpenPhoto}>
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
              <button className={`btn-primary`} onClick={handleAddLove}>
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
        {myPhotos && (
          <div className={styles.updateDeleteControllers}>
            <button className="btn-primary" onClick={handleUpdatePost}>
              Update
            </button>
            <button className="btn-danger" onClick={deletePost}>
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Card;
