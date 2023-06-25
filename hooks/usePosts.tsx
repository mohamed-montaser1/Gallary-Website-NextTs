import { PostType } from "@/types/posts";
import useFetch from "./useFetch";

export default class usePosts {
  public posts: Array<PostType> = [];
  constructor() {}
  async getAllPosts(): Promise<Array<PostType>> {
    type dataType = {
      success: boolean;
      posts: Array<PostType>;
    };
    let data = await useFetch.get<dataType>("post/all");
    this.posts = data.posts;
    return data.posts;
  }
}
