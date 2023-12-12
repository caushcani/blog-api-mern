import { Router } from "express";
import PostController from "../controllers/PostController";
import { isAuthenticated } from "../middlewares";
import multer from "multer";
import validateRequest from "../middleware/validate-request";
import { postSchema } from "../validator-schema/validation_schema";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./my-uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//create post
router.post(
  "/create",
  isAuthenticated,
  validateRequest(postSchema),
  upload.single("image"),
  PostController.createPost
);

//read all
router.get("/get-all", isAuthenticated, PostController.getAll);

//read one by id
router.get("/post/:id", isAuthenticated, PostController.getById);

//edit post
router.put("/edit/:id", isAuthenticated, PostController.editPost);

//delete post
router.delete("/delete/:id", isAuthenticated, PostController.deletePost);

//user posts
router.get("/my-posts", isAuthenticated, PostController.getMyPosts);

export default router;
