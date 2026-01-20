import { NextResponse } from "next/server";
import prisma from "@/prisma";

export async function POST(req: Request) {
  const { activityId, userIdState } = await req.json();

  // Normalize today (00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // 🔍 Check if already logged today
  const existingLog = await prisma.activityLogs.findFirst({
    where: {
      userId: userIdState,
      activityId: activityId,
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // ❌ Stop if already logged
  if (existingLog) {
    return NextResponse.json(
      { success: false, message: "Activity already logged today" },
      { status: 400 },
    );
  }

  // ✅ Log only once
  await prisma.activityLogs.create({
    data: {
      userId: userIdState,
      activityId: activityId,
      createdAt: today,
    },
  });

  return NextResponse.json({ success: true });
}
