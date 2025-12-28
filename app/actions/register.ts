"use strict";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const age = parseInt(formData.get("age") as string);
  const occupation = formData.get("occupation") as string;
  const phone = formData.get("phone") as string;
  const city = formData.get("city") as string;
  const hobbies = formData.get("hobbies") as string;
  const userId = formData.get("userId") as string;
  const password = formData.get("password") as string;

  try {
    await prisma.user.create({
      data: {
        name,
        age,
        occupation,
        phone,
        city,
        Hobbies: hobbies, // Matches your schema capitalization
        userId,
        password, // Note: In a real app, hash this using bcrypt!
      },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to register user." };
  }
}
