import { Schema, model } from "mongoose";

const user = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  likedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

export default model("User", user);
