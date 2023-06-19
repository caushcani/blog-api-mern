import { Router } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import UserController from "../controller/UserController";
import { isAuthenticated } from "../middlewares";

const router = Router();

//signin
router.post("/signin", UserController.signin);

//signup
router.post("/signup", UserController.signup);

//follow someone
router.post("/follow", isAuthenticated, UserController.followUser);

export default router;
