import { model } from "mongoose";
import { models, Schema } from "mongoose";

const TaskSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: Number, default: 1, min: 1, max: 10 },

  assignedDesigners: [
    { type: Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  assignedDevelopers: [
    { type: Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  assignedTesters: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  assignedDeployers: [
    { type: Schema.Types.ObjectId, ref: "User", default: [] },
  ],

  isDone: { type: Boolean, default: false },
  errorNote: { type: String, default: "" },
  status: {
    type: String,
    enum: ["ns", "des", "dev", "tes", "dep", "com"],
    default: "ns",
  },
});

const Task = models?.Task || model("Task", TaskSchema);

export default Task;
