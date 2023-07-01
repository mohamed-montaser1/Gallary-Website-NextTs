import { PostType, User } from "@/types/posts";
import useStorage from "./useStorage";

export type UserInDataType = User & {
  posts: Array<PostType>;
};

export type UserDataType = {
  user: UserInDataType;
};

export default class useLogin {
  static getIsLoggedIn() {
    if (process.browser) {
      if (useStorage.getItem("isLoggedIn")?.startsWith("true")) {
        return true;
      } else {
        return false;
      }
    }
  }

  static async getUserDataByToken(token: string) {
    let res = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    let data: UserDataType = await res.json();
    return data.user;
  }
}
