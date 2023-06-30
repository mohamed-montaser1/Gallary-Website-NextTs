import Post from "@/controllers/post";
import dbConnect from "@/helpers/dbConnect";
import { Request, Response } from "express";

export default async function hanlder(req: Request, res: Response) {
  await dbConnect();
  if (req.method !== "GET") return;
  Post.getByPage(req, res);
}
