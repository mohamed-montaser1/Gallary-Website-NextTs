import React, { FC, useEffect, useReducer, useRef, useState } from "react";
import styles from "./Card.module.scss";
import Image from "next/image";
import useStorage from "@/hooks/useStorage";
import Popup from "../Popup";
import { PostType } from "@/types/posts";
import { UserInDataType } from "@/hooks/useLogin";
import { useRouter } from "next/router";

interface Props {
  user: UserInDataType;
  post: PostType;
  myPhotos: boolean;
  style?: any;
  inUpdate?: boolean;
  liked?: boolean;
}

enum actions {
  INCREASE = "INCREASE",
  DECREASE = "DECREASE",
}

interface state {
  b_count: number;
  a_count: number;
}

interface payload {
  b_count: number;
  a_count: number;
}

interface action {
  type: string;
  payload: payload;
}

function reducerFunction(state: state, action: action) {
  switch (action.type) {
    case actions.INCREASE:
      return {
        ...state,
        a_count: state.b_count + 1,
      };
    case actions.DECREASE:
      return {
        ...state,
        a_count: state.b_count - 1,
      };
    default:
      return state;
  }
}

const Card: FC<Props> = ({ user, post, myPhotos, style, inUpdate, liked }) => {
  let unknown_likes = post.likes as unknown;
  let likes = unknown_likes as Array<string>;
  let [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  let [showPopup, setShowPopup] = useState<boolean>(false);
  let [imageSrc, setImageSrc] = useState<string>("");
  let [likes_count, setLikes_count] = useState<number>(post.likes.length || 0);
  let [state, dispatch] = useReducer(reducerFunction, {
    b_count: 0,
    a_count: 0,
  });
  let likesCountRef = useRef<HTMLSpanElement>(null);
  console.log(liked);
  let router = useRouter();

  useEffect(() => {
    if (process.browser) {
      useStorage.getItem("isLoggedIn")?.startsWith("true")
        ? setIsLoggedIn(true)
        : setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (likesCountRef.current) {
      if (state.b_count > state.a_count) {
        // unliked
        likesCountRef.current.innerText = String(
          +likesCountRef.current.innerText - 1
        );
        // likesCountRef.current.innerText = String(count);
      } else {
        // liked
        likesCountRef.current.innerText = String(
          +likesCountRef.current.innerText + 1
        );
      }
    }
  }, [state.a_count]);

  const handleFullScreenImage = (e: React.MouseEvent<HTMLImageElement>) => {
    setShowPopup(true);
    let target = e.target as HTMLImageElement;
    setImageSrc(target.src);
  };

  const handleAddLove = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (liked) {
      //unlike
      console.log("trying to remove like");
      fetch("/api/post/unlike", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") as string,
        },
        body: JSON.stringify({
          postId: post._id,
        }),
      });
      dispatch({
        type: actions.DECREASE,
        payload: { b_count: state.b_count, a_count: state.b_count - 1 },
      });
    } else {
      // like
      fetch("/api/post/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")!,
        },
        body: JSON.stringify({
          postId: post._id,
        }),
      });
      dispatch({
        type: actions.INCREASE,
        payload: { b_count: state.b_count, a_count: state.b_count + 1 },
      });
    }
    liked = !liked;
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
      <div
        className={`${styles.card} ${inUpdate ? styles.inUpdate : ""}`}
        style={style}
        onClick={handleOpenPhoto}
      >
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
            <h2 className={`text-small bold ${styles.h2}`}>{post.title}</h2>
            <p className={`text-vs normal ${styles.p}`}>
              {post.description.length < 39
                ? post.description.slice(0, 38)
                : `${post.description.slice(0, 38)}...`}
            </p>
          </div>
          {inUpdate ? (
            ""
          ) : (
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
              <p style={{ textAlign: "center" }}>
                <span ref={likesCountRef}>{likes_count}</span> likes
              </p>
            </div>
          )}
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
