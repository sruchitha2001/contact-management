"use server";
// Adjust the "../" based on how deep your file is in the folder structure
import { PrismaClient } from "../../prisma/generated/prisma/client";

const prisma = new PrismaClient();
import { revalidatePath } from "next/cache";

export async function createTodo(userId: number, task: string) {
  await prisma.todo.create({
    data: { task, userId },
  });
  revalidatePath(`/user/${userId}`);
}

export async function deleteTodo(todoId: number, userId: number) {
  await prisma.todo.delete({
    where: { id: todoId },
  });
  revalidatePath(`/user/${userId}`);
}

export async function updateTodo(todoId: number, task: string, userId: number) {
  await prisma.todo.update({
    where: { id: todoId },
    data: { task },
  });
  revalidatePath(`/user/${userId}`);
}
