import postModel from "@/models/post.model";
import { PostType, User } from "@/types/posts";
import { Request, Response } from "express";
import mongoose from "mongoose";

export default class Post {
  static async getAllPosts(res: Response) {
    return res.status(200).json({
      success: true,
      posts: await postModel.find(),
    });
  }
  static async createPost(req: Request<any, any, PostType>, res: Response) {
    let { author, image, title, likes } = req.body;

    if (!author || !image || !title || !likes) {
      return res.status(400).json({
        success: true,
        message: "Bad Request",
      });
    }
    let newPost = new postModel({ author, image, title, likes });
    try {
      await newPost
        .save()
        .then(() =>
          res
            .status(201)
            .json({ success: true, message: "Post Saved Successfully" })
        );
    } catch (err) {
      return res.status(500).json({
        success: true,
        error: true,
        errorMessage: "Error While SAving The Post",
      });
    }
  }
  static async updatePost(req: Request, res: Response) {
    let id = req.query.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: true,
        message: "Bad Request",
      });
    }
    let post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({
        success: true,
        message: "Cannot Find Post With This Id",
      });
    }
    if (!req.body[Object.keys(req.body)[0]]) {
      return res.status(400).json({
        success: true,
        message: "Please Fillout The Inputs",
      });
    }
    try {
      await postModel.findByIdAndUpdate(id, { ...req.body }).then(() => {
        return res.status(201).json({
          success: true,
          message: "Updated Successfully",
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: true,
        message: "Error While Saving The Updated Post!",
      });
    }
  }
  static async deletePost(req: Request, res: Response) {
    let id = req.query.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: true,
        message: "Bad Request",
      });
    }
    let post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({
        success: true,
        message: "Cannot Find Post With This Id",
      });
    }
    try {
      await postModel.findByIdAndDelete(id, { ...req.body }).then(() => {
        return res.status(201).json({
          success: true,
          message: "Deleted Successfully",
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: true,
        message: "Error While Deleting Post!",
      });
    }
  }
}
