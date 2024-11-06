import { Schema, model, models, Document, Types } from "mongoose";

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

const SprintSchema = new Schema({
  number: { type: Number, default: 1 },
  name: { type: String, default: "" },
  timeSpan: { type: Number, default: 14 },
  currentTime: { type: Number, default: 0 },
  hasStarted: { type: Boolean, default: false },
  hasEnded: { type: Boolean, default: false },

  requirements: [{ type: Types.ObjectId, ref: "Task" }],
  designing: [{ type: Types.ObjectId, ref: "Task" }],
  development: [{ type: Types.ObjectId, ref: "Task" }],
  testing: [{ type: Types.ObjectId, ref: "Task" }],
  deployment: [{ type: Types.ObjectId, ref: "Task" }],
  submissions: [{ type: Types.ObjectId, ref: "Task" }],
  completed: [{ type: Types.ObjectId, ref: "Task" }],
});

const Sprint = models?.Sprint || model("Sprint", SprintSchema);

export { Task, Sprint };
