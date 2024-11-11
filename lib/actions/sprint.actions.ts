"use server";

import { Types } from "mongoose";
import { userInfo } from "./utility.actions";
import { connectToDatabase } from "../database/mongoose";
import User from "../database/models/user.model";
import Project from "../database/models/project.model";
import { Sprint } from "../database/models/sprint.model";

// export async function checkUserIsAdminAndReturnCurrentSprintData(
//   projectId: string
// ) {
//   try {
//     if (!Types.ObjectId.isValid(projectId)) {
//       return {
//         success: false,
//         message: "Project not found",
//       };
//     }

//     const { userName, userId, userMail } = await userInfo();

//     if (!userName || !userId || !userMail) {
//       return {
//         success: false,
//         message: "User not found",
//       };
//     }

//     await connectToDatabase();

//     const user = await User.findOne({
//       clerkId: userId,
//       email: userMail,
//       username: userName,
//     });

//     if (!user) {
//       return {
//         success: false,
//         message: "User not found",
//       };
//     }

//     const project = await Project.findById(projectId).populate({
//       path: "members._id",
//     });

//     if (!project) {
//       return {
//         success: false,
//         message: "Project not found",
//       };
//     }

//     const isAdmin = project.members.some(
//       (member: any) => member._id.equals(user._id) && member.role === "admin"
//     );

//     if (!project.currentSprint) {
//       return {
//         success: false,
//         message: "No current sprint available",
//       };
//     }
//     const currentSprint = await Sprint.findById(project.currentSprint)
//       .populate({
//         path: "requirements designing development testing deployment completed",
//         model: "Task",
//       })
//       .select("-__v -submissions")
//       .exec();
//     if (!currentSprint) {
//       return {
//         success: false,
//         message: "Current sprint data not found",
//       };
//     }
//     return {
//       success: true,
//       isAdmin,
//       currentSprintData: JSON.parse(JSON.stringify(currentSprint)),
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

export async function checkUserIsAdminAndReturnCurrentSprintData(
  projectId: string
) {
  try {
    if (!Types.ObjectId.isValid(projectId)) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    const { userName, userId, userMail } = await userInfo();

    if (!userName || !userId || !userMail) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await connectToDatabase();

    const user = await User.findOne({
      clerkId: userId,
      email: userMail,
      username: userName,
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const project = await Project.findById(projectId).populate({
      path: "members._id",
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    const isAdmin = project.members.some(
      (member: any) => member._id.equals(user._id) && member.role === "admin"
    );

    if (!project.currentSprint) {
      return {
        success: false,
        message: "No current sprint available",
      };
    }

    const currentSprint = await Sprint.findById(project.currentSprint)
      .populate({
        path: "requirements designing development testing deployment completed",
        populate: [
          {
            path: "assignedDesigners", // Populate assigned designers
            select: "_id photo username", // Select specific fields
          },
          {
            path: "assignedDevelopers", // Populate assigned developers
            select: "_id photo username", // Select specific fields
          },
          {
            path: "assignedTesters", // Populate assigned testers
            select: "_id photo username", // Select specific fields
          },
          {
            path: "assignedDeployers", // Populate assigned deployers
            select: "_id photo username", // Select specific fields
          },
        ],
        model: "Task",
      })
      .select("-__v -submissions")
      .exec();

    if (!currentSprint) {
      return {
        success: false,
        message: "Current sprint data not found",
      };
    }
    return {
      success: true,
      isAdmin,
      currentSprintData: JSON.parse(JSON.stringify(currentSprint)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
