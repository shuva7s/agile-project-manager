"use server";

import { Types } from "mongoose";
import { userInfo } from "./utility.actions";
import { connectToDatabase } from "../database/mongoose";
import User from "../database/models/user.model";
import Project from "../database/models/project.model";
import { revalidatePath } from "next/cache";
import { Sprint, Task } from "../database/models/sprint.model";
import { connect } from "http2";

export async function checkUserIsAdminAndReturnBackLogTasks(projectId: string) {
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
        message: "User credentials not found",
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
    const project = await Project.findById(projectId)
      .populate({
        path: "members._id",
      })
      .populate({
        path: "backlog",
        select: "name description priority status",
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

    if (isAdmin) {
      return {
        success: true,
        backlogTasks: JSON.parse(JSON.stringify(project.backlog)),
      };
    } else {
      return {
        success: false,
        message: "You don't have access to this page",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}

export async function createTask({
  projectId,
  taskName,
  taskDescription,
  weightage,
}: {
  projectId: string;
  taskName: string;
  taskDescription: string;
  weightage: number;
}) {
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
        message: "User credentials not found",
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

    const project = await Project.findById(projectId).populate("members._id");

    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }
    const isAdmin = project.members.some(
      (member: any) => member._id.equals(user._id) && member.role === "admin"
    );

    if (!isAdmin) {
      return {
        success: false,
        message: "You dont have access to create task",
      };
    }
    const newTask = await Task.create({
      name: taskName,
      description: taskDescription,
      priority: weightage,
    });

    if (!newTask) {
      return {
        success: false,
        message: "Task not created",
      };
    }

    project.backlog.push(newTask._id);
    await project.save();
    revalidatePath(`/project/${projectId}`);
    revalidatePath(`/project/${projectId}/backlog`);

    return {
      success: true,
      message: "Task created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function moveTaskToDesigning(projectId: string, taskId: string) {
  try {
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
      return {
        success: false,
        message: "Invalid project or task ID",
      };
    }

    await connectToDatabase();

    const project = await Project.findById(projectId);
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    // Step 1: Remove the task from the project's backlog
    // project.backlog = project.backlog.filter(
    //   (backlogTaskId: any) => !backlogTaskId.equals(taskId)
    // );

    // Step 2: Find the current sprint and add the task to its designing phase
    const currentSprint = await Sprint.findById(project.cureentSprint);
    if (!currentSprint) {
      return {
        success: false,
        message: "Current sprint not found",
      };
    }
    currentSprint.designing.push(task._id);

    // Step 3: Update the task's status to "des" (designing)
    task.status = "des";

    // Step 4: Save the updated documents
    await task.save();
    await currentSprint.save();
    await project.save();

    revalidatePath(`/project/${projectId}`);
    revalidatePath(`/project/${projectId}/backlog`);

    return {
      success: true,
      message: "Task pushed to designing successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function getMembersForTask(projectId: string, taskId: string) {
  try {
    await connectToDatabase();

    // Find the project and populate the user data for each member
    const project = await Project.findById(projectId).populate("members._id");
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    // Retrieve the task
    const task = await Task.findById(taskId);
    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    // Get all member IDs in the project
    const allMemberIds = project.members.map((member: any) => member._id._id);

    // Determine unassigned members based on task status
    let unassignedMemberIds: Types.ObjectId[] = [];
    if (task.status === "des") {
      unassignedMemberIds = allMemberIds.filter(
        (memberId: any) =>
          !task.assignedDesigners.some((designerId: any) =>
            designerId.equals(memberId)
          )
      );
    } else if (task.status === "dev") {
      unassignedMemberIds = allMemberIds.filter(
        (memberId: any) =>
          !task.assignedDevelopers.some((developerId: any) =>
            developerId.equals(memberId)
          )
      );
    } else if (task.status === "tes") {
      unassignedMemberIds = allMemberIds.filter(
        (memberId: any) =>
          !task.assignedTesters.some((testerId: any) =>
            testerId.equals(memberId)
          )
      );
    } else if (task.status === "dep") {
      unassignedMemberIds = allMemberIds.filter(
        (memberId: any) =>
          !task.assignedDeployers.some((deployerId: any) =>
            deployerId.equals(memberId)
          )
      );
    }

    // Retrieve unassigned members' user data directly using populate
    const populatedProject = await Project.findById(projectId).populate({
      path: "members._id",
      match: { _id: { $in: unassignedMemberIds } },
      select: "_id firstName lastName username email photo", // Specify fields to select
    });

    // Extract user data from populated project members
    const unassignedMembersData = populatedProject?.members
      .filter((member: any) => member._id) // Filter out any null results
      .map((member: any) => member._id); // Get the populated user data

    return {
      success: true,
      members: JSON.parse(JSON.stringify(unassignedMembersData)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
}

export async function addMembersToTask(
  projectId: string,
  taskId: string,
  memberIds: string[]
) {
  try {
    await connectToDatabase();

    const project = await Project.findById(projectId);
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    let fieldToUpdate: string | null = null;
    if (task.status === "des") {
      fieldToUpdate = "assignedDesigners";
    } else if (task.status === "dev") {
      fieldToUpdate = "assignedDevelopers";
    } else if (task.status === "tes") {
      fieldToUpdate = "assignedTesters";
    } else if (task.status === "dep") {
      fieldToUpdate = "assignedDeployers";
    }

    if (!fieldToUpdate) {
      return {
        success: false,
        message: "Invalid task status",
      };
    }

    memberIds.forEach((memberId) => {
      if (!task[fieldToUpdate].includes(memberId)) {
        task[fieldToUpdate].push(memberId);
      }
    });

    await task.save();

    return {
      success: true,
      message: "Members added successfully to the task",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
}
