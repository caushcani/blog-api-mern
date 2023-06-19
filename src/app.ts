import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import * as middlewares from "./middlewares";
import userRoutes from "./routes/user-routes";
import postRoutes from "./routes/post-routes";
import commentRoutes from "./routes/comment-routes";

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comment", commentRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.use((error: any, req: any, res: any, next: any) => {
  console.log(error);
  // const status = error.statusCode || 500;
  // const message = error.message;
  // const data = error.data;
  res.status(500).json({
    message: "There was an error.",
  });
});

export default app;
