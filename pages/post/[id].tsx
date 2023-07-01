import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Loading from "../loading";
import useFetch from "@/hooks/useFetch";
import { PostType } from "@/types/posts";
import Image from "next/image";
import styles from "./Post.module.scss";
import Popup from "@/Components/Popup";
import Head from "next/head";

export default function PostPage() {
  let router = useRouter();
  let [loading, setIsLoading] = useState<boolean>(true);
  let [post, setPost] = useState<PostType>({
    _id: "",
    author: { _id: "", email: "", name: "" },
    description: "",
    image: "",
    likes: [],
    title: "",
  });
  let [showPopup, setShowPopup] = useState<boolean>(false);
  useEffect(() => {
    async function fetchPostData() {
      let data = await useFetch.get<{ success: boolean; post: PostType }, null>(
        `post/${router.query.id}`,
        null,
        null
      );
      let post = data.post;
      setPost(post);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
    if (router.isReady) {
      fetchPostData();
    }
  }, [router.isReady]);
  return (
    <>
      <Head>
        <title>Post: {post.title}</title>
      </Head>
      <div className={`container ${styles.container}`}>
        <div className={styles.imageContainer}>
          <Image
            src={post.image}
            alt="post image"
            fill
            onClick={() => setShowPopup(true)}
          />
        </div>
        <div className={styles.textContainer}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
        </div>
      </div>

      {showPopup && <Popup imageSrc={post.image} setState={setShowPopup} />}
      {loading && <Loading />}
    </>
  );
}
