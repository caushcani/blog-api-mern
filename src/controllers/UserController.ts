import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { GlobalError } from "../utils/global-error";
import IUser from "../interfaces/IUser";
import mongoose from "mongoose";

class UserController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    const { username, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: username,
      password: hashedPassword,
      email: email,
    });

    try {
      const userCreated = await user.save();
      if (userCreated) {
        return res.status(200).send({
          message: "User registered.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
    }
  }

  static async signin(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    try {
      User.findOne({ username: username }).then((userRes: IUser | null) => {
        if (userRes === null) {
          return next(new GlobalError("Invalid username or password", 400));
        }
        bcrypt.compare(password, userRes?.password).then((passRes) => {
          const token = jwt.sign(
            { username, id: userRes._id },
            process.env.JWT_PRIVATE_KEY!,
            {
              expiresIn: process.env.JWT_EXPIRE!,
            }
          );
          if (passRes) {
            return res.status(200).send({
              message: "Logged successfully",
              token,
            });
          }
        });
      });
    } catch (error: unknown) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
    }
  }

  static async followUser(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { friendId } = req.body;

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        await User.findByIdAndUpdate(
          { _id: req.id },
          {
            $push: {
              following: {
                friendId,
              },
            },
          },
          { session }
        );
        //change followers for friendId
        await User.findByIdAndUpdate(
          { _id: friendId },
          {
            $push: {
              followers: {
                friendId: req.id,
              },
            },
          },
          { session }
        );
      });
      await session.commitTransaction();
      return res.status(200).send({
        message: "You are now friends.",
      });
    } catch (error: unknown) {
      await session.abortTransaction();
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
    } finally {
      session.endSession();
    }
  }

  static async removeFriend(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { friendId } = req.body;
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        await User.updateOne(
          {
            _id: req.id,
            "following.friendId": friendId,
          },
          {
            $pull: {
              following: {
                friendId: friendId,
              },
            },
          },
          { session }
        );
      });

      await User.updateOne(
        {
          _id: friendId,
        },
        {
          $pull: {
            followers: {
              friendId: req.id,
            },
          },
        },
        { session }
      );

      await session.commitTransaction();
      return res.status(200).send({
        message: "Removed friends.",
      });
    } catch (error: unknown) {
      await session.abortTransaction();
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message, 500));
      }
    } finally {
      await session.endSession();
    }
  }

  static async getFollowingList(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const username = req.username;
    try {
      const allFollowing = await User.aggregate([
        {
          $match: {
            username: username,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following.friendId",
            foreignField: "_id",
            as: "followingDetails",
          },
        },
        {
          $unwind: "$followingDetails",
        },
        {
          $project: {
            _id: 0,
            name: "$followingDetails.username",
            followingId: "$followingDetails._id",
          },
        },
      ]);
      return res.status(200).send({
        allFollowing,
      });
    } catch (error) {
      if (error instanceof GlobalError) {
        return next(new GlobalError(error.message));
      }
    }
  }
}

export default UserController;
