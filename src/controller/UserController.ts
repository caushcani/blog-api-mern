import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

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
      const found = await User.findOne({ username: username });
      if (found) {
        return res.send("Login").status(200);
      }
    } catch (error) {
      return res.send("Failed").status(500);
    }
  }
}

export default UserController;
