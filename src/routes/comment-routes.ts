import Router from "express";
import CommentController from "../controller/CommentController";
import { isAuthenticated } from "../middlewares";

const router = Router();

router.put("/add", isAuthenticated, CommentController.addComment);
router.put("/edit", isAuthenticated, CommentController.editComment);
router.delete(
  "/delete/:postId/:commentId",
  isAuthenticated,
  CommentController.deleteComment
);

export default router;
