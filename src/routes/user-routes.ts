import { Router } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import UserController from "../controller/UserController";

const router = Router();

//signin
router.post("/signin", UserController.signin);

//signup
router.post("/signup", UserController.signup);

export default router;
