import Project from "@/lib/database/models/project.model";
import { Sprint } from "@/lib/database/models/sprint.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { NextRequest } from "next/server";

// export async function GET(request: NextRequest) {
//   // Check authorization header
//   const authHeader = request.headers.get("authorization");
//   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//     return new Response("Unauthorized", {
//       status: 401,
//     });
//   }

//   try {
//     await connectToDatabase();

//     // Fetch all projects with their current sprints populated
//     const projects = await Project.find({}).populate("currentSprint");

//     for (const project of projects) {
//       const currentSprint = project.currentSprint;

//       // Check if the current sprint exists, hasn't ended, and has started
//       if (
//         currentSprint &&
//         !currentSprint.hasEnded &&
//         currentSprint.hasStarted
//       ) {
//         // Check if the currentTime + 1 is greater than or equal to timeSpan
//         if (currentSprint.currentTime + 1 >= currentSprint.timeSpan) {
//           // Mark current sprint as ended
//           currentSprint.hasEnded = true;
//           await currentSprint.save();

//           // Create a new sprint
//           const newSprint = new Sprint({
//             number: currentSprint.number + 1,
//             name: `Sprint ${currentSprint.number + 1}`,
//             timeSpan: 14, // or any other default timeSpan
//             currentTime: 0,
//             hasStarted: true,
//           });

//           await newSprint.save();

//           // Add new sprint to the project's sprints array and update the current sprint
//           project.sprints.push(newSprint._id);
//           project.currentSprint = newSprint._id;
//           await project.save();
//         } else {
//           // Increment current sprint's time if it's not yet finished
//           currentSprint.currentTime += 1;
//           await currentSprint.save();
//         }
//       }
//     }

//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: "Sprints checked and updated where necessary.",
//       }),
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: error.message || "An error occurred while updating sprints.",
//       }),
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: NextRequest) {
  // Check authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    await connectToDatabase();

    // Fetch all projects with their current sprints populated
    const projects = await Project.find({}).populate("currentSprint");

    for (const project of projects) {
      const currentSprint = project.currentSprint;

      // Check if the current sprint exists, hasn't ended, and has started
      if (
        currentSprint &&
        !currentSprint.hasEnded &&
        currentSprint.hasStarted
      ) {
        // Check if the currentTime + 1 is greater than or equal to timeSpan
        if (currentSprint.currentTime + 1 >= currentSprint.timeSpan) {
          // Check if there are incomplete tasks in the current sprint
          const hasIncompleteTasks =
            currentSprint.designing.length > 0 ||
            currentSprint.development.length > 0 ||
            currentSprint.testing.length > 0 ||
            currentSprint.deployment.length > 0;

          if (hasIncompleteTasks) {
            // Create a new sprint
            const newSprint = new Sprint({
              number: currentSprint.number + 1,
              name: `Sprint ${currentSprint.number + 1}`,
              hasStarted: true,
              designing: currentSprint.designing, // Copy designing tasks
              development: currentSprint.development, // Copy development tasks
              testing: currentSprint.testing, // Copy testing tasks
              deployment: currentSprint.deployment, // Copy deployment tasks
              submissions: currentSprint.submissions, // Copy submissions
            });

            await newSprint.save();

            //TODO: Send email notification to all members saying new sprint started

            // Mark current sprint as ended
            currentSprint.hasEnded = true;
            await currentSprint.save();

            // Add new sprint to the project's sprints array and update the current sprint
            project.sprints.push(newSprint._id);
            project.currentSprint = newSprint._id;
            await project.save();
          } else {
            // Mark the current sprint as ended since no new sprint is needed
            currentSprint.hasEnded = true;
            await currentSprint.save();
          }
        } else {
          // Increment current sprint's time if it's not yet finished
          currentSprint.currentTime += 1;
          await currentSprint.save();
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Sprints checked and updated where necessary.",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "An error occurred while updating sprints.",
      }),
      { status: 500 }
    );
  }
}
