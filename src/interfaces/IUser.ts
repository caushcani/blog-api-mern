import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  username: string;
  password: string;
  email: string;
}

export default IUser;
