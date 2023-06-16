import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import * as middlewares from "./middlewares";
import userRoutes from "./routes/user-routes";
import postRoutes from "./routes/post-routes";

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
