import React, { FC, useEffect, useState } from "react";
import styles from "./index.module.scss";
import Card from "@/Components/Card/index";
import { useRouter } from "next/router";
import useStorage from "@/hooks/useStorage";
import Head from "next/head";
import usePosts from "@/hooks/usePosts";
import { PostType } from "@/types/posts";
import useLogin, { UserInDataType } from "@/hooks/useLogin";
import Loading from "./loading";

interface Props {
  isLoggedIn: boolean;
}

const Page: FC<Props> = ({ isLoggedIn }) => {
  let router = useRouter();
  let [posts, setPosts] = useState<Array<PostType>>([]);
  let [allPostsLength, setAllPostsLength] = useState<number>(0);
  let [page, setPage] = useState<number>(1);
  let [user, setUser] = useState<UserInDataType>({
    _id: "",
    email: "",
    name: "",
    posts: [],
  });
  let [loading, setLoading] = useState<boolean>(true);

  if (router.query.refresh) {
    setTimeout(() => {
      location.href = location.origin;
    }, 100);
  }
  useEffect(() => {
    if (useStorage.getItem("code")) {
      useStorage.removeItem("code");
    }
    usePosts.getByPage(page).then((data) => {
      setPosts(data.posts);
    });
    usePosts.getAllPosts().then((value) => {
      setAllPostsLength(value.length);
    });
  }, []);
  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        let user = await useLogin.getUserDataByToken(
          useStorage.getItem("token") || ""
        );
        setUser(user);
        setLoading(false);
      })();
    }
    if (useStorage.getItem("token") == null) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, [isLoggedIn]);

  const handleShowMorePhotos = async () => {
    let currentPage = page + 1;
    setPage(currentPage);
    let res = await usePosts.getByPage(currentPage);
    let currnetPosts = [...posts, ...res.posts];
    setPosts(currnetPosts);
  };

  return (
    <>
      <Head>
        <title>Recent Uploaded Photos</title>
      </Head>
      <div
        className={`${styles.container} ${
          !isLoggedIn && styles.notLoggedIn
        } container`}
      >
        <h1 className={`text-big bold h1`}>Most Recent Uploaded Images</h1>
        <div className={styles.cards}>
          {posts?.map((post) => {
            return (
              <>
                <Card
                  title={post.title}
                  description={post.description}
                  post={post}
                  user={user}
                  setUser={setUser}
                  _id={post._id}
                  key={post._id}
                  myPhotos={false}
                />
              </>
            );
          })}
        </div>
        {allPostsLength > 6 && (
          <button
            className={`btn-primary ${styles.seeMore}`}
            onClick={handleShowMorePhotos}
          >
            See More Photos
          </button>
        )}
      </div>

      {loading && <Loading />}
    </>
  );
};

export default Page;
