import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { GlobalError } from "../utils/global-error";

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
      const res1 = await user.save();
      if (res1) {
        return res.send("Created").status(200);
      }
    } catch (error: any) {
      return next(new GlobalError(error as any));
    }
  }

  static async signin(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    try {
      User.findOne({ username: username }).then((userRes: any) => {
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
            return res
              .send({
                token,
                message: "Logged successfully",
              })
              .status(200);
          }
        });
      });
    } catch (error: any) {
      return next(new GlobalError(error as any));
    }
  }

  static async followUser(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { friendId } = req.body;

    try {
      const added = await User.findByIdAndUpdate(
        { _id: req.id },
        {
          $push: {
            following: {
              friendId,
            },
          },
        }
      );
      if (added) {
        //change followers for friendId
        await User.findByIdAndUpdate(
          { _id: friendId },
          {
            $push: {
              followers: {
                friendId: req.id,
              },
            },
          }
        );
        return res.send("added").status(200);
      }
    } catch (error) {
      return res.send(error).status(500);
    }
  }

  static async removeFriend(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    const { friendId } = req.body;

    try {
      const found = await User.updateOne(
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
        }
      );
      if (found) {
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
          }
        );
        return res.send("removed").status(200);
      }
    } catch (error) {
      return res.send("failed").status(500);
    }
  }
}

export default UserController;
