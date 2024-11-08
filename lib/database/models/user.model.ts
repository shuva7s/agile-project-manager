import { Schema, model, models, Document, Types } from "mongoose";

export interface IUser {
  _id: string;
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName: string;
  lastName: string;
  projects: [
    {
      _id: string;
      tasks: string[];
    }
  ];
  createdAt: Date;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  photo: { type: String, required: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },

  projects: [
    {
      _id: { type: Types.ObjectId, ref: "Project", required: true },
      tasks: [{ type: Types.ObjectId, ref: "Task", default: [] }],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const User = models?.User || model("User", UserSchema);

export default User;
