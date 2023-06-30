import { useRouter } from "next/navigation";
import React, { useEffect, FC, useState } from "react";
import styles from "./CreatePost.module.scss";
import Input from "@/Components/Input";
import useFetch from "@/hooks/useFetch";
import useLogin, { UserInDataType } from "@/hooks/useLogin";
import useStorage from "@/hooks/useStorage";
import usePosts from "@/hooks/usePosts";

interface Props {
  isLoggedIn: boolean;
}

const Page: FC<Props> = ({ isLoggedIn }) => {
  let router = useRouter();
  let [imageSrc, setImageSrc] = useState<string>("");
  let [title, setTitle] = useState<string>("");
  let [description, setDescription] = useState<string>("");
  let [user, setUser] = useState<UserInDataType>({
    _id: "",
    email: "",
    liked_posts: [],
    name: "",
    posts: [],
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
      return;
    }
  }, []);

  const submitAddPost = () => {
    if (imageSrc === "") {
      alert("Please Upload Image For This Post");
      return;
    }
    if (!title) {
      console.log("title is", title);
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
      likes: [],
      author: {
        name: user.name,
        email: user.email,
        _id: user._id,
      },
    };
    let createPostData = useFetch.post(
      "post/create",
      body,
      useStorage.getItem("token") || ""
    );
    createPostData
      .then(() => {
        router.push("/");
      })
      .catch((e) => {
        console.log("this is an error while saving the post - client");
        console.log("error is: ", e);
      });
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
    let regex = /(png|jpeg|jpg|webp)$/gi;
    if (!regex.test(fileName)) {
      alert("Please Upload Image It's Extention is webp or png or jpeg or jpg");
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: ProgressEvent<FileReader>) => {
      setImageSrc(reader.result! as string);
    };
  };
  return (
    <>
      <div className={`${styles.container} container`}>
        <h1 className={styles.h1}>Create New Post</h1>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={handleInputFileChange}
        />
        <label htmlFor="file" className={`btn-primary ${styles.addPhoto}`}>
          Upload Photo
        </label>
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
