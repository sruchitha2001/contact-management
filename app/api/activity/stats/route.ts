import { NextResponse } from "next/server";
import prisma from "@/prisma";

export async function GET(req: Request) {
  const now = new Date();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User not logged in" }, { status: 401 });
  }

  // Convert to number
  const uid = Number(userId);

  // ---- TODAY COUNT ----
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  console.log(todayStart);
  const todayCount = await prisma.activityLogs.count({
    where: {
      userId: uid,
      createdAt: { gte: todayStart },
    },
  });

  console.log(todayCount);

  // ---- THIS WEEK COUNT ----
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const weekCount = await prisma.activity.count({
    where: {
      userId: uid,
      createdAt: { gte: weekStart },
    },
  });

  // ---- MONTH COUNT ----
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthCount = await prisma.activity.count({
    where: {
      userId: uid,
      createdAt: {
        gte: startOfMonth,
      },
    },
  });

  // ---- STREAK ----
  const activities = await prisma.activity.findMany({
    where: { userId: uid },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const dates = new Set(
    activities.map((a) => {
      const d = new Date(a.createdAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }),
  );

  while (dates.has(currentDate.getTime())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return NextResponse.json({
    todayCount,
    weekCount,
    monthCount,
    streak,
  });
}
