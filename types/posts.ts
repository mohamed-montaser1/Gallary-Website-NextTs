export interface User {
  name: string;
  email: string;
  _id: string;
}

export interface PostType {
  image: string;
  title: string;
  author: User;
  likes: [User];
}
