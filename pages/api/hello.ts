import { Request, Response } from "express";

export default function hanlder(req: Request, res: Response) {
  return res.json({ MohamedMontaser: "Best Programmer" });
}
