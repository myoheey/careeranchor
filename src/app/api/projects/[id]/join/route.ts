import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
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
    const body = await request.json();
    const { joinCode } = body;

    if (!joinCode) {
      return NextResponse.json(
        { error: "Join code is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        teams: {
          include: {
            members: true,
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

    if (project.joinCode !== joinCode) {
      return NextResponse.json(
        { error: "Invalid join code" },
        { status: 403 }
      );
    }

    // Check if user is already a member of any team in this project
    const existingMembership = project.teams.some(
      (team: { members: { userId: string }[] }) =>
        team.members.some((member: { userId: string }) => member.userId === session.id)
    );

    if (existingMembership) {
      return NextResponse.json(
        { error: "You are already a member of a team in this project" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      message: "Join code verified. You can now join a team in this project.",
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        theme: project.theme,
        currentPhase: project.currentPhase,
      },
    });
  } catch (error) {
    console.error("Join project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
