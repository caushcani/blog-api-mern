import { NextFunction, Request, Response } from "express";
import Post from "../models/post";
import { GlobalError } from "../utils/global-error";

class PostController {
  static async createPost(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { title, body, likes } = req.body;
    const image = req.file;
    try {
      const newPost = new Post({
        title,
        body,
        image,
        likes,
        authorId: req.id,
        dateCreated: new Date(),
      });

      const createPostResponse = await newPost.save();
      if (createPostResponse) {
        return res.status(200).send({
          message: "Post created.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    const { pageSize, currentPage } = req.body;

    try {
      let total = await Post.count();
      Post.find({})
        .populate("authorId", "username")
        .skip(currentPage * pageSize)
        .limit(pageSize)
        .then((data) => {
          return res.status(200).send({
            currentPage: currentPage,
            pageSize: pageSize,
            total: total,
            data: data,
          });
        });
    } catch (error: unknown) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const uniquePost = await Post.findById({ _id: id });
      return res.status(200).send(uniquePost);
    } catch (error: unknown) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
    }
  }

  static async editPost(req: Request, res: Response, next: NextFunction) {
    const { title, body, image, authorId, likes, comments } = req.body;
    const { id } = req.params;

    try {
      const originalPost = await Post.findByIdAndUpdate(id, {
        title,
        body,
        image,
        authorId,
        likes,
        comments,
      });
      if (originalPost) {
        return res.status(200).send({
          message: "Post edited",
        });
      }
    } catch (error: unknown) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
    }
  }
  static async deletePost(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    const authorId = req.id;

    try {
      //check if post exists and user doing the request is the author.
      const foundPost = await Post.find({
        _id: id,
        authorId: authorId,
      });

      // if post exits, delete it
      if (foundPost.length > 0) {
        const deletedPost = await Post.findOneAndDelete({
          _id: id,
        });
        if (deletedPost !== null) {
          return res.status(200).send({
            message: "Post deleted.",
          });
        }
      } else {
        return res.status(400).send({
          message: "Post not found.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
    }
  }

  static async getMyPosts(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.id;

    try {
      const allPosts = await Post.find({
        authorId: userId,
      });
      if (allPosts) {
        return res.status(200).send({
          posts: allPosts,
        });
      }
    } catch (error) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
    }
  }
}

export default PostController;
