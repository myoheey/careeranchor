import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateJoinCode } from "@/lib/utils";

// List assessment groups
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.role === "PROFESSOR") {
      const groups = await prisma.assessmentGroup.findMany({
        where: { professorId: session.id },
        include: {
          _count: { select: { members: true, careerAnchorResults: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ groups });
    } else {
      const memberships = await prisma.groupMember.findMany({
        where: { userId: session.id },
        include: {
          group: {
            include: {
              professor: { select: { name: true } },
              _count: { select: { members: true, careerAnchorResults: true } },
            },
          },
        },
        orderBy: { joinedAt: "desc" },
      });
      const groups = memberships.map((m) => m.group);
      return NextResponse.json({ groups });
    }
  } catch (error) {
    console.error("List groups error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Create assessment group (professor only)
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.role !== "PROFESSOR") {
      return NextResponse.json({ error: "Only professors can create groups" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const group = await prisma.assessmentGroup.create({
      data: {
        title,
        description: description || null,
        joinCode: generateJoinCode(),
        professorId: session.id,
      },
    });

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    console.error("Create group error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
