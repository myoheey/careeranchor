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
    const { name, topic, projectId } = body;

    if (!name || !projectId) {
      return NextResponse.json(
        { error: "Name and projectId are required" },
        { status: 400 }
      );
    }

    // Verify the project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Only the professor who owns the project or authenticated students can create teams
    if (
      session.role === "PROFESSOR" &&
      project.professorId !== session.id
    ) {
      return NextResponse.json(
        { error: "You do not have permission to create teams in this project" },
        { status: 403 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name,
        topic: topic || null,
        projectId,
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        project: {
          select: { id: true, title: true },
        },
      },
    });

    // If the creator is a student, automatically add them as a member
    if (session.role === "STUDENT") {
      await prisma.teamMember.create({
        data: {
          userId: session.id,
          teamId: team.id,
        },
      });

      // Re-fetch the team with the new member
      const updatedTeam = await prisma.team.findUnique({
        where: { id: team.id },
        include: {
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          project: {
            select: { id: true, title: true },
          },
        },
      });

      return NextResponse.json({ team: updatedTeam }, { status: 201 });
    }

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Create team error:", error);
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
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId query parameter is required" },
        { status: 400 }
      );
    }

    // Verify the project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        teams: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check access
    const hasAccess =
      project.professorId === session.id ||
      project.teams.some((team: { members: { userId: string }[] }) =>
        team.members.some((member: { userId: string }) => member.userId === session.id)
      );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "You do not have access to this project" },
        { status: 403 }
      );
    }

    const teams = await prisma.team.findMany({
      where: { projectId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: { stickyNotes: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ teams });
  } catch (error) {
    console.error("List teams error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
