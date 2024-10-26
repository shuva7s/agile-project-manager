import { Schema } from "mongoose";

const TaskSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: Number, required: true },

  assignedDesigners: [{ type: Schema.Types.ObjectId, ref: "User" }],
  assignedDevelopers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  assignedTesters: [{ type: Schema.Types.ObjectId, ref: "User" }],
  assignedDeployers: [{ type: Schema.Types.ObjectId, ref: "User" }],

  isDone: { type: Boolean, default: false },
  errorNote: { type: String, default: "" },
  status: {
    type: String,
    enum: ["ns", "des", "dev", "tes", "dep", "com"],
    default: "ns",
  },
});
