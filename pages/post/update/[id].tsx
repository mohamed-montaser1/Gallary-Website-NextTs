import { useRouter } from "next/router";
import React, { useEffect, FC, useState, useRef } from "react";
import styles from "../../profile/CreatePost.module.scss";
import Input from "@/Components/Input";
import useLogin, { UserInDataType } from "@/hooks/useLogin";
import useStorage from "@/hooks/useStorage";
import Head from "next/head";
import Card from "@/Components/Card/index";
import { PostType } from "@/types/posts";

interface Props {
  isLoggedIn: boolean;
}

const Page: FC<Props> = ({ isLoggedIn }) => {
  let router = useRouter();
  let imageName = useRef<HTMLParagraphElement>(null);
  let [imageSrc, setImageSrc] = useState<string>("");
  let [title, setTitle] = useState<string>("");
  let [description, setDescription] = useState<string>("");
  let [oldPost, setOldPost] = useState<PostType>({
    _id: "",
    author: {
      _id: "",
      email: "",
      name: "",
    },
    description: "",
    image: "",
    likes: [],
    title: "",
  });
  let [user, setUser] = useState<UserInDataType>({
    _id: "",
    email: "",
    name: "",
    posts: [],
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
      return;
    }
    fetch(`/api/post/${router.query.id}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setOldPost(data.post);
      });
  }, []);

  const submitAddPost = () => {
    if (imageSrc === "") {
      alert("Please Upload Image For This Post");
      return;
    }
    if (!title) {
      alert("Please Add Title For This Post");
      return;
    }
    if (description === "") {
      alert("Please Add description For This Post");
      return;
    }

    let body = {
      image: imageSrc,
      title,
      description,
    };
    fetch(`/api/post/update/${router.query.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(() => {
        router.push("/");
      })
      .catch((err) => console.log("error while updating - client", err));
  };

  useEffect(() => {
    (async () => {
      let user = await useLogin.getUserDataByToken(
        useStorage.getItem("token") || ""
      );
      setUser(user);
    })();
  }, [isLoggedIn]);

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let target = e.target as HTMLInputElement;
    let file = target.files![0];
    let fileName = file.name;
    let regex = /(png|jpeg)$/gi;
    if (!regex.test(fileName)) {
      alert("Please Upload Image It's Extention is png or jpg");
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: ProgressEvent<FileReader>) => {
      setImageSrc(reader.result! as string);
      if (imageName.current) {
        imageName.current.innerText = fileName;
      }
    };
  };
  return (
    <>
      <Head>
        <title>Update Post</title>
      </Head>
      <div className={`${styles.container} container`}>
        <h1 className={"h1"}>Update Post</h1>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={handleInputFileChange}
        />
        <h4 className={`text-small ${styles.oldH4}`}>Old Photo: </h4>
        <Card
          post={oldPost}
          myPhotos={false}
          user={user}
          style={{ margin: "20px auto" }}
          inUpdate={true}
        />
        <label htmlFor="file" className={`btn-primary ${styles.addPhoto}`}>
          Upload Photo
        </label>
        <p ref={imageName} className={styles.imageName}></p>
        <div className={styles.formContainer}>
          <Input
            small="Title"
            placeholder="Enter Title Here..."
            type="text"
            state={title}
            setState={setTitle}
            maxLength={30}
          />
          <Input
            small="Description"
            placeholder="Enter Description Here..."
            type="text"
            role="textarea"
            state={description}
            setState={setDescription}
          />
          <button
            className={`btn-primary ${styles.submit}`}
            onClick={submitAddPost}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
