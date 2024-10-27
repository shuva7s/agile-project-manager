"use server";

import { revalidatePath } from "next/cache";
import Project from "../database/models/project.model";
import Sprint from "../database/models/sprint.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { userInfo } from "./utility.actions";

export async function createProject({
  projectName,
  projectDescription,
}: {
  projectName: string;
  projectDescription: string;
}) {
  try {
    await connectToDatabase();
    const newSprint = await Sprint.create({});

    if (!newSprint) {
      return {
        success: false,
        message: "Sprint not created",
      };
    }

    const newProject = await Project.create({
      name: projectName,
      description: projectDescription,
      sprints: [newSprint._id],
      cureentSprint: newSprint._id,
    });

    if (!newProject) {
      await Sprint.findByIdAndDelete(newSprint._id);
      return {
        success: false,
        message: "Project not created",
      };
    }

    const { userName, userId, userMail } = await userInfo();

    if (!userName || !userId || !userMail) {
      await Project.findByIdAndDelete(newProject._id);
      await Sprint.findByIdAndDelete(newSprint._id);
      return {
        success: false,
        message: "User credentials not found",
      };
    }

    const user = await User.findOne({
      clerkId: userId,
      email: userMail,
      username: userName,
    });

    if (!user) {
      await Project.findByIdAndDelete(newProject._id);
      await Sprint.findByIdAndDelete(newSprint._id);
      return {
        success: false,
        message: "User not found",
      };
    }

    newProject.members.push({
      _id: user._id,
      role: "admin",
    });

    user.hosted_projects.push(newProject._id);

    await newSprint.save();
    await newProject.save();
    await user.save();

    revalidatePath("/");
    
    return {
      success: true,
      message: "Project created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateProject({}) {}

export async function deleteProject({}) {}

export async function getProjects(getHosted = true) {
  try {
    await connectToDatabase();

    const { userName, userId, userMail } = await userInfo();

    if (!userName || !userId || !userMail) {
      return {
        success: false,
        message: "User credentials not found",
      };
    }

    const user = await User.findOne({
      clerkId: userId,
      email: userMail,
      username: userName,
    }).populate({
      path: getHosted ? "hosted_projects" : "joined_projects",
      select: "name description members joinRequests createdAt",
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const projects = (
      getHosted ? user.hosted_projects : user.joined_projects
    ).map((project: any) => ({
      name: project.name,
      description: project.description,
      memberCount: project.members?.length || 0,
      joinRequestCount: project.joinRequests?.length || 0,
    }));

    return {
      success: true,
      projects,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
