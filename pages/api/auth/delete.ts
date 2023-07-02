import dbConnect from "@/helpers/dbConnect";
import { Request, Response } from "express";
import Auth from "@/controllers/auth/index";

export default async function hanlder(req: Request, res: Response) {
  if (req.method !== "DELETE") return;
  await dbConnect();
  Auth.delete(req, res);
}
