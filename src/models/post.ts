import { Schema, model } from "mongoose";

const post = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  image: {
    type: Object,
  },
  likes: {
    type: Number,
  },
  comments: {
    type: [
      {
        body: String,
        by: Schema.Types.ObjectId,
      },
    ],
  },
});

export default model("Post", post);
