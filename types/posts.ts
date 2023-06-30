export interface User {
  name: string;
  email: string;
  _id: string;
}

export interface PostType {
  image: string;
  title: string;
  description: string;
  author: User;
  likes: Array<User>;
  _id: string;
}
