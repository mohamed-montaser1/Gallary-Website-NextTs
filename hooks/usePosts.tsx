import { PostType, User } from "@/types/posts";
import useFetch from "./useFetch";
import useStorage from "./useStorage";
import { UserInDataType } from "./useLogin";

type getByPagePostsData = {
  success: boolean;
  posts: Array<PostType>;
  page: number;
};

type getByUserTokenUser = UserInDataType;

type getByUserTokenData = {
  user: getByUserTokenUser;
};

export default class usePosts {
  static async getByPage(page: number, me?: boolean) {
    let data;
    if (!me) {
      data = await useFetch.get<getByPagePostsData, null>(
        "post",
        `page=${page}`,
        null
      );
    } else {
      data = await useFetch.get<getByPagePostsData, string>(
        "post",
        `page=${page}`,
        useStorage.getItem("token")!
      );
    }
    return data;
  }
  static async getAllPosts(): Promise<Array<PostType>> {
    type dataType = {
      success: boolean;
      posts: Array<PostType>;
    };
    let data = await useFetch.get<dataType, null>("post/all", null, null);
    return data.posts;
  }
  static async createPost(post: PostType) {
    const { author, image, title, likes, description } = post;
    let data = useFetch.post("post/create", {
      author,
      image,
      title,
      likes,
      description,
    });

    return data;
  }
  static async getByUserToken(token: string): Promise<{
    user: getByUserTokenUser;
    posts: Array<PostType>;
  }> {
    let data = await useFetch.get<getByUserTokenData, string>(
      "auth/me",
      null,
      token
    );
    let user = data.user;
    return { user, posts: user.posts };
  }
}
