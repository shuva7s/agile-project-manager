"use server";

import { Types } from "mongoose";
import { userInfo } from "./utility.actions";
import { connectToDatabase } from "../database/mongoose";
import User from "../database/models/user.model";
import Project from "../database/models/project.model";
import { revalidatePath } from "next/cache";
import { Sprint, Task } from "../database/models/sprint.model";

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

// export async function moveTaskToDesigning(projectId: string, taskId: string) {
//   try {
//     if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
//       return {
//         success: false,
//         message: "Invalid project or task ID",
//       };
//     }

//     await connectToDatabase();

//     const project = await Project.findById(projectId);
//     if (!project) {
//       return {
//         success: false,
//         message: "Project not found",
//       };
//     }

//     const task = await Task.findById(taskId);
//     if (!task) {
//       return {
//         success: false,
//         message: "Task not found",
//       };
//     }

//     // Step 2: Find the current sprint and add the task to its designing phase
//     const currentSprint = await Sprint.findById(project.currentSprint);
//     if (!currentSprint) {
//       return {
//         success: false,
//         message: "Current sprint not found",
//       };
//     }

//     if (currentSprint.hasEnded) {
//       // create a new sprint
//     }

//     currentSprint.designing.push(task._id);

//     task.status = "des";

//     await task.save();
//     await currentSprint.save();
//     await project.save();

//     revalidatePath(`/project/${projectId}`);
//     revalidatePath(`/project/${projectId}/backlog`);

//     return {
//       success: true,
//       message: "Task pushed to designing successfully",
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

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

    // Step 2: Find the current sprint
    let currentSprint = await Sprint.findById(project.currentSprint);
    if (!currentSprint) {
      return {
        success: false,
        message: "Current sprint not found",
      };
    }

    // Step 3: Check if the current sprint has ended
    if (currentSprint.hasEnded) {
      // Create a new sprint if the current one has ended
      const newSprint = new Sprint({
        number: project.sprints.length + 1,
        name: `Sprint ${project.sprints.length + 1}`,
        submissions: currentSprint.submissions || [],
        // hasStarted: false,
      });

      await newSprint.save();
      project.currentSprint = newSprint._id;
      project.sprints.push(newSprint._id);
      await project.save();

      // Assign the task to the designing phase of the new sprint
      currentSprint = newSprint; // Update to the newly created sprint
    }

    // Add the task to the designing phase of the current sprint
    currentSprint.designing.push(task._id);

    // Update the task status to 'des' (designing)
    task.status = "des";
    await task.save();

    // Save the sprint and project
    await currentSprint.save();
    await project.save();

    // Revalidate paths to refresh any cached data
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

    // Add members to task field
    memberIds.forEach((memberId) => {
      if (!task[fieldToUpdate].includes(memberId)) {
        task[fieldToUpdate].push(memberId);
      }
    });

    // Save the task with updated assignments
    await task.save();

    // Update each member's project tasks
    for (const memberId of memberIds) {
      const user = await User.findById(memberId);
      if (!user) {
        return {
          success: false,
          message: `User with ID ${memberId} not found`,
        };
      }

      // Find or add the project in the user's projects array
      const projectEntry = user.projects.find((proj: any) =>
        proj._id.equals(projectId)
      );

      if (projectEntry) {
        // If the project exists, add the task to tasks array if not present
        if (!projectEntry.tasks.includes(taskId)) {
          projectEntry.tasks.push(taskId);
        }
      } else {
        // If the project doesn't exist, add a new entry with the task
        user.projects.push({
          _id: new Types.ObjectId(projectId),
          tasks: [taskId],
        });
      }

      // Save each updated user
      await user.save();
    }
    revalidatePath(`/project/${projectId}`);
    revalidatePath(`/tasks`);
    return {
      success: true,
      message: "Members added successfully to the task and users updated",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
}

export async function getMyTasks() {
  try {
    await connectToDatabase();

    const { userId, userMail, userName } = await userInfo();

    if (!userId || !userMail || !userName) {
      return {
        success: false,
        message: "User credentials not found",
      };
    }

    // Fetch user data with populated projects and sprints
    const user = await User.findOne({
      clerkId: userId,
      email: userMail,
      username: userName,
    }).populate({
      path: "projects._id",
      select: "name currentSprint tasks",
      populate: {
        path: "currentSprint",
        model: "Sprint",
        select: "timeSpan currentTime hasStarted",
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Find all tasks assigned to this user
    const assignedTasks = await Task.find({
      $or: [
        { assignedDesigners: user._id },
        { assignedDevelopers: user._id },
        { assignedTesters: user._id },
        { assignedDeployers: user._id },
      ],
    });

    // Filter tasks to ensure they are in the user’s projects
    const taskDetails = await Promise.all(
      assignedTasks.map(async (task: any) => {
        // Check if task still exists in one of the user's projects
        const userProject = user.projects.find((project: any) =>
          project.tasks.some((userTaskId: any) => userTaskId.equals(task._id))
        );

        if (!userProject) {
          // Skip tasks that are no longer part of the user's projects
          return null;
        }

        const projectId = userProject ? userProject._id._id : undefined;
        const currentSprint = userProject
          ? userProject._id.currentSprint
          : null;

        // Calculate remaining days if the sprint has started
        let remainingDays = null;
        if (currentSprint && currentSprint.hasStarted) {
          if (
            currentSprint.timeSpan !== undefined &&
            currentSprint.currentTime !== undefined
          ) {
            remainingDays = Math.max(
              0,
              currentSprint.timeSpan - currentSprint.currentTime
            );
          }
        }

        // Determine the assigned members based on task status
        let assignedMembersField = "";
        if (task.status === "des") assignedMembersField = "assignedDesigners";
        else if (task.status === "dev")
          assignedMembersField = "assignedDevelopers";
        else if (task.status === "tes")
          assignedMembersField = "assignedTesters";
        else if (task.status === "dep")
          assignedMembersField = "assignedDeployers";

        await task.populate({
          path: assignedMembersField,
          select: "username photo",
        });

        const assignedMembers = task[assignedMembersField] || [];

        return {
          projectId,
          taskId: task._id,
          taskStatus: task.status,
          taskName: task.name,
          taskDescription: task.description,
          taskSubmitted: task.isSubmitted,
          priority: task.priority,
          remainingDays,
          errorNote: task.errorNote,
          assignedMembers: assignedMembers.map((member: any) => ({
            username: member.username,
            photo: member.photo,
          })),
        };
      })
    );

    // Filter out any null values from the taskDetails array
    const filteredTaskDetails = taskDetails.filter((task) => task !== null);

    return {
      success: true,
      tasks: JSON.parse(JSON.stringify(filteredTaskDetails)),
    };
  } catch (error: any) {
    console.error("Error in getMyTasks:", error);
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
}

export async function submitTaskFunction(projectId: string, taskId: string) {
  try {
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
      return {
        success: false,
        message: "Invalid ids",
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

    // Check if the project has a current sprint
    if (!project.currentSprint) {
      return {
        success: false,
        message: "No active sprint found for the project",
      };
    }

    // Locate the sprint and update the submissions
    const sprint = await Sprint.findById(project.currentSprint);

    if (!sprint) {
      return {
        success: false,
        message: "Sprint not found",
      };
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    // Update task fields
    task.isSubmitted = true;
    task.errorNote = "";

    await task.save();

    // Add taskId to sprint's submissions array if it's not already included
    if (!sprint.submissions.includes(taskId)) {
      sprint.submissions.push(taskId);
      await sprint.save();
    }

    revalidatePath("/tasks");

    return {
      success: true,
      message: "Task submitted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
}

// export async function checkUserIsAdminAndReturnSubmittedTasks(
//   projectId: string
// ) {
//   try {
//     if (!Types.ObjectId.isValid(projectId)) {
//       return {
//         success: false,
//         message: "Invalid project ID",
//       };
//     }

//     const { userName, userId, userMail } = await userInfo();

//     if (!userName || !userId || !userMail) {
//       return {
//         success: false,
//         message: "User credentials not found",
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

//     if (!isAdmin) {
//       return {
//         success: false,
//         message: "You don't have access to this page",
//       };
//     }

//     if (!project.currentSprint) {
//       return {
//         success: false,
//         message: "No current sprint available",
//       };
//     }

//     // Retrieve the current sprint and populate the submitted tasks
//     const currentSprint = await Sprint.findById(project.currentSprint)
//       .populate({
//         path: "submissions",
//         populate: [
//           {
//             path: "assignedDesigners", // Designers for "designing" tasks
//             select: "_id photo username",
//           },
//           {
//             path: "assignedDevelopers", // Developers for "development" tasks
//             select: "_id photo username",
//           },
//           {
//             path: "assignedTesters", // Testers for "testing" tasks
//             select: "_id photo username",
//           },
//           {
//             path: "assignedDeployers", // Deployers for "deployment" tasks
//             select: "_id photo username",
//           },
//         ],
//         model: "Task",
//       })
//       .select("-__v");

//     if (!currentSprint) {
//       return {
//         success: false,
//         message: "Current sprint data not found",
//       };
//     }

//     // Return the populated data of submitted tasks
//     return {
//       success: true,
//       isAdmin,
//       submittedTasks: JSON.parse(JSON.stringify(currentSprint.submissions)),
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

// export async function checkUserIsAdminAndReturnSubmittedTasks(
//   projectId: string
// ) {
//   try {
//     if (!Types.ObjectId.isValid(projectId)) {
//       return {
//         success: false,
//         message: "Invalid project ID",
//       };
//     }

//     const { userName, userId, userMail } = await userInfo();

//     if (!userName || !userId || !userMail) {
//       return {
//         success: false,
//         message: "User credentials not found",
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

//     if (!isAdmin) {
//       return {
//         success: false,
//         message: "You don't have access to this page",
//       };
//     }

//     if (!project.currentSprint) {
//       return {
//         success: false,
//         message: "No current sprint available",
//       };
//     }

//     // Retrieve the current sprint and calculate remaining days
//     const currentSprint = await Sprint.findById(project.currentSprint)
//       .populate({
//         path: "submissions",
//         populate: [
//           {
//             path: "assignedDesigners", // Designers for "designing" tasks
//             select: "_id photo username",
//           },
//           {
//             path: "assignedDevelopers", // Developers for "development" tasks
//             select: "_id photo username",
//           },
//           {
//             path: "assignedTesters", // Testers for "testing" tasks
//             select: "_id photo username",
//           },
//           {
//             path: "assignedDeployers", // Deployers for "deployment" tasks
//             select: "_id photo username",
//           },
//         ],
//         model: "Task",
//       })
//       .select("-__v");

//     if (!currentSprint) {
//       return {
//         success: false,
//         message: "Current sprint data not found",
//       };
//     }

//     // Calculate remaining days if the sprint has started
//     let remainingDays = null;
//     if (
//       currentSprint.hasStarted &&
//       currentSprint.timeSpan !== undefined &&
//       currentSprint.currentTime !== undefined
//     ) {
//       remainingDays = Math.max(
//         0,
//         currentSprint.timeSpan - currentSprint.currentTime
//       );
//     }

//     // Return the populated data of submitted tasks along with remaining days
//     return {
//       success: true,
//       isAdmin,
//       remainingDays,
//       submittedTasks: JSON.parse(JSON.stringify(currentSprint.submissions)),
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

export async function checkUserIsAdminAndReturnSubmittedTasks(
  projectId: string
) {
  try {
    if (!Types.ObjectId.isValid(projectId)) {
      return {
        success: false,
        message: "Invalid project ID",
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

    if (!isAdmin) {
      return {
        success: false,
        message: "You don't have access to this page",
      };
    }

    if (!project.currentSprint) {
      return {
        success: false,
        message: "No current sprint available",
      };
    }

    // Retrieve the current sprint and calculate remaining days
    const currentSprint = await Sprint.findById(project.currentSprint)
      .populate({
        path: "submissions",
        populate: [
          {
            path: "assignedDesigners",
            select: "_id photo username",
          },
          {
            path: "assignedDevelopers",
            select: "_id photo username",
          },
          {
            path: "assignedTesters",
            select: "_id photo username",
          },
          {
            path: "assignedDeployers",
            select: "_id photo username",
          },
        ],
        model: "Task",
      })
      .select("-__v");

    if (!currentSprint) {
      return {
        success: false,
        message: "Current sprint data not found",
      };
    }

    // Calculate remaining days if the sprint has started
    let remainingDays = null;
    if (
      currentSprint.hasStarted &&
      typeof currentSprint.timeSpan === "number" &&
      typeof currentSprint.currentTime === "number"
    ) {
      remainingDays = Math.max(
        0,
        currentSprint.timeSpan - currentSprint.currentTime
      );
    }

    return {
      success: true,
      isAdmin,
      remainingDays,
      submittedTasks: JSON.parse(JSON.stringify(currentSprint.submissions)),
    };
  } catch (error: any) {
    console.error("Error occurred:", error.message);
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

// export async function acceptOrRejectTask({
//   projectId,
//   taskId,
//   type,
//   note = "",
// }: {
//   projectId: string;
//   taskId: string;
//   type: "accept" | "reject";
//   note?: string;
// }) {
//   try {
//     // Validate projectId and taskId
//     if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
//       return {
//         success: false,
//         message: "Invalid project or task ID.",
//       };
//     }

//     await connectToDatabase();

//     // Fetch project and task documents
//     const project = await Project.findById(projectId);
//     const task = await Task.findById(taskId);
//     const sprint = await Sprint.findById(project?.currentSprint);

//     if (!project || !task || !sprint) {
//       return {
//         success: false,
//         message: "Project, task, or current sprint not found.",
//       };
//     }

//     if (type === "accept") {
//       // Determine the task's current stage
//       const currentStage = task.status;
//       let nextStage;

//       // Define the workflow for task stages
//       switch (currentStage) {
//         case "des":
//           nextStage = "dev"; // Move to development
//           break;
//         case "dev":
//           nextStage = "tes"; // Move to testing
//           break;
//         case "tes":
//           nextStage = "dep"; // Move to deployment
//           break;
//         case "dep":
//           nextStage = "com"; // Move to completed
//           break;
//         default:
//           return {
//             success: false,
//             message: "Task is not in an accepted stage for processing.",
//           };
//       }

//       // Remove task from current stage array in sprint
//       sprint[currentStage] = sprint[currentStage].filter(
//         (id: any) => !id.equals(task._id)
//       );

//       // Add task to the next stage array and update task properties
//       if (nextStage !== "com") {
//         sprint[nextStage].push(task._id);
//       } else {
//         sprint.completed.push(task._id);
//       }

//       task.status = nextStage;
//       task.errorNote = "";
//       task.isSubmitted = false;

//       await task.save();
//       await sprint.save();

//       return {
//         success: true,
//         message: "Task has been successfully moved to the next stage.",
//       };
//     } else if (type === "reject") {
//       // Remove the task from the submissions list in the sprint
//       sprint.submissions = sprint.submissions.filter(
//         (id: any) => !id.equals(task._id)
//       );

//       // Set the error note for the task and leave it in the same stage
//       task.errorNote = note;
//       await task.save();
//       await sprint.save();

//       return {
//         success: true,
//         message: "Task has been rejected with a note.",
//       };
//     } else {
//       return {
//         success: false,
//         message: "Invalid action type.",
//       };
//     }
//   } catch (error: any) {
//     console.log(error.message);
//     return {
//       success: false,
//       message: error.message || "An error occurred while processing the task.",
//     };
//   }
// }

// task movement works here
// export async function acceptOrRejectTask({
//   projectId,
//   taskId,
//   type,
//   note = "",
// }: {
//   projectId: string;
//   taskId: string;
//   type: "accept" | "reject";
//   note?: string;
// }) {
//   try {
//     if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
//       return {
//         success: false,
//         message: "Invalid ids",
//       };
//     }

//     await connectToDatabase();

//     const project = await Project.findById(projectId);
//     const task = await Task.findById(taskId);
//     const sprint = await Sprint.findById(project.currentSprint);

//     if (!project || !task || !sprint) {
//       return {
//         success: false,
//         message: "Project, task, or sprint not found",
//       };
//     }

//     if (type === "accept") {
//       // Identify the current stage and determine the next stage
//       let currentStage, nextStage, nextStatus;

//       switch (task.status) {
//         case "des":
//           currentStage = "designing";
//           nextStage = "development";
//           nextStatus = "dev";
//           break;
//         case "dev":
//           currentStage = "development";
//           nextStage = "testing";
//           nextStatus = "tes";
//           break;
//         case "tes":
//           currentStage = "testing";
//           nextStage = "deployment";
//           nextStatus = "dep";
//           break;
//         case "dep":
//           currentStage = "deployment";
//           nextStage = "completed";
//           nextStatus = "com";
//           break;
//         default:
//           return {
//             success: false,
//             message: "Task cannot be accepted as it's not in a valid stage",
//           };
//       }

//       // Remove task from `submissions` and the current stage array
//       sprint.submissions = sprint.submissions.filter(
//         (id: any) => !id.equals(taskId)
//       );
//       sprint[currentStage] = sprint[currentStage].filter(
//         (id: any) => !id.equals(taskId)
//       );

//       // Move task to the next stage array and update task status
//       if (nextStatus !== "com") {
//         sprint[nextStage].push(task._id);
//       } else {
//         sprint.completed.push(task._id);
//       }

//       // Update task properties
//       task.status = nextStatus;
//       task.isSubmitted = false;
//       task.errorNote = "";
//     } else if (type === "reject") {
//       // Remove the task from the `submissions` array
//       sprint.submissions = sprint.submissions.filter(
//         (id: any) => !id.equals(taskId)
//       );
//       task.errorNote = note; // Set the error note on rejection
//     }

//     // Save both sprint and task updates
//     await Promise.all([sprint.save(), task.save()]);

//     revalidatePath(`/project/${projectId}`);
//     revalidatePath(`/project/${projectId}/submissions`);

//     return {
//       success: true,
//       message: `Task ${
//         type === "accept" ? "accepted" : "rejected"
//       } successfully`,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

// export async function acceptOrRejectTask({
//   projectId,
//   taskId,
//   type,
//   note = "",
// }: {
//   projectId: string;
//   taskId: string;
//   type: "accept" | "reject";
//   note?: string;
// }) {
//   try {
//     if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
//       return {
//         success: false,
//         message: "Invalid IDs",
//       };
//     }

//     await connectToDatabase();

//     const project = await Project.findById(projectId);
//     const task = await Task.findById(taskId);
//     const sprint = await Sprint.findById(project.currentSprint);

//     if (!project || !task || !sprint) {
//       return {
//         success: false,
//         message: "Project, task, or sprint not found",
//       };
//     }

//     if (type === "accept") {
//       let currentStage, nextStage, nextStatus, assignedUsersField;

//       switch (task.status) {
//         case "des":
//           currentStage = "designing";
//           nextStage = "development";
//           nextStatus = "dev";
//           assignedUsersField = "assignedDesigners";
//           break;
//         case "dev":
//           currentStage = "development";
//           nextStage = "testing";
//           nextStatus = "tes";
//           assignedUsersField = "assignedDevelopers";
//           break;
//         case "tes":
//           currentStage = "testing";
//           nextStage = "deployment";
//           nextStatus = "dep";
//           assignedUsersField = "assignedTesters";
//           break;
//         case "dep":
//           currentStage = "deployment";
//           nextStage = "completed";
//           nextStatus = "com";
//           assignedUsersField = "assignedDeployers";
//           break;
//         default:
//           return {
//             success: false,
//             message: "Task cannot be accepted as it's not in a valid stage",
//           };
//       }

//       // Remove task from `submissions` and current stage
//       sprint.submissions = sprint.submissions.filter(
//         (id: any) => !id.equals(taskId)
//       );
//       sprint[currentStage] = sprint[currentStage].filter(
//         (id: any) => !id.equals(taskId)
//       );

//       // Move task to the next stage
//       if (nextStatus !== "com") {
//         sprint[nextStage].push(task._id);
//       } else {
//         sprint.completed.push(task._id);
//       }

//       task.status = nextStatus;
//       task.isSubmitted = false;
//       task.errorNote = "";

//       // Remove task ID from assigned users' tasks array
//       const assignedUsers = await User.find({
//         _id: { $in: task[assignedUsersField] },
//       });

//       await Promise.all(
//         assignedUsers.map(async (user) => {
//           const projectInUser = user.projects.find((p: any) =>
//             p._id.equals(projectId)
//           );
//           if (projectInUser) {
//             projectInUser.tasks = projectInUser.tasks.filter(
//               (id: any) => !id.equals(taskId)
//             );
//           }
//           await user.save();
//         })
//       );
//     } else if (type === "reject") {
//       sprint.submissions = sprint.submissions.filter(
//         (id:any) => !id.equals(taskId)
//       );
//       task.errorNote = note;
//     }

//     await Promise.all([sprint.save(), task.save()]);

//     return {
//       success: true,
//       message: `Task ${
//         type === "accept" ? "accepted" : "rejected"
//       } successfully`,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

// export async function acceptOrRejectTask({
//   projectId,
//   taskId,
//   type,
//   note = "",
// }: {
//   projectId: string;
//   taskId: string;
//   type: "accept" | "reject";
//   note?: string;
// }) {
//   try {
//     if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
//       return {
//         success: false,
//         message: "Invalid IDs",
//       };
//     }

//     await connectToDatabase();

//     const project = await Project.findById(projectId);
//     const task = await Task.findById(taskId);
//     const sprint = await Sprint.findById(project.currentSprint);

//     if (!project || !task || !sprint) {
//       return {
//         success: false,
//         message: "Project, task, or sprint not found",
//       };
//     }

//     // Reset isSubmitted to false for both accept and reject scenarios
//     task.isSubmitted = false;

//     if (type === "accept") {
//       let currentStage, nextStage, nextStatus, assignedUsersField;

//       switch (task.status) {
//         case "des":
//           currentStage = "designing";
//           nextStage = "development";
//           nextStatus = "dev";
//           assignedUsersField = "assignedDesigners";
//           break;
//         case "dev":
//           currentStage = "development";
//           nextStage = "testing";
//           nextStatus = "tes";
//           assignedUsersField = "assignedDevelopers";
//           break;
//         case "tes":
//           currentStage = "testing";
//           nextStage = "deployment";
//           nextStatus = "dep";
//           assignedUsersField = "assignedTesters";
//           break;
//         case "dep":
//           currentStage = "deployment";
//           nextStage = "completed";
//           nextStatus = "com";
//           assignedUsersField = "assignedDeployers";
//           break;
//         default:
//           return {
//             success: false,
//             message: "Task cannot be accepted as it's not in a valid stage",
//           };
//       }

//       // Remove task from `submissions` and current stage
//       sprint.submissions = sprint.submissions.filter(
//         (id: any) => !id.equals(taskId)
//       );
//       sprint[currentStage] = sprint[currentStage].filter(
//         (id: any) => !id.equals(taskId)
//       );

//       // Move task to the next stage
//       if (nextStatus !== "com") {
//         sprint[nextStage].push(task._id);
//       } else {
//         sprint.completed.push(task._id);
//       }

//       task.status = nextStatus;
//       task.errorNote = "";

//       // Remove task ID from assigned users' tasks array
//       const assignedUsers = await User.find({
//         _id: { $in: task[assignedUsersField] },
//       });

//       await Promise.all(
//         assignedUsers.map(async (user) => {
//           // Find the project in the user's projects array
//           const projectInUser = user.projects.find((p: any) =>
//             p._id.equals(projectId)
//           );
//           if (projectInUser) {
//             // Remove the task ID from the tasks array of that project
//             projectInUser.tasks = projectInUser.tasks.filter(
//               (id: any) => !id.equals(taskId)
//             );
//             // Save the user with the updated tasks array
//             await user.save();
//           }
//         })
//       );
//     } else if (type === "reject") {
//       sprint.submissions = sprint.submissions.filter(
//         (id: any) => !id.equals(taskId)
//       );
//       task.errorNote = note;
//     }

//     // Save the sprint and task after changes
//     await Promise.all([sprint.save(), task.save()]);

//     return {
//       success: true,
//       message: `Task ${
//         type === "accept" ? "accepted" : "rejected"
//       } successfully`,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

// export async function acceptOrRejectTask({
//   projectId,
//   taskId,
//   type,
//   note = "",
// }: {
//   projectId: string;
//   taskId: string;
//   type: "accept" | "reject";
//   note?: string;
// }) {
//   try {
//     if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
//       return {
//         success: false,
//         message: "Invalid IDs",
//       };
//     }

//     await connectToDatabase();

//     const project = await Project.findById(projectId);
//     const task = await Task.findById(taskId);
//     const sprint = await Sprint.findById(project.currentSprint);

//     if (!project || !task || !sprint) {
//       return {
//         success: false,
//         message: "Project, task, or sprint not found",
//       };
//     }

//     // Reset isSubmitted to false for both accept and reject scenarios
//     task.isSubmitted = false;

//     if (type === "accept") {
//       let currentStage, nextStage, nextStatus, assignedUsersField;

//       switch (task.status) {
//         case "des":
//           currentStage = "designing";
//           nextStage = "development";
//           nextStatus = "dev";
//           assignedUsersField = "assignedDesigners";
//           break;
//         case "dev":
//           currentStage = "development";
//           nextStage = "testing";
//           nextStatus = "tes";
//           assignedUsersField = "assignedDevelopers";
//           break;
//         case "tes":
//           currentStage = "testing";
//           nextStage = "deployment";
//           nextStatus = "dep";
//           assignedUsersField = "assignedTesters";
//           break;
//         case "dep":
//           currentStage = "deployment";
//           nextStage = "completed";
//           nextStatus = "com";
//           assignedUsersField = "assignedDeployers";
//           break;
//         default:
//           return {
//             success: false,
//             message: "Task cannot be accepted as it's not in a valid stage",
//           };
//       }

//       // Remove task from `submissions` and current stage
//       sprint.submissions = sprint.submissions.filter(
//         (id: any) => !id.equals(taskId)
//       );
//       sprint[currentStage] = sprint[currentStage].filter(
//         (id: any) => !id.equals(taskId)
//       );

//       // Move task to the next stage
//       if (nextStatus !== "com") {
//         sprint[nextStage].push(task._id);
//       } else {
//         sprint.completed.push(task._id);
//       }

//       task.status = nextStatus;
//       task.errorNote = "";

//       // Remove task from the assigned users' tasks directly using update
//       const assignedUsers = task[assignedUsersField];

//       await Promise.all(
//         assignedUsers.map(async (userId: Types.ObjectId) => {
//           await User.updateOne(
//             { _id: userId, "projects._id": projectId },
//             { $pull: { "projects.$.tasks": taskId } }
//           );
//         })
//       );
//     } else if (type === "reject") {
//       sprint.submissions = sprint.submissions.filter(
//         (id: any) => !id.equals(taskId)
//       );
//       task.errorNote = note;
//     }

//     // Save the sprint and task after changes
//     await Promise.all([sprint.save(), task.save()]);

//     return {
//       success: true,
//       message: `Task ${
//         type === "accept" ? "accepted" : "rejected"
//       } successfully`,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

// export async function acceptOrRejectTask({
//   projectId,
//   taskId,
//   type,
//   note = "",
// }: {
//   projectId: string;
//   taskId: string;
//   type: "accept" | "reject";
//   note?: string;
// }) {
//   try {
//     if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
//       return {
//         success: false,
//         message: "Invalid IDs",
//       };
//     }

//     await connectToDatabase();

//     const project = await Project.findById(projectId);
//     const task = await Task.findById(taskId);
//     const sprint = await Sprint.findById(project.currentSprint);

//     if (!project || !task || !sprint) {
//       return {
//         success: false,
//         message: "Project, task, or sprint not found",
//       };
//     }

//     // Reset isSubmitted to false for both accept and reject scenarios
//     task.isSubmitted = false;

//     if (type === "accept") {
//       let currentStage, nextStage, nextStatus, assignedUsersField;

//       switch (task.status) {
//         case "des":
//           currentStage = "designing";
//           nextStage = "development";
//           nextStatus = "dev";
//           assignedUsersField = "assignedDesigners";
//           break;
//         case "dev":
//           currentStage = "development";
//           nextStage = "testing";
//           nextStatus = "tes";
//           assignedUsersField = "assignedDevelopers";
//           break;
//         case "tes":
//           currentStage = "testing";
//           nextStage = "deployment";
//           nextStatus = "dep";
//           assignedUsersField = "assignedTesters";
//           break;
//         case "dep":
//           currentStage = "deployment";
//           nextStage = "completed";
//           nextStatus = "com";
//           assignedUsersField = "assignedDeployers";
//           break;
//         default:
//           return {
//             success: false,
//             message: "Task cannot be accepted as it's not in a valid stage",
//           };
//       }

//       // Remove task from `submissions` and current stage
//       sprint.submissions = sprint.submissions.filter(
//         (id: any) => !id.equals(taskId)
//       );
//       sprint[currentStage] = sprint[currentStage].filter(
//         (id: any) => !id.equals(taskId)
//       );

//       // Move task to the next stage
//       if (nextStatus !== "com") {
//         sprint[nextStage].push(task._id);
//       } else {
//         sprint.completed.push(task._id);
//       }

//       task.status = nextStatus;
//       task.errorNote = "";

//       // Remove task from the assigned users' tasks directly
//       const assignedUsers = task[assignedUsersField];

//       await Promise.all(
//         assignedUsers.map(async (userId: Types.ObjectId) => {
//           // Update the user's tasks array within the correct project
//           await User.updateOne(
//             { _id: userId, "projects._id": projectId },
//             { $pull: { "projects.$.tasks": taskId } }
//           );
//         })
//       );
//     } else if (type === "reject") {
//       sprint.submissions = sprint.submissions.filter(
//         (id: any) => !id.equals(taskId)
//       );
//       task.errorNote = note;
//     }

//     // Save the sprint and task after changes
//     await Promise.all([sprint.save(), task.save()]);

//     return {
//       success: true,
//       message: `Task ${
//         type === "accept" ? "accepted" : "rejected"
//       } successfully`,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

// export async function acceptOrRejectTask({
//   projectId,
//   taskId,
//   type,
//   note = "",
// }: {
//   projectId: string;
//   taskId: string;
//   type: "accept" | "reject";
//   note?: string;
// }) {
//   try {
//     if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
//       return { success: false, message: "Invalid IDs" };
//     }

//     await connectToDatabase();

//     const project = await Project.findById(projectId);
//     const task = await Task.findById(taskId);
//     const sprint = await Sprint.findById(project.currentSprint);

//     if (!project || !task || !sprint) {
//       return { success: false, message: "Project, task, or sprint not found" };
//     }

//     task.isSubmitted = false;

//     if (type === "accept") {
//       let currentStage, nextStage, nextStatus, assignedUsersField;

//       switch (task.status) {
//         case "des":
//           currentStage = "designing";
//           nextStage = "development";
//           nextStatus = "dev";
//           assignedUsersField = "assignedDesigners";
//           break;
//         case "dev":
//           currentStage = "development";
//           nextStage = "testing";
//           nextStatus = "tes";
//           assignedUsersField = "assignedDevelopers";
//           break;
//         case "tes":
//           currentStage = "testing";
//           nextStage = "deployment";
//           nextStatus = "dep";
//           assignedUsersField = "assignedTesters";
//           break;
//         case "dep":
//           currentStage = "deployment";
//           nextStage = "completed";
//           nextStatus = "com";
//           assignedUsersField = "assignedDeployers";
//           break;
//         default:
//           return { success: false, message: "Task cannot be accepted as it's not in a valid stage" };
//       }

//       sprint.submissions = sprint.submissions.filter((id: any) => !id.equals(taskId));
//       sprint[currentStage] = sprint[currentStage].filter((id: any) => !id.equals(taskId));

//       if (nextStatus !== "com") {
//         sprint[nextStage].push(task._id);
//       } else {
//         sprint.completed.push(task._id);
//       }

//       task.status = nextStatus;
//       task.errorNote = "";

//       // Debugging console logs
//       console.log("Assigned Users:", task[assignedUsersField]);

//       const assignedUsers = task[assignedUsersField];
//       await Promise.all(
//         assignedUsers.map(async (userId: Types.ObjectId) => {
//           const user = await User.findOne({ _id: userId });
//           if (user) {
//             const projectIndex = user.projects.findIndex((p: any) => p._id.equals(projectId));
//             if (projectIndex !== -1) {
//               const project = user.projects[projectIndex];
//               project.tasks = project.tasks.filter((taskIdInUser: Types.ObjectId) => !taskIdInUser.equals(taskId));
//               console.log("Updated Tasks for User:", project.tasks);
//               await user.save();
//             }
//           }
//         })
//       );
//     } else if (type === "reject") {
//       sprint.submissions = sprint.submissions.filter((id: any) => !id.equals(taskId));
//       task.errorNote = note;
//     }

//     await Promise.all([sprint.save(), task.save()]);
//     return { success: true, message: `Task ${type === "accept" ? "accepted" : "rejected"} successfully` };
//   } catch (error: any) {
//     return { success: false, message: error.message || "Something went wrong" };
//   }
// }

export async function acceptOrRejectTask({
  projectId,
  taskId,
  type,
  note = "",
}: {
  projectId: string;
  taskId: string;
  type: "accept" | "reject";
  note?: string;
}) {
  try {
    // console.log("Starting acceptOrRejectTask function...");
    // console.log("Project ID:", projectId);
    // console.log("Task ID:", taskId);
    // console.log("Action Type:", type);

    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
      return { success: false, message: "Invalid IDs" };
    }

    await connectToDatabase();
    // console.log("Database connected");

    const project = await Project.findById(projectId);
    const task = await Task.findById(taskId);
    const sprint = await Sprint.findById(project?.currentSprint);

    if (!project || !task || !sprint) {
      return { success: false, message: "Project, task, or sprint not found" };
    }

    // console.log("Project found:", project);
    // console.log("Task found:", task);
    // console.log("Sprint found:", sprint);

    task.isSubmitted = false;

    if (type === "accept") {
      let currentStage, nextStage, nextStatus, assignedUsersField;

      switch (task.status) {
        case "des":
          currentStage = "designing";
          nextStage = "development";
          nextStatus = "dev";
          assignedUsersField = "assignedDesigners";
          break;
        case "dev":
          currentStage = "development";
          nextStage = "testing";
          nextStatus = "tes";
          assignedUsersField = "assignedDevelopers";
          break;
        case "tes":
          currentStage = "testing";
          nextStage = "deployment";
          nextStatus = "dep";
          assignedUsersField = "assignedTesters";
          break;
        case "dep":
          currentStage = "deployment";
          nextStage = "completed";
          nextStatus = "com";
          assignedUsersField = "assignedDeployers";
          break;
        default:
          return {
            success: false,
            message: "Task cannot be accepted as it's not in a valid stage",
          };
      }

      // console.log("Current stage:", currentStage);
      // console.log("Next stage:", nextStage);
      // console.log("Assigned Users:", task[assignedUsersField]);

      sprint.submissions = sprint.submissions.filter(
        (id: any) => !id.equals(taskId)
      );
      sprint[currentStage] = sprint[currentStage].filter(
        (id: any) => !id.equals(taskId)
      );

      if (nextStatus !== "com") {
        sprint[nextStage].push(task._id);
      } else {
        task.isDone = true;
        sprint.completed.push(task._id);
      }

      task.status = nextStatus;
      task.errorNote = "";

      const assignedUsers = task[assignedUsersField];

      await Promise.all(
        assignedUsers.map(async (userId: Types.ObjectId) => {
          const updateResult = await User.findOneAndUpdate(
            {
              _id: userId,
              "projects._id": projectId,
            },
            {
              $pull: { "projects.$.tasks": taskId },
            },
            { new: true }
          );

          if (updateResult) {
            const project = updateResult.projects.find((p: any) =>
              p._id.equals(projectId)
            );
            // console.log(
            //   "Updated User Document's projects tasks array:",
            //   updateResult.projects
            // );
            // console.log(
            //   "Updated Tasks for User in Project:",
            //   project ? project.tasks : "Project not found"
            // );
          } else {
            // console.log(
            //   `No matching user or project found for userId: ${userId}`
            // );
          }
        })
      );
    } else if (type === "reject") {
      sprint.submissions = sprint.submissions.filter(
        (id: any) => !id.equals(taskId)
      );
      task.errorNote = note;
    }

    await Promise.all([sprint.save(), task.save()]);

    revalidatePath(`/tasks`);
    revalidatePath(`/project/${projectId}`);
    revalidatePath(`/project/${projectId}/submissions`);

    console.log("Sprint and task saved successfully");

    return {
      success: true,
      message: `Task ${
        type === "accept" ? "accepted" : "rejected"
      } successfully`,
    };
  } catch (error: any) {
    console.error("Error in acceptOrRejectTask:", error);
    return { success: false, message: error.message || "Something went wrong" };
  }
}
