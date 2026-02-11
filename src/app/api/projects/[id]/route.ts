import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        professor: {
          select: { id: true, name: true, email: true },
        },
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
        templates: {
          orderBy: { phase: "asc" },
        },
        _count: {
          select: { teams: true, templates: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check access: professor owns it, or student is a member
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

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (project.professorId !== session.id) {
      return NextResponse.json(
        { error: "Only the project owner can update this project" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, theme, currentPhase } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (theme !== undefined) {
      if (!["STARTUP", "JOB_CREATION", "PROBLEM_SOLVING"].includes(theme)) {
        return NextResponse.json(
          { error: "Theme must be STARTUP, JOB_CREATION, or PROBLEM_SOLVING" },
          { status: 400 }
        );
      }
      updateData.theme = theme;
    }
    if (currentPhase !== undefined) {
      if (typeof currentPhase !== "number" || currentPhase < 0) {
        return NextResponse.json(
          { error: "currentPhase must be a non-negative number" },
          { status: 400 }
        );
      }
      updateData.currentPhase = currentPhase;
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        professor: {
          select: { id: true, name: true, email: true },
        },
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
        _count: {
          select: { teams: true, templates: true },
        },
      },
    });

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
