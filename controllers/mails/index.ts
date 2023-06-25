import { Request, Response } from "express";
import { createTransport } from "nodemailer";
import { resolve } from "path";

interface mailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

class Mail {
  static send(res: Response, email: string) {
    let code: Array<number> = [];
    for (let i = 0; i < 5; i++) code.push(Math.floor(Math.random() * 10));

    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASS,
      },
    });

    const mailOptions: mailOptions = {
      from: process.env.MY_EMAIL!,
      to: email,
      subject: "Verify Email",
      html: `
       <div style="font-family: Arial; background-color: #242526; width: 700px; height: 300px; text-align: center; padding: 20px; margin: auto; border-radius: 30px">
        <h1 style="color: white !important">Hello There! How Are you? I Hope You Doing Great</h1>
        <h3 style="color: white !important">You Send Verify Email Requiest From Gallary Website</h3>
        <h4 style="color: white !important">The Verify Code Is: ${code.join(
          ""
        )}</h4>
      </div> 
        `,
    };

    transporter.sendMail(mailOptions, (err, success) => {
      if (err) {
        return res.json({
          success: true,
          error: true,
          errMessage: err.message,
        });
      } else {
        return res.json({
          success: true,
          code: code.join(""),
          message: success.response,
        });
      }
    });
  }
}

export default Mail;
