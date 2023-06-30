import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  res.json({ success: true, mohamed_montaser_is: "best programmer" });
}
