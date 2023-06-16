import { Router } from "express";
import PostController from "../controller/PostController";
import { isAuthenticated } from "../middlewares";

const router = Router();

//create post
router.post("/create", isAuthenticated, PostController.createPost);

//read all
router.get("/get-all", isAuthenticated, PostController.getAll);

//read one by id
router.get("/post/:id", isAuthenticated, PostController.getById);

//edit post
router.put("/edit/:id", isAuthenticated, PostController.editPost);

//delete post
router.delete("/delete/:id", isAuthenticated, PostController.deletePost);

export default router;
