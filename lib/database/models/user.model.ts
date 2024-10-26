import { Schema, model, models, Document, Types } from "mongoose";

export interface IUser {
  _id: string;
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  photo: { type: String, required: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },

  projects: [{ type: Types.ObjectId, ref: "Project" }],
});

const User = models?.User || model("User", UserSchema);

export default User;
