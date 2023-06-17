import { NextFunction, Request, Response } from "express";
import ErrorResponse from "./interfaces/ErrorResponse";
import jwt from "jsonwebtoken";
import User from "./models/user";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

const checkUsername = async (username: string) => {
  const found = await User.find({ username: username });
  if (!found) {
    return false;
  }
  return true;
};

export const isAuthenticated = async (
  req: Request | any,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const authHeader = req.get("authorization");

  if (authHeader === undefined) {
    return res.send({ message: "Unauthorized" }).status(401);
  } else {
    const token = authHeader.split(" ")[1];
    try {
      const decodedToken: any = jwt.verify(token, process.env.JWT_PRIVATE_KEY!);
      if (await checkUsername(decodedToken?.username)) {
        req.id = decodedToken.id;
        next();
      }
    } catch (error) {
      return res.send({ message: "Non valid token" }).status(400);
    }
  }
};
