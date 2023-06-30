import Post from "@/controllers/post";
import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "PUT") return;
  Post.unLike(req, res);
}
