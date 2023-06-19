import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt from "jsonwebtoken";
import Post from "../models/post";

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
    } catch (error) {
      return res.send("Failed").status(500);
    }
  }

  static async signin(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    try {
      User.findOne({ username: username }).then((userRes: any) => {
        bcrypt.compare(password, userRes?.password).then((passRes) => {
          const token = jwt.sign(
            { username, id: userRes._id },
            process.env.JWT_PRIVATE_KEY!,
            {
              expiresIn: "100d",
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
    } catch (error) {
      return res.send("Failed").status(500);
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
}

export default UserController;
