import { Schema, model, models, Document, Types } from "mongoose";

const ProjectSchema = new Schema({
  name: { type: String, default: "" },
  description: { type: String, default: "" },

  members: [
    {
      _id: { type: Types.ObjectId, ref: "User", required: true },
      role: { type: String, enum: ["admin", "member"], default: "member" },
    },
  ],

  joinRequests: [{ type: Types.ObjectId, ref: "User", default: [] }],

  backlog: [{ type: Types.ObjectId, ref: "Task", default: [] }],
  sprints: [{ type: Types.ObjectId, ref: "Sprint" }],
  cureentSprint: { type: Types.ObjectId, ref: "Sprint" },

  createdAt: { type: Date, default: Date.now },
});

const Project = models?.Project || model("Project", ProjectSchema);

export default Project;
