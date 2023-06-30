import { verifyPayload } from "@/helpers/jwtHelper";
import postModel from "@/models/post.model";
import userModel from "@/models/user.model";
import { PostType, User } from "@/types/posts";
import { Request, Response } from "express";
import mongoose, { isValidObjectId } from "mongoose";

export interface createPostParams {
  authorization: string;
}

export default class Post {
  static async getAllPosts(res: Response) {
    return res.status(200).json({
      success: true,
      posts: await postModel.find(),
    });
  }
  static async createPost(req: Request<any, any, PostType>, res: Response) {
    let { author, image, title, likes, description } = req.body;
    let { authorization } = req.headers;

    if (!authorization) {
      return res.status(400).json({
        success: true,
        message: "Bad Request",
      });
    }
    if (!author || !image || !title) {
      return res.status(400).json({
        success: true,
        message: "Bad Request",
      });
    }
    let payload = await verifyPayload(authorization);
    let user = await userModel.findById(payload.sub).exec();
    let newPost = new postModel({ author, image, title, likes, description });
    if (user.posts) {
      user.posts.push(newPost);
    }
    try {
      await newPost
        .save()
        .then(() =>
          res
            .status(201)
            .json({ success: true, message: "Post Saved Successfully", user })
        );
      await user.save().then(() => console.log("User Saved Successfully"));
    } catch (err: any) {
      return res.status(500).json({
        success: true,
        error: true,
        errorMessage: `Error While Saving The Post: ${err.message!}`,
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
    let firstKey = Object.keys(req.body)[0] as string;
    await postModel
      .findByIdAndUpdate(id, {
        [firstKey]: req.body[firstKey],
      })
      .then(() => {
        return res.status(201).json({
          success: true,
          message: "Updated Successfully",
        });
      });
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
  static async getOne(req: Request, res: Response) {
    let { id } = req.query;
    if ((id as string).trim() == "" || !isValidObjectId(id)) {
      return res.status(400).json({
        success: true,
        message: "Bad Request",
      });
    }
    let post = await postModel
      .findById(id)
      .select("-__v -updatedAt")
      .populate("likes", "-__v -updatedAt -password");
    if (!post) {
      return res.status(404).json({
        success: true,
        message: `Cannot Find Post With ${id} Id`,
      });
    }
    return res.status(200).json({
      success: true,
      post,
    });
  }
  static async getByPage(req: Request, res: Response) {
    let page = req.query.page || 1;
    let limit = 6;
    let skip = ((page as number) - 1) * limit;
    let posts;
    posts = await postModel
      .find()
      .select("image title author likes description")
      .skip(skip)
      .limit(limit);

    if (!page) {
      return res.status(400).json({
        success: true,
        message: "Bad Request",
      });
    }
    return res.json({
      success: true,
      page: +page,
      posts,
    });
  }
  static async addLike(req: Request, res: Response) {
    let { postId } = req.body;
    if (!postId) {
      return res.status(400).json({
        success: true,
        message: "Bad Request",
      });
    }
    let token = req.headers["authorization"]!;
    let payload = await verifyPayload(token);

    try {
      await postModel
        .findByIdAndUpdate(
          postId,
          {
            $push: { likes: payload.sub },
          },
          {
            new: true,
          }
        )
        .then(() => {
          return res.json({
            success: true,
            message: "Add Like Successfully!",
          });
        });
    } catch (error) {
      res.json({
        success: true,
        message: `Error While Add Like /like endpoint: Error = ${error}`,
      });
    }
  }
  static async unLike(req: Request, res: Response) {
    let { postId } = req.body;
    let token = req.headers["authorization"] as string;
    let payload = await verifyPayload(token);

    try {
      await postModel.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: payload.sub },
        },
        {
          new: true,
        }
      );
    } catch (error) {
      res.json({
        success: true,
        message: `Error While Remove Like <code>/unlike</code> endpoint: Error = ${error}`,
      });
    }
  }
}
