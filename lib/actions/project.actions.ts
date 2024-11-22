"use server";

import { revalidatePath } from "next/cache";
import Project from "../database/models/project.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { userInfo } from "./utility.actions";
import mongoose, { Types } from "mongoose";
import { Sprint, Task } from "../database/models/sprint.model";
export async function createProject({
  projectName,
  projectDescription,
}: {
  projectName: string;
  projectDescription: string;
}) {
  try {
    await connectToDatabase();
    const newSprint = await Sprint.create({ name: "Sprint 1" });

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
      currentSprint: newSprint._id,
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

    user.projects.push({
      _id: newProject._id,
      tasks: [],
    });

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

export async function updateProject({
  projectId,
  projectName,
  projectDescription,
}: {
  projectId: string;
  projectName: string;
  projectDescription: string;
}) {
  try {
    await connectToDatabase();

    // Find the project by ID
    const existingProject = await Project.findById(projectId);
    if (!existingProject) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    // Update the project details
    existingProject.name = projectName;
    existingProject.description = projectDescription;

    // Save the updated project
    await existingProject.save();

    // Revalidate the path if required
    revalidatePath("/");
    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      message: "Project updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export const deleteProject = async (projectId: string) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return {
      success: false,
      message: "Invalid project ID",
    };
  }

  try {
    // Step 1: Find the project to ensure it exists
    const project = await Project.findById(projectId);
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    // Step 2: Delete all sprints associated with the project
    await Sprint.deleteMany({ _id: { $in: project.sprints } });

    // Step 3: Delete all tasks in the project's backlog
    await Task.deleteMany({ _id: { $in: project.backlog } });

    // Step 4: Remove the project's ID and associated tasks from all users' `projects` array
    await User.updateMany(
      { "projects._id": projectId },
      {
        $pull: {
          projects: { _id: projectId }, // Remove the specific project object
        },
      }
    );

    // Step 5: Delete the project itself
    await Project.findByIdAndDelete(projectId);

    return {
      success: true,
      message: "Project and all associated data deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return {
      success: false,
      message: error.message || "An error occurred while deleting the project",
    };
  }
};

// export async function getProjects(getHosted = false) {
//   try {
//     await connectToDatabase();

//     const { userName, userId, userMail } = await userInfo();

//     if (!userName || !userId || !userMail) {
//       return {
//         success: false,
//         message: "User credentials not found",
//       };
//     }

//     const user = await User.findOne({
//       clerkId: userId,
//       email: userMail,
//       username: userName,
//     }).populate({
//       path: "projects._id",
//       select: "name description members joinRequests createdAt",
//     });

//     if (!user) {
//       return {
//         success: false,
//         message: "User not found",
//       };
//     }

//     const projects = user.projects
//       .filter((project: any) => {
//         const projectData = project._id;
//         if (!projectData) return false;

//         // Find the user's role in each project's members array
//         const userRole = projectData.members.find((member: any) =>
//           member._id.equals(user._id)
//         )?.role;

//         // Filter based on role (admin if getHosted is true, otherwise non-admin)
//         return getHosted ? userRole === "admin" : userRole !== "admin";
//       })
//       .map((project: any) => ({
//         _id: project._id._id,
//         name: project._id.name,
//         description: project._id.description,
//         memberCount: project._id.members?.length || 0,
//         joinRequestCount: project._id.joinRequests?.length || 0,
//       }));

//     return {
//       success: true,
//       projects,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message,
//     };
//   }
// }

export async function getProjects(getHosted = false) {
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
      path: "projects._id",
      populate: [
        {
          path: "currentSprint",
          select: "hasStarted",
        },
        {
          path: "backlog",
          select: "status",
        },
      ],
      select:
        "name description members joinRequests createdAt currentSprint backlog",
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const projects = user.projects
      .filter((project: any) => {
        const projectData = project._id;
        if (!projectData) return false;

        // Find the user's role in each project's members array
        const userRole = projectData.members.find((member: any) =>
          member._id.equals(user._id)
        )?.role;

        // Filter based on role (admin if getHosted is true, otherwise non-admin)
        return getHosted ? userRole === "admin" : userRole !== "admin";
      })
      .map((project: any) => {
        // Calculate hasStarted, totalTasks, and completedTasks
        const hasStarted = project._id.currentSprint?.hasStarted || false;
        const totalTasks = project._id.backlog?.length || 0;
        const completedTasks =
          project._id.backlog?.filter((task: any) => task.status === "com")
            .length || 0;

        return {
          _id: project._id._id,
          name: project._id.name,
          description: project._id.description,
          memberCount: project._id.members?.length || 0,
          joinRequestCount: project._id.joinRequests?.length || 0,
          hasStarted,
          totalTasks,
          completedTasks,
        };
      });

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

export async function checkUserAccessAndReturnProjectData(projectId: string) {
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

    const project = await Project.findById(
      projectId,
      "name description members joinRequests _id backlog createdAt currentSprint"
    );

    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    const member = project.members.find((member: any) =>
      member._id.equals(user._id)
    );
    const isMember = Boolean(member);
    const isAdmin = isMember && member.role === "admin";

    const hasRequestedJoin = project.joinRequests.some((req: any) =>
      req.equals(user._id)
    );
    const canSendJoinReq = !isMember && !hasRequestedJoin;

    // Calculate submission count if there's an active sprint
    let submissionCount = 0;
    if (project.currentSprint) {
      const currentSprint = await Sprint.findById(project.currentSprint).select(
        "submissions"
      );
      if (currentSprint && currentSprint.submissions) {
        submissionCount = currentSprint.submissions.length;
      }
    }

    if (isMember) {
      let projectData = {
        _id: project._id,
        name: project.name,
        description: project.description,
        memberCount: project.members.length,
        joinRequestCount: project.joinRequests.length,
        backlogTaskCount: project.backlog.length,
        submissionCount,
      };

      return {
        success: true,
        project: projectData,
        isAdmin,
        isMember,
        canSendJoinReq,
      };
    } else {
      let projectData = {
        _id: project._id,
        name: project.name,
        description: project.description,
      };
      return {
        success: true,
        project: projectData,
        canSendJoinReq,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function addJoinRequest(projectId: string) {
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

    const project = await Project.findById(projectId);

    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }
    //before pushing join request check if the user has already requested to join the project

    if (project.joinRequests.includes(user._id)) {
      return {
        success: false,
        message: "You have already requested to join this project",
      };
    }
    project.joinRequests.push(user._id);
    await project.save();
    revalidatePath(`/project/${projectId}`);
    return {
      success: true,
      message: "Join request sent successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function checkUserIsAdminAndReturnJoinRequests(projectId: string) {
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

    const project = await Project.findById(projectId).populate({
      path: "joinRequests",
      select: "clerkId email username photo firstName lastName",
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
        joinRequests: JSON.parse(JSON.stringify(project.joinRequests)),
      };
    } else {
      return {
        success: false,
        message: "You don't have access to this content",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function acceptOrRejectJoinRequest(
  projectId: string,
  type: "accept" | "reject",
  requestUserId: string
) {
  try {
    if (
      !Types.ObjectId.isValid(projectId) ||
      !Types.ObjectId.isValid(requestUserId)
    ) {
      return {
        success: false,
        message: "Invalid project or user ID",
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

    if (type === "accept") {
      const requestUser = await User.findById(requestUserId);
      if (!requestUser) {
        return {
          success: false,
          message: "User not found",
        };
      }

      project.members.push({
        _id: requestUser._id,
        role: "member",
      });
      requestUser.projects.push({
        _id: project._id,
        tasks: [],
      });

      project.joinRequests = project.joinRequests.filter(
        (reqId: any) => !reqId.equals(requestUserId)
      );

      await project.save();
      await requestUser.save();
    } else {
      project.joinRequests = project.joinRequests.filter(
        (reqId: any) => !reqId.equals(requestUserId)
      );
      await project.save();
    }
    revalidatePath(`/`);
    revalidatePath(`/project/${projectId}`);
    revalidatePath(`/project/${projectId}/join-requests`);
    revalidatePath(`/project/${projectId}/members`);

    return {
      success: true,
      message: type === "accept" ? "Request accepted" : "Request rejected",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}

export async function checkUserIsAdminAndReturnMembers(projectId: string) {
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

    const project = await Project.findById(projectId).populate({
      path: "members._id",
      select: "clerkId email username photo firstName lastName",
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

    const membersData = project.members.map((member: any) => ({
      ...member._id._doc,
      role: member.role,
    }));

    return {
      success: true,
      members: JSON.parse(JSON.stringify(membersData)),
      isAdmin,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}

// export async function removeMemberFromProject(
//   projectId: string,
//   memberIdToRemove: string
// ) {
//   try {
//     if (
//       !Types.ObjectId.isValid(projectId) ||
//       !Types.ObjectId.isValid(memberIdToRemove)
//     ) {
//       return {
//         success: false,
//         message: "Invalid project or user ID",
//       };
//     }

//     await connectToDatabase();

//     // Find the user to remove
//     const user = await User.findById(memberIdToRemove);
//     if (!user) {
//       return {
//         success: false,
//         message: "User not found",
//       };
//     }

//     // Check if the project exists in the user's project list
//     const userProject = user.projects.find(
//       (project: any) => project._id.toString() === projectId
//     );

//     if (!userProject) {
//       return {
//         success: false,
//         message: "User is not a member of this project",
//       };
//     }
//     // Find the project
//     const project = await Project.findById(projectId);
//     if (!project) {
//       return {
//         success: false,
//         message: "Project not found",
//       };
//     }

//     const taskIds = userProject.tasks;

//     if (taskIds.length === 0) {
//       return {
//         success: false,
//         message: "User has no tasks to remove",
//       };
//     }
//     for (const taskId of taskIds) {
//       const memberIdObject = new Types.ObjectId(memberIdToRemove);

//       const task = await Task.findById(taskId);
//       if (task) {
//         if (task.status === "des") {
//           task.assignedDesigners = task.assignedDesigners.filter(
//             (id: any) => !id.equals(memberIdToRemove)
//           );
//         } else if (task.status === "dev") {
//           task.assignedDevelopers = task.assignedDevelopers.filter(
//             (id: any) => !id.equals(memberIdToRemove)
//           );
//         } else if (task.status === "tes") {
//           task.assignedTesters = task.assignedTesters.filter(
//             (id: any) => !id.equals(memberIdToRemove)
//           );
//         } else if (task.status === "dep") {
//           task.assignedDeployers = task.assignedDeployers.filter(
//             (id: any) => !id.equals(memberIdToRemove)
//           );
//         }
//         await task.save();
//       }
//     }

//     project.members = project.members.filter(
//       (member: any) => !member._id.equals(memberIdToRemove)
//     );
//     user.projects = user.projects.filter(
//       (projectEntry: any) => !projectEntry._id.equals(projectId)
//     );

//     await project.save();
//     await user.save();
//     revalidatePath(`/`);
//     revalidatePath(`/project/${projectId}`);
//     revalidatePath(`/project/${projectId}/members`);

//     return {
//       success: true,
//       message: "Member successfully removed from project and tasks",
//     };
//   } catch (error: any) {
//     console.error("Error removing member from project:", error);
//     return {
//       success: false,
//       message: error.message || "An unexpected error occurred",
//     };
//   }
// }

export async function removeMemberFromProject(
  projectId: string,
  memberIdToRemove: string
) {
  try {
    if (
      !Types.ObjectId.isValid(projectId) ||
      !Types.ObjectId.isValid(memberIdToRemove)
    ) {
      return {
        success: false,
        message: "Invalid project or user ID",
      };
    }

    await connectToDatabase();

    // Find the user to remove
    const user = await User.findById(memberIdToRemove);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Check if the project exists in the user's project list
    const userProject = user.projects.find(
      (project: any) => project._id.toString() === projectId
    );

    if (!userProject) {
      return {
        success: false,
        message: "User is not a member of this project",
      };
    }

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    const taskIds = userProject.tasks;

    if (taskIds.length === 0) {
      return {
        success: false,
        message: "User has no tasks to remove",
      };
    }

    // Fetch all tasks associated with the user's tasks in one query
    const tasks = await Task.find({ _id: { $in: taskIds } });

    tasks.forEach((task) => {
      if (task.status === "des") {
        task.assignedDesigners = task.assignedDesigners.filter(
          (id: any) => !id.equals(memberIdToRemove)
        );
      } else if (task.status === "dev") {
        task.assignedDevelopers = task.assignedDevelopers.filter(
          (id: any) => !id.equals(memberIdToRemove)
        );
      } else if (task.status === "tes") {
        task.assignedTesters = task.assignedTesters.filter(
          (id: any) => !id.equals(memberIdToRemove)
        );
      } else if (task.status === "dep") {
        task.assignedDeployers = task.assignedDeployers.filter(
          (id: any) => !id.equals(memberIdToRemove)
        );
      }
    });

    // Save all tasks in parallel
    await Promise.all(tasks.map((task) => task.save()));

    // Remove user from project members and project from user's projects
    project.members = project.members.filter(
      (member: any) => !member._id.equals(memberIdToRemove)
    );
    user.projects = user.projects.filter(
      (projectEntry: any) => !projectEntry._id.equals(projectId)
    );

    // Save the updated project and user
    await project.save();
    await user.save();

    // Revalidate paths to reflect updates
    revalidatePath(`/`);
    revalidatePath(`/project/${projectId}`);
    revalidatePath(`/project/${projectId}/members`);

    return {
      success: true,
      message: "Member successfully removed from project and tasks",
    };
  } catch (error: any) {
    console.error("Error removing member from project:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}

export async function checkUserIsAdmin(projectId: string) {
  try {
    if (!Types.ObjectId.isValid(projectId)) {
      return {
        isUserProjectAdmin: false,
        message: "Invalid project ID",
      };
    }
    const { userName, userId, userMail } = await userInfo();

    if (!userName || !userId || !userMail) {
      return {
        isUserProjectAdmin: false,
        message: "User credentials not found",
      };
    }

    await connectToDatabase(); // Ensure the database connection is established

    const user = await User.findOne({
      clerkId: userId,
      email: userMail,
      username: userName,
    });

    if (!user) {
      return {
        isUserProjectAdmin: false,
        message: "User not found",
      };
    }

    // Find the project and check if the current user is an admin
    const project = await Project.findById(projectId);
    if (!project) {
      return {
        isUserProjectAdmin: false,
        message: "Project not found",
      };
    }

    const isAdmin = project.members.some(
      (member: any) => member._id.equals(user._id) && member.role === "admin"
    );

    if (!isAdmin) {
      return {
        isUserProjectAdmin: false,
        message: "You are not an admin of this project",
      };
    }

    return {
      isUserProjectAdmin: true,
      name: project.name,
      description: project.description,
      message: "You are an admin of this project",
    };
  } catch (error: any) {
    return {
      isUserProjectAdmin: false,
      message: error.message || "An error occurred while checking admin status",
    };
  }
}
