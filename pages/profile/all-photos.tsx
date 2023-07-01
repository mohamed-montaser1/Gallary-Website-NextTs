import { useEffect, useState } from "react";
import styles from "./allPosts.module.scss";
import { PostType } from "@/types/posts";
import usePosts from "@/hooks/usePosts";
import Card from "@/Components/Card";
import { UserInDataType } from "@/hooks/useLogin";
import Head from "next/head";
import useStorage from "@/hooks/useStorage";
import { nanoid } from "nanoid";
import Popup from "@/Components/Popup";
import Loading from "../loading";

export default function allPhotos() {
  let [posts, setPosts] = useState<Array<PostType>>([]);
  let [user, setUser] = useState<UserInDataType>({
    _id: "",
    email: "",
    name: "",
    posts: [],
  });
  let [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    usePosts
      .getByUserToken(useStorage.getItem("token") as string)
      .then((value) => {
        let posts = value.posts;
        setPosts(posts);
        setUser(value.user);
        setLoading(false);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      <Head>
        <title>My Photos</title>
      </Head>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.h1}>My Photos</h1>
        <div className={styles.cards}>
          {posts?.map((post) => {
            return (
              <>
                <Card
                  title={post.title}
                  description={post.description}
                  user={user}
                  post={post}
                  setUser={setUser}
                  _id={post._id}
                  key={post._id}
                  myPhotos={true}
                />
              </>
            );
          })}
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
}
