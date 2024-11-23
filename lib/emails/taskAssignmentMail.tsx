"use server";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { TaskAssignment } from "@/components/email_templates/TaskAssignment";

export async function taskAssignmentMail({
  recipients,
  projectName,
  projectId,
  taskName,
  taskId,
  taskDescription,
  weightage,
}: {
  recipients: string[];
  projectName: string;
  projectId: string;
  taskName: string;
  taskId: string;
  taskDescription: string;
  weightage: number;
}) {
  const subject = `New Task Assignment: ${taskName}`;

  // Render email content
  const htmlContent = await render(
    <TaskAssignment
      recipients={recipients}
      projectName={projectName}
      projectId={projectId}
      taskName={taskName}
      taskId={taskId}
      taskDescription={taskDescription}
      weightage={weightage}
    />
  );

  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: parseInt(process.env.BREVO_SMTP_PORT || "587", 10),
    secure: false, // Typically false for port 587
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  const mailOptions = {
    from: "agileprojectmanager4@gmail.com",
    to: recipients.join(","), // Join recipients into a single string
    subject,
    html: htmlContent,
  };

  try {
    const res = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    console.dir(res);
    return {
      success: true,
      message: "Emails sent successfully",
    };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: error.message || "Failed to send emails",
    };
  }
}
