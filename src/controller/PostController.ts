import { NextFunction, Request, Response } from "express";
import Post from "../models/post";

class PostController {
  static async createPost(req: Request, res: Response, next: NextFunction) {
    const { title, body, authorId, likes } = req.body;
    const image = req.file;
    try {
      const newPost = new Post({
        title,
        body,
        image,
        likes,
        authorId,
      });

      const createPostResponse = await newPost.save();
      if (createPostResponse) {
        return res.send("Created").status(200);
      }
    } catch (error) {
      return res.send(error).status(500);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    const { pageSize, currentPage } = req.body;

    try {
      let total = await Post.count();
      Post.find({})
        .skip(currentPage * pageSize)
        .limit(pageSize)
        .then((data) => {
          return res
            .send({
              currentPage: currentPage,
              pageSize: pageSize,
              total: total,
              data: data,
            })
            .status(200);
        });
    } catch (error) {
      return res.send("Failed").status(500);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const uniquePost = await Post.findById({ _id: id });

      if (uniquePost) {
        return res.send(uniquePost).status(200);
      } else {
        return res.send([]).status(200);
      }
    } catch (error) {
      return res.send("Failed").status(500);
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
        return res.send("updated").status(200);
      }
    } catch (error) {
      return res.send("failed").status(500);
    }
  }
  static async deletePost(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const deletedPost = await Post.deleteOne({ _id: id });
      if (deletedPost) {
        return res.send("Deleted").status(200);
      }
    } catch (error) {
      return res.send("Failed").status(500);
    }
  }
}

export default PostController;
