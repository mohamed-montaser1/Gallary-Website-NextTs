import { Request, Response } from "express";
import userModel, { postsType } from "../../models/user.model";
import { compareSync, hashSync } from "bcrypt";
import { JwtPayload, verify } from "jsonwebtoken";
import { verifyPayload, signToken } from "@/helpers/jwtHelper";

class Auth {
  static async login(req: Request, res: Response) {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: true,
        message: "Bad Request",
      });
    }

    if (email.trim() == "" || password.trim() == "") {
      return res.status(400).json({
        success: true,
        message: "Bad Request",
      });
    }
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: true,
        errorMessage: "Not Found User!",
        error: true,
      });
    }
    if (!compareSync(password, user.password)) {
      return res.json({
        success: true,
        errorMessage: "Password Is Wrong!",
        error: true,
      });
    }
    let token = await signToken({ email, sub: user._id });
    return res.status(200).json({
      success: true,
      token,
    });
  }
  static async register(req: Request, res: Response) {
    let { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: true,
        message: "Bad Request",
      });
    }
    if (
      (name! as string).trim() == "" ||
      (email! as string).trim() == "" ||
      (password! as string).trim() == ""
    ) {
      return res.status(400).json({
        success: true,
        errorMessage: "Bad Request",
        error: true,
      });
    }
    let user = await userModel.findOne({ email });
    if (user) {
      return res.json({
        success: true,
        errorMessage: "There Is Already User With This Email",
        error: true,
      });
    }
    let posts: postsType = [];
    let liked_posts: postsType = [];

    let newUser = await userModel.create({
      name,
      email,
      password: hashSync(password, 8),
      posts,
      liked_posts,
    });

    try {
      await newUser.save().then(() => {
        return res.status(201).json({
          success: true,
          message: "User Saved Successfully in Db!",
        });
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "There Is An Error While Saving The User",
        error_message: error.message! as string,
        error: true,
      });
    }
  }
  static async me(req: Request, res: Response) {
    type payload = { email: string } | string | JwtPayload;
    let token = req.headers["authorization"] as string;
    token = token?.replace("Bearer", "")?.trim();
    let payload = verify(token!, process.env.SECRET_KEY!)!;
    if (!payload) {
      return res.json({
        success: true,
        errorMessage: "Invalid Token!",
        error: true,
      });
    }
    let user;
    if (typeof payload !== "string") {
      user = await userModel
        .findById(payload.sub)
        .select("-password -__v")
        .populate("posts liked_posts");
    }
    return res.status(200).json({
      user,
    });
  }
  static async update(req: Request, res: Response) {
    let token = req.headers["authorization"];
    let changedValue = req.headers["changed-value"];
    console.log(changedValue);
    if (!token) {
      return res.json({
        success: true,
        message: "Please Enter A Token",
      });
    }
    let payload = await verifyPayload(token);
    if (!payload) {
      return res.json({
        success: true,
        message: "There Is Error In Provided Token!",
      });
    }
    let user = await userModel.findById(payload.sub);
    if (!user) {
      return res.json({
        success: true,
        message: "Cannot Find User With The Provided Token",
      });
    }
    try {
      await userModel
        .findByIdAndUpdate(payload.sub, {
          [changedValue as string]: req.body[changedValue as string],
        })
        .then(() => {
          return res.status(201).json({
            success: true,
            message: "Updated Successfly!",
          });
        });
    } catch (error) {
      return res.status(500).json({
        success: true,
        message: "There Is Error While Updating The Model In Database!",
      });
    }
  }
}

export default Auth;
