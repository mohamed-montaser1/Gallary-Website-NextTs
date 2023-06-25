import { Request, Response, Router } from "express";
import Auth from "@/controllers/auth";
import dbConnect from "@/helpers/dbConnect";

export default async function handler(req: Request, res: Response) {
  await dbConnect();
  if (req.method !== "POST") return;
  Auth.register(req, res);
}
