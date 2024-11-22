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

export async function updateTask({
  projectId,
  taskId,
  taskName,
  taskDescription,
  weightage,
}: {
  projectId: string;
  taskId: string;
  taskName: string;
  taskDescription: string;
  weightage: number;
}) {
  try {
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
      return {
        success: false,
        message: "Invalid project or task ID",
      };
    }
    await connectToDatabase();

    const task = await Task.findById(taskId);

    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    task.name = taskName || task.name;
    task.description = taskDescription || task.description;
    task.priority = weightage || task.priority;

    await task.save();

    revalidatePath(`/project/${projectId}`);
    revalidatePath(`/project/${projectId}/backlog`);
    revalidatePath(`/tasks`);

    return {
      success: true,
      message: "Task updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

// export async function deleteTask(projectId: string, taskId: string) {
//   try {
//     if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
//       return {
//         success: false,
//         message: "Invalid project or task ID",
//       };
//     }
//     await connectToDatabase();
//     const task = await Task.findById(taskId);
//     if (!task) {
//       return {
//         success: false,
//         message: "Task not found",
//       };
//     }
//     let assignedMembers = [];
//     if (task.status === "des") {
//       assignedMembers = task.assignedDesigners;
//     } else if (task.status === "dev") {
//       assignedMembers = task.assignedDevelopers;
//     } else if (task.status === "tes") {
//       assignedMembers = task.assignedTesters;
//     } else if (task.status === "dep") {
//       assignedMembers = task.assignedDeployers;
//     }
//     const members = await User.find({ _id: { $in: assignedMembers } });
//     members.forEach((member) => {
//       const project = member.projects.find(
//         (project: any) => project._id.toString() === projectId
//       );
//       if (project) {
//         project.tasks = project.tasks.filter(
//           (t: any) => t.toString() !== taskId
//         );
//       }
//     });
//     await Promise.all(members.map((member) => member.save()));
//     const project = await Project.findById(projectId);
//     if (project) {
//       project.backlog = project.backlog.filter(
//         (t: any) => t.toString() !== taskId
//       );
//       await project.save();
//     }
//     await Task.findByIdAndDelete(taskId);
//     return {
//       success: true,
//       message: "Task successfully deleted",
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "An unexpected error occurred",
//     };
//   }
// }

export async function deleteTask(projectId: string, taskId: string) {
  try {
    // 1. Validate IDs
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
      return {
        success: false,
        message: "Invalid project or task ID",
      };
    }

    await connectToDatabase();

    // 2. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    // 3. Determine assigned members based on task status
    let assignedMembers = [];
    if (task.status === "des") {
      assignedMembers = task.assignedDesigners;
    } else if (task.status === "dev") {
      assignedMembers = task.assignedDevelopers;
    } else if (task.status === "tes") {
      assignedMembers = task.assignedTesters;
    } else if (task.status === "dep") {
      assignedMembers = task.assignedDeployers;
    }

    // 4. Remove task from assigned members
    const members = await User.find({ _id: { $in: assignedMembers } });
    members.forEach((member) => {
      const project = member.projects.find(
        (project: any) => project._id.toString() === projectId
      );
      if (project) {
        project.tasks = project.tasks.filter(
          (t: any) => t.toString() !== taskId
        );
      }
    });
    await Promise.all(members.map((member) => member.save()));

    // 5. Remove task from project backlog
    const project = await Project.findById(projectId).populate("sprints");
    if (project) {
      project.backlog = project.backlog.filter(
        (t: any) => t.toString() !== taskId
      );

      // 6. Remove task from all sprints in the project
      project.sprints.forEach((sprint: any) => {
        [
          "designing",
          "development",
          "testing",
          "deployment",
          "submissions",
          "completed",
        ].forEach((field) => {
          if (sprint[field]) {
            sprint[field] = sprint[field].filter(
              (t: any) => t.toString() !== taskId
            );
          }
        });
      });

      await Promise.all(project.sprints.map((sprint: any) => sprint.save()));
      await project.save();
    }

    // 7. Delete the task
    await Task.findByIdAndDelete(taskId);

    revalidatePath(`/project/${projectId}/backlog`);
    revalidatePath(`/project/${projectId}`);
    revalidatePath(`/project/${projectId}/tasks`);

    return {
      success: true,
      message: "Task successfully deleted",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
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

export async function getAssignedMembersForTask(
  projectId: string,
  taskId: string
) {
  try {
    await connectToDatabase();

    // Validate project
    const project = await Project.findById(projectId).populate("members._id");
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    // Validate task
    const task = await Task.findById(taskId);
    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    // Determine members to return based on task status
    let assignedMemberIds = [];
    if (task.status === "des") {
      assignedMemberIds = task.assignedDesigners;
    } else if (task.status === "dev") {
      assignedMemberIds = task.assignedDevelopers;
    } else if (task.status === "tes") {
      assignedMemberIds = task.assignedTesters;
    } else if (task.status === "dep") {
      assignedMemberIds = task.assignedDeployers;
    } else {
      return {
        success: false,
        message: "Invalid task status",
      };
    }

    // Retrieve assigned members' data
    const assignedMembers = project.members
      .filter((member: any) =>
        assignedMemberIds.some((assignedId: any) =>
          assignedId.equals(member._id._id)
        )
      )
      .map((member: any) => member._id); // Extract populated user data

    return {
      success: true,
      members: JSON.parse(JSON.stringify(assignedMembers)),
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

export async function removeMembersFromTask(
  projectId: string,
  taskId: string,
  memberIds: string[]
) {
  try {
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
      return {
        success: false,
        message: "Invalid project or task ID",
      };
    }

    await connectToDatabase();

    // Fetch the project to ensure it exists
    const project = await Project.findById(projectId);
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    // Fetch the task to ensure it exists
    const task = await Task.findById(taskId);
    if (!task) {
      return {
        success: false,
        message: "Task not found",
      };
    }

    if (task.isSubmitted) {
      revalidatePath(`/project/${projectId}`);
      revalidatePath(`/tasks`);
      return {
        success: false,
        message: "Task already submitted",
      };
    }

    // Update the task to remove the members based on the task status
    if (task.status === "des") {
      task.assignedDesigners = task.assignedDesigners.filter(
        (id: Types.ObjectId) => !memberIds.includes(id.toString())
      );
    } else if (task.status === "dev") {
      task.assignedDevelopers = task.assignedDevelopers.filter(
        (id: Types.ObjectId) => !memberIds.includes(id.toString())
      );
    } else if (task.status === "tes") {
      task.assignedTesters = task.assignedTesters.filter(
        (id: Types.ObjectId) => !memberIds.includes(id.toString())
      );
    } else if (task.status === "dep") {
      task.assignedDeployers = task.assignedDeployers.filter(
        (id: Types.ObjectId) => !memberIds.includes(id.toString())
      );
    }

    // Save the updated task
    await task.save();

    // Remove the task from each member's `tasks` field
    await User.updateMany(
      { _id: { $in: memberIds } },
      { $pull: { tasks: taskId } }
    );
    revalidatePath(`/project/${projectId}`);
    revalidatePath(`/tasks`);
    return {
      success: true,
      message: "Members successfully removed from the task",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred while removing members",
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
