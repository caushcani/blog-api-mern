import Router from "express";
import CommentController from "../controller/CommentController";
import { isAuthenticated } from "../middlewares";

const router = Router();

router.put("/add", isAuthenticated, CommentController.addComment);
router.put("/edit", isAuthenticated, CommentController.editComment);

export default router;
