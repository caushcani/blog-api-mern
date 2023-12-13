import { NextFunction, Request, Response } from "express";
import Post from "../models/post";
import { GlobalError } from "../utils/global-error";
import mongoose from "mongoose";

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
        return res.status(200).send({
          message: "Comment added successfully.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
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
        return res.status(200).send({
          message: "Comment updated.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
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
        return res.status(200).send({
          message: "Comment deleted.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
    }
  }

  static async getCommentsForPost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { postId } = req.params;

    try {
      const allComments = await Post.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(postId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "comments.by",
            foreignField: "_id",
            as: "commentAuthor",
          },
        },
        {
          $project: {
            _id: 0,
            commentMessage: "$comments.body",
            commentedBy: "$commentAuthor.username",
          },
        },
        //$wind => separate each item in array in a different collection.
        {
          $unwind: "$commentMessage",
        },
      ]);

      if (allComments) {
        return res.status(200).send({
          message: allComments,
        });
      }
    } catch (error: unknown) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
    }
  }
}

export default CommentController;
