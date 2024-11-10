"use server";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { sendEmail } from "../nodemailer";

export type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
};

export async function createUser(user: CreateUserParams) {
  try {
    console.log("CreateUser function called");
    await connectToDatabase();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error: any) {
    // TODO: Error handling
    throw new Error("ERROR OCCURED AT CREATE_USER SERVER ACTION", error);
  }
}

export type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User updation failed: USER NOT FOUND");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error: any) {
    // TODO: Error handling
    throw new Error("ERROR OCCURED AT UPDATE_USER SERVER ACTION", error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User deletion failed: USER NOT FOUND");
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);

    //TODO: delete all the projects that the user created

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error: any) {
    // TODO: Error handling
    throw new Error("ERROR OCCURED AT DELETE_USER SERVER ACTION", error);
  }
}
