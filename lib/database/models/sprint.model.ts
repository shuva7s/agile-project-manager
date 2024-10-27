import { Schema, model, models, Document, Types } from "mongoose";

const SprintSchema = new Schema({
  number: { type: Number, default: 1 },
  name: { type: String, default: "" },
  timeSpan: { type: Number, default: 14 },
  currentTime: { type: Number, default: 0 },
  hasStarted: { type: Boolean, default: false },
  hasEnded: { type: Boolean, default: false },

  requirements: [{ type: Types.ObjectId, ref: "Task", default: [] }],
  designing: [{ type: Types.ObjectId, ref: "Task", default: [] }],
  development: [{ type: Types.ObjectId, ref: "Task", default: [] }],
  testing: [{ type: Types.ObjectId, ref: "Task", default: [] }],
  deployment: [{ type: Types.ObjectId, ref: "Task", default: [] }],

  submissions: [{ type: Types.ObjectId, ref: "Task", default: [] }],

  completed: [{ type: Types.ObjectId, ref: "Task", default: [] }],
});

const Sprint = models?.Sprint || model("Sprint", SprintSchema);

export default Sprint;
