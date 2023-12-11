import { NextFunction, Request, Response } from "express";
import Post from "../models/post";

class CommentController {
  static async addComment(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { postId, body } = req.body;

    try {
      const foundPost = await Post.findByIdAndUpdate(
        { _id: postId },
        {
          $push: {
            comments: {
              body: body,
              by: req.id,
            },
          },
        }
      );
      if (foundPost) {
        return res.send("new comment added").status(200);
      }
    } catch (error) {
      return res.send(error).status(500);
    }
  }

  static async editComment(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { commentId, postId, body } = req.body;

    try {
      const updated = await Post.findOneAndUpdate(
        {
          _id: postId,
          "comments._id": commentId,
        },
        {
          $set: {
            "comments.$.body": body,
            "comments.$.by": req.id,
          },
        },
        {
          new: true,
        }
      );
      if (updated) {
        return res.send("edited").status(200);
      }
    } catch (error) {
      return res.send(error).status(500);
    }
  }

  static async deleteComment(req: Request, res: Response, next: NextFunction) {
    const { postId, commentId } = req.params;

    try {
      const postDeleted = await Post.updateOne(
        {
          _id: postId,
          "comments._id": commentId,
        },
        {
          $pull: {
            comments: {
              _id: commentId,
            },
          },
        }
      );
      if (postDeleted) {
        return res.send("deleted").status(200);
      }
    } catch (error) {
      return res.send(error).status(500);
    }
  }
}

export default CommentController;
