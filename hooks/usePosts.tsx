import { PostType } from "@/types/posts";
import useFetch from "./useFetch";

export default class usePosts {
  public posts: Array<PostType> = [];
  constructor() {
    this.getAllPosts();
  }
  async getAllPosts() {
    let res = await useFetch.get("");
  }
}
