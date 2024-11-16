"use server";

import { Types } from "mongoose";
import { userInfo } from "./utility.actions";
import { connectToDatabase } from "../database/mongoose";
import User from "../database/models/user.model";
import Project from "../database/models/project.model";
import { Sprint, Task } from "../database/models/sprint.model";
import { revalidatePath } from "next/cache";

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
//         path: "designing development testing deployment completed",
//         populate: [
//           {
//             path: "assignedDesigners",
//             select: "_id photo username",
//           },
//           {
//             path: "assignedDevelopers",
//             select: "_id photo username",
//           },
//           {
//             path: "assignedTesters",
//             select: "_id photo username",
//           },
//           {
//             path: "assignedDeployers",
//             select: "_id photo username",
//           },
//         ],
//         model: "Task",
//       })
//       .select("-__v -submissions");

//     // Calculate `canEnd` by checking completed tasks in the backlog
//     const completedTasksCount = await Task.countDocuments({
//       _id: { $in: project.backlog },
//       status: "com",
//     });

//     const canEnd =
//       project.backlog.length > 0 &&
//       completedTasksCount === project.backlog.length;

//     const sprints = await Sprint.find({ _id: { $in: project.sprints } })
//       .select("_id name")
//       .exec();

//     return {
//       success: true,
//       isAdmin,
//       currentSprintId: project.currentSprint.toString(),
//       currentSprintData: JSON.parse(JSON.stringify(currentSprint)),
//       canEnd,
//       sprints: sprints.map((sprint) => ({
//         _id: sprint._id.toString(),
//         name: sprint.name.toString(),
//       })),
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || "Something went wrong",
//     };
//   }
// }

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
//         path: "designing development testing deployment completed",
//         populate: [
//           {
//             path: "assignedDesigners",
//             select: "_id photo username",
//           },
//           {
//             path: "assignedDevelopers",
//             select: "_id photo username",
//           },
//           {
//             path: "assignedTesters",
//             select: "_id photo username",
//           },
//           {
//             path: "assignedDeployers",
//             select: "_id photo username",
//           },
//         ],
//         model: "Task",
//       })
//       .select("-__v -submissions");

//     // Check if all arrays (except completed) are empty and completed array has at least one task
//     const canEnd =
//       currentSprint &&
//       currentSprint.designing.length === 0 &&
//       currentSprint.development.length === 0 &&
//       currentSprint.testing.length === 0 &&
//       currentSprint.deployment.length === 0 &&
//       currentSprint.completed.length >= 1;

//     const sprints = await Sprint.find({ _id: { $in: project.sprints } })
//       .select("_id name")
//       .exec();

//     return {
//       success: true,
//       isAdmin,
//       currentSprintId: project.currentSprint.toString(),
//       currentSprintData: JSON.parse(JSON.stringify(currentSprint)),
//       canEnd,
//       sprints: sprints.map((sprint) => ({
//         _id: sprint._id.toString(),
//         name: sprint.name.toString(),
//       })),
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

    // Select only the required fields without excluding __v
    const currentSprint = await Sprint.findById(project.currentSprint)
      .populate({
        path: "designing development testing deployment completed",
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
      .select(
        "name hasStarted timeSpan currentTime hasEnded designing development testing deployment completed"
      );

    // Check if all arrays (except completed) are empty and completed array has at least one task
    const canEnd =
      currentSprint &&
      currentSprint.designing.length === 0 &&
      currentSprint.development.length === 0 &&
      currentSprint.testing.length === 0 &&
      currentSprint.deployment.length === 0 &&
      currentSprint.completed.length >= 1;

    const sprints = await Sprint.find({ _id: { $in: project.sprints } })
      .select("_id name")
      .exec();

    return {
      success: true,
      isAdmin,
      currentSprintId: project.currentSprint.toString(),
      currentSprintName: currentSprint.name, // This should now work correctly
      currentSprintData: JSON.parse(JSON.stringify(currentSprint)),
      canEnd,
      sprints: sprints.map((sprint) => ({
        _id: sprint._id.toString(),
        name: sprint.name.toString(),
      })),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function startSprint(projectId: string) {
  try {
    // Validate project ID
    if (!Types.ObjectId.isValid(projectId)) {
      return {
        success: false,
        message: "Invalid project ID",
      };
    }

    await connectToDatabase();

    // Find the project and check for a current sprint
    const project = await Project.findById(projectId).select("currentSprint");

    if (!project || !project.currentSprint) {
      return {
        success: false,
        message: "Project or current sprint not found",
      };
    }

    // Get the current sprint
    const currentSprint = await Sprint.findById(project.currentSprint).select(
      "hasStarted"
    );

    if (!currentSprint) {
      return {
        success: false,
        message: "Current sprint not found",
      };
    }

    // Check if the sprint is already started
    if (currentSprint.hasStarted) {
      return {
        success: false,
        message: "Sprint has already started",
      };
    }

    // Start the sprint
    currentSprint.hasStarted = true;
    await currentSprint.save();

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      message: "Sprint started successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function endSprint(projectId: string) {
  try {
    if (!Types.ObjectId.isValid(projectId)) {
      return {
        success: false,
        message: "Invalid project ID",
      };
    }

    await connectToDatabase();

    // Fetch the project to check the backlog and the current sprint
    const project = await Project.findById(projectId)
      .populate("currentSprint")
      .populate("backlog"); // Assuming backlog is an array of task IDs

    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    // Check if the current sprint exists and has started
    const currentSprint = project.currentSprint;
    if (!currentSprint) {
      return {
        success: false,
        message: "No current sprint available",
      };
    }

    if (!currentSprint.hasStarted) {
      return {
        success: false,
        message: "Current sprint has not started yet",
      };
    }

    // Check if all arrays except completed are empty and completed array has at least 1 task
    const canEnd =
      currentSprint &&
      currentSprint.designing.length === 0 &&
      currentSprint.development.length === 0 &&
      currentSprint.testing.length === 0 &&
      currentSprint.deployment.length === 0 &&
      currentSprint.completed.length >= 1;

    if (!canEnd) {
      return {
        success: false,
        message: "There are incomplete tasks, sprint cannot be ended",
      };
    }

    // Set hasEnded to true for the current sprint
    currentSprint.hasEnded = true;
    await currentSprint.save();

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      message: "Sprint successfully ended",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function addSprintToProject(projectId: string) {
  try {
    // Validate projectId as an ObjectId
    if (!Types.ObjectId.isValid(projectId)) {
      return {
        success: false,
        message: "Invalid project ID",
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

    const currentSprintNumber =
      project.sprints.length > 0 ? project.sprints.length + 1 : 1;

    const newSprint = new Sprint({
      name: `Sprint ${currentSprintNumber}`,
      number: currentSprintNumber,
    });

    await newSprint.save();

    project.sprints.push(newSprint._id);
    await project.save();

    return {
      success: true,
      message: "Sprint created successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function AddSprintAccessChecker(projectId: string) {
  try {
    // Get user information
    const { userName, userId, userMail } = await userInfo();
    if (!userName || !userId || !userMail) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await connectToDatabase();

    // Find the project by projectId and only select the members field
    const project = await Project.findById(projectId).select("members");
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    // Find the user by their unique identifiers
    const user = await User.findOne({
      clerkId: userId,
      email: userMail,
      username: userName,
    });

    if (!user) {
      return {
        success: false,
        message: "User not found in the database",
      };
    }

    // Check if the user is an admin of the project
    const isAdmin = project.members.some(
      (member: any) => member._id.equals(user._id) && member.role === "admin"
    );

    if (isAdmin) {
      return {
        success: true,
        message: "User is an admin and can add sprints",
      };
    } else {
      return {
        success: false,
        message: "User is not an admin of this project",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}

export async function getSprintDataBySprintId(
  projectId: string,
  sprintId: string
) {
  try {
    // Validate projectId and sprintId as ObjectIds
    if (
      !Types.ObjectId.isValid(projectId) ||
      !Types.ObjectId.isValid(sprintId)
    ) {
      return {
        success: false,
        message: "Invalid project or sprint ID",
      };
    }

    await connectToDatabase();

    // Find the project by ID and check if it exists
    const project = await Project.findById(projectId).select(
      "currentSprint sprints"
    );
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    // Check if the sprintId is the current sprint
    if (project.currentSprint && project.currentSprint.equals(sprintId)) {
      return {
        success: false,
        message:
          "Cannot retrieve data for the current sprint using this method",
      };
    }

    // Find the sprint by ID and check if it's associated with the project
    const sprint = await Sprint.findOne({
      $and: [{ _id: sprintId }, { _id: { $in: project.sprints } }],
    }).select(
      "name hasStarted hasEnded completed designing development testing deployment"
    );

    if (!sprint) {
      return {
        success: false,
        message: "Sprint not found or not associated with this project",
      };
    }

    // Handle cases based on sprint status
    if (!sprint.hasStarted) {
      return {
        success: false,
        message: "The sprint has not started yet",
        sprintName: sprint.name, // Return sprint name if not started
      };
    } else if (!sprint.hasEnded) {
      return {
        success: false,
        message: "The sprint is in progress and not yet finished",
        sprintName: sprint.name, // Return sprint name if in progress
      };
    }

    // Populate tasks
    const populateOptions = [
      {
        path: "completed designing development testing deployment",
        populate: {
          path: "assignedDesigners assignedDevelopers assignedTesters assignedDeployers",
          select: "_id photo username firstName lastName email",
        },
        model: "Task",
      },
    ];
    await sprint.populate(populateOptions);

    // Prepare completed tasks
    const completedTasks = sprint.completed.map((task: any) => ({
      taskId: task._id,
      taskName: task.name,
      taskDescription: task.description,
      designers: task.assignedDesigners.map((designer: any) => ({
        username: designer.username,
        photo: designer.photo,
        firstName: designer.firstName,
        lastName: designer.lastName,
        email: designer.email,
      })),
      developers: task.assignedDevelopers.map((developer: any) => ({
        username: developer.username,
        photo: developer.photo,
        firstName: developer.firstName,
        lastName: developer.lastName,
        email: developer.email,
      })),
      testers: task.assignedTesters.map((tester: any) => ({
        username: tester.username,
        photo: tester.photo,
        firstName: tester.firstName,
        lastName: tester.lastName,
        email: tester.email,
      })),
      deployers: task.assignedDeployers.map((deployer: any) => ({
        username: deployer.username,
        photo: deployer.photo,
        firstName: deployer.firstName,
        lastName: deployer.lastName,
        email: deployer.email,
      })),
    }));

    // Prepare incomplete tasks
    const mapTaskWithRelevantMembers = (tasks: any[], status: string) =>
      tasks.map((task: any) => {
        let relevantMembers = [];
        if (status === "designing") {
          relevantMembers = task.assignedDesigners;
        } else if (status === "development") {
          relevantMembers = task.assignedDevelopers;
        } else if (status === "testing") {
          relevantMembers = task.assignedTesters;
        } else if (status === "deployment") {
          relevantMembers = task.assignedDeployers;
        }

        return {
          taskId: task._id,
          taskName: task.name,
          taskDescription: task.description,
          status,
          members: relevantMembers.map((member: any) => ({
            username: member.username,
            photo: member.photo,
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
          })),
        };
      });

    const incompleteTasks = [
      ...mapTaskWithRelevantMembers(sprint.designing, "designing"),
      ...mapTaskWithRelevantMembers(sprint.development, "development"),
      ...mapTaskWithRelevantMembers(sprint.testing, "testing"),
      ...mapTaskWithRelevantMembers(sprint.deployment, "deployment"),
    ];

    return {
      success: true,
      message: "Sprint is finished; returning tasks",
      sprintName: sprint.name, // Return sprint name if finished
      completedTasks,
      incompleteTasks,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
