import Post from "@/controllers/post";
import dbConnect from "@/helpers/dbConnect";
import { Request, Response } from "express";

export default async function hanlder(req: Request, res: Response) {
  if (req.method !== "POST") return;
  await dbConnect();
  Post.createPost(req, res);
}
