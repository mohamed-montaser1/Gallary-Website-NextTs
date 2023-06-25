import { Request, Response, Router } from "express";
import Mail from "@/controllers/mails";

let pattern =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default function handler(req: Request, res: Response) {
  let email = req.query.email;
  if ((email as string).trim() === "") {
    return res.json({
      success: true,
      message: "You Must Enter An Email",
    });
  }
  if (!pattern.test(email as string)) {
    return res.json({
      success: true,
      message: "Please Enter A Valid Email!",
    });
  }
  return Mail.send(res, email as string);
}
