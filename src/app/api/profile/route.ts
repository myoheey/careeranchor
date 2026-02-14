import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        gender: true,
        ageRange: true,
        job: true,
        industry: true,
        experience: true,
      },
    });

    return NextResponse.json({ profile: user });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { gender, ageRange, job, industry, experience } = body;

    await prisma.user.update({
      where: { id: session.id },
      data: {
        gender: gender || null,
        ageRange: ageRange || null,
        job: job || null,
        industry: industry || null,
        experience: experience || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
