import Post from "@/controllers/post";
import dbConnect from "@/helpers/dbConnect";
import { PostType } from "@/types/posts";
import { Request, Response } from "express";

export const config = {
  api: {
    bodyParser: { sizeLimit: "20mb" },
  },
};

export default async function hanlder(
  req: Request<any, any, PostType>,
  res: Response
) {
  if (req.method !== "POST") return;
  await dbConnect();
  Post.createPost(req, res);
}
