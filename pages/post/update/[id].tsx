import { useRouter } from "next/router";
import React, { useEffect, FC, useState } from "react";
import styles from "../../profile/CreatePost.module.scss";
import Input from "@/Components/Input";
import useLogin, { UserInDataType } from "@/hooks/useLogin";
import useStorage from "@/hooks/useStorage";
import Head from "next/head";

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
    };
    fetch(`/api/post/update/${router.query.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => console.log("data is ", data))
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
      <Head>
        <title>Update Post</title>
      </Head>
      <div className={`${styles.container} container`}>
        <h1 className={"h1"}>Update Post With ID: {router.query.id}</h1>
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
