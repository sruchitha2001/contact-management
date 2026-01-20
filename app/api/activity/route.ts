import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { parse } from "path";

export async function GET(request: NextRequest) {
  const ruchiId = request.nextUrl.searchParams.get("userId");
  console.log("ruchiId", ruchiId);
  const activities = await prisma.activity.findMany({
    where: { userId: parseInt(ruchiId || "0") },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      dates: true, // 🔥 THIS LINE FIXES CALENDAR
    },
  });

  return NextResponse.json({ activities });
}

export async function POST(req: Request) {
  const { userId, title } = await req.json();

  const activity = await prisma.activity.create({
    data: {
      title,
      dates: [], // ✅ empty array initially
      userId: userId,
    },
  });

  return NextResponse.json(activity);
}

export async function PUT(req: Request) {
  const { id, title } = await req.json();

  const activity = await prisma.activity.update({
    where: { id },
    data: { title },
  });

  return NextResponse.json(activity);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.activityLogs.deleteMany({
    where: { activityId: id },
  });

  await prisma.activity.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
