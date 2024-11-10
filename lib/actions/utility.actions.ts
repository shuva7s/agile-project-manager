"use server";

import { currentUser } from "@clerk/nextjs/server";

export async function userInfo() {
  try {
    const user = await currentUser();
    const userId = user?.id;
    const userName = user?.username;
    const userImage = user?.imageUrl;
    const userMail = user?.emailAddresses[0].emailAddress;
    return {
      userId: userId,
      userName: userName,
      userImage: userImage,
      userMail: userMail,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function sendWelcomeEmail(email: string) {
  try {
    // const { userMail } = await userInfo();

    // if (!userMail) {
    //   throw new Error("User email is missing.");
    // }

    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MAIL_SECRET}`,
      },
      body: JSON.stringify({
        to: email,
        subject: "Welcome to Our Platform!",
        html: "<h1>Welcome!</h1><p>Thank you for signing up.</p>",
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        `Failed to send email: ${errorResponse.message || "Unknown error"}`
      );
    }

    console.log("Welcome email sent successfully!");
  } catch (error: any) {
    // Catch any errors that occurred during the process
    console.error("Error in sending welcome email:", error.message || error);
  }
}
