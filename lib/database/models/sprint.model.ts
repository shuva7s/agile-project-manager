import { Schema, model, models, Document, Types } from "mongoose";

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
  completed: [{ type: Types.ObjectId, ref: "Task" }],
});

const Sprint = models?.Project || model("Sprint", SprintSchema);

export default Sprint;
