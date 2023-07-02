import Post from "@/controllers/post";
import { Request, Response } from "express";

export default function handler(req: Request, res: Response) {
  if (req.method !== "GET") return;
  Post.getOne(req, res);
}
