import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { parse } from "path";

export async function GET(request: NextRequest) {
  const ruchiId = request.nextUrl.searchParams.get("userId");
  console.log("ruchiId", ruchiId);
  const user = await prisma.user.findUnique({
    where: { id: parseInt(ruchiId || "0") },
  });

  return NextResponse.json({ user });
}
