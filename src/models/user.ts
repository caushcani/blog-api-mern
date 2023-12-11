import { Schema, model } from "mongoose";
import IUser from "../interfaces/IUser";

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
  followers: {
    type: [
      {
        friendId: Schema.Types.ObjectId,
      },
    ],
  },
  following: {
    type: [
      {
        friendId: Schema.Types.ObjectId,
      },
    ],
  },
});

export default model<IUser>("User", user);
