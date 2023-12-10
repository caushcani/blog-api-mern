import { Router } from "express";
import UserController from "../controller/UserController";
import { isAuthenticated } from "../middlewares";
import validateRequest from "../middleware/validate-request";
import {
  loginSchema,
  signupSchema,
} from "../validator-schema/validation_schema";

const router = Router();

//signin
router.post("/signin", validateRequest(loginSchema), UserController.signin);

//signup
router.post("/signup", validateRequest(signupSchema), UserController.signup);

//follow someone
router.post("/follow", isAuthenticated, UserController.followUser);

//unfollow
router.post("/unfollow", isAuthenticated, UserController.removeFriend);

export default router;
