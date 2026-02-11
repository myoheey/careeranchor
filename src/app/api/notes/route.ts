import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, color, posX, posY, width, height, templateId, teamId } =
      body;

    if (!content || posX === undefined || posY === undefined || !templateId) {
      return NextResponse.json(
        { error: "Content, posX, posY, and templateId are required" },
        { status: 400 }
      );
    }

    // Verify the template exists
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // If teamId is provided, verify the team exists and user is a member
    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: true,
          project: {
            select: { professorId: true },
          },
        },
      });

      if (!team) {
        return NextResponse.json(
          { error: "Team not found" },
          { status: 404 }
        );
      }

      const isMember = team.members.some(
        (member: { userId: string }) => member.userId === session.id
      );
      const isProfessor = team.project.professorId === session.id;

      if (!isMember && !isProfessor) {
        return NextResponse.json(
          { error: "You must be a team member or the project professor to add notes" },
          { status: 403 }
        );
      }
    }

    const stickyNote = await prisma.stickyNote.create({
      data: {
        content,
        color: color || "#FEF3C7",
        posX: parseFloat(String(posX)),
        posY: parseFloat(String(posY)),
        width: width ? parseFloat(String(width)) : 200,
        height: height ? parseFloat(String(height)) : 150,
        templateId,
        teamId: teamId || null,
        authorId: session.id,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
        team: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ note: stickyNote }, { status: 201 });
  } catch (error) {
    console.error("Create sticky note error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("templateId");
    const teamId = searchParams.get("teamId");

    if (!templateId) {
      return NextResponse.json(
        { error: "templateId query parameter is required" },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = { templateId };

    if (teamId) {
      where.teamId = teamId;
    }

    const notes = await prisma.stickyNote.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true },
        },
        team: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("List sticky notes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
