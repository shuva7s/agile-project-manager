import { Schema, model, models, Document, Types } from "mongoose";

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

  members: [{ type: Types.ObjectId, ref: "User" }],
  joinRequests: [{ type: Types.ObjectId, ref: "User" }],

  backlog: [{ type: Types.ObjectId, ref: "Task" }],
  sprints: [{ type: Types.ObjectId, ref: "Sprint" }],
  cureentSprint: { type: Types.ObjectId, ref: "Sprint" },
  
  createdAt: { type: Date, default: Date.now },
});

const Project = models?.Project || model("Project", ProjectSchema);

export default Project;
