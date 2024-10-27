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
