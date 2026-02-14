import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Preview group by join code
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Join code is required" }, { status: 400 });
    }

    const group = await prisma.assessmentGroup.findUnique({
      where: { joinCode: code.toUpperCase() },
      include: {
        professor: { select: { name: true } },
        _count: { select: { members: true } },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Invalid join code" }, { status: 404 });
    }

    return NextResponse.json({
      group: {
        id: group.id,
        title: group.title,
        description: group.description,
        professorName: group.professor.name,
        memberCount: group._count.members,
      },
    });
  } catch (error) {
    console.error("Preview group error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Join group by code
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.role !== "STUDENT") {
      return NextResponse.json({ error: "Only students can join groups" }, { status: 403 });
    }

    const body = await request.json();
    const { joinCode } = body;

    if (!joinCode) {
      return NextResponse.json({ error: "Join code is required" }, { status: 400 });
    }

    const group = await prisma.assessmentGroup.findUnique({
      where: { joinCode: joinCode.toUpperCase() },
    });

    if (!group) {
      return NextResponse.json({ error: "Invalid join code" }, { status: 404 });
    }

    // Check if already a member
    const existing = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: session.id, groupId: group.id } },
    });

    if (existing) {
      return NextResponse.json({ error: "Already a member of this group" }, { status: 409 });
    }

    await prisma.groupMember.create({
      data: { userId: session.id, groupId: group.id },
    });

    return NextResponse.json({ success: true, groupId: group.id });
  } catch (error) {
    console.error("Join group error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
