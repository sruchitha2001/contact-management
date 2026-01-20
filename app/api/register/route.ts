import { NextResponse } from "next/server";
import prisma from "@/prisma"; // or the relative path to your prisma.ts

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        age: parseInt(body.age),
        occupation: body.occupation,
        phone: body.phone,
        city: body.city,
        Hobbies: body.hobbies,
        password: body.password, // Suggestion: Hash this!
      },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function GET() {
  try {
    console.log("API /register called");

    const users = await prisma.user.findMany({});
    console.log("Users fetched:", users.length);

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("REGISTER API ERROR 👉", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
