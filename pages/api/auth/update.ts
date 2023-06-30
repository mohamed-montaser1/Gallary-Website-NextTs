import dbConnect from "@/helpers/dbConnect";
import { Request, Response } from "express";
import Auth from "@/controllers/auth/index";

export default async function hanlder(req: Request, res: Response) {
  if (req.method !== "PUT") return;
  await dbConnect();
  Auth.update(req, res);
}
