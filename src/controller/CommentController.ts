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
      const foundPost = Post.findByIdAndUpdate(postId, {
        $push: {
          comments: {
            body: body,
            by: req.id,
          },
        },
      });
      if (await foundPost) {
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
}

export default CommentController;
