import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const activityId = parseInt(id);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { error: "Invalid activity id" },
        { status: 400 },
      );
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        activityLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 },
      );
    }

    const logs = activity.activityLogs;

    let streak = 0;
    let prev: Date | null = null;

    for (const log of logs) {
      const current = new Date(log.createdAt);
      if (!prev) streak++;
      else {
        const diff =
          (prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
        if (Math.floor(diff) === 1) streak++;
        else break;
      }
      prev = current;
    }

    return NextResponse.json({
      title: activity.title,
      logs: logs.map((l) => l.createdAt),
      total: logs.length,
      streak,
    });
  } catch (error) {
    console.error("Activity stats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
