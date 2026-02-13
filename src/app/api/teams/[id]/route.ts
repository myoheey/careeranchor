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

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true },
            },
          },
        },
        project: {
          select: {
            id: true,
            title: true,
            professorId: true,
            theme: true,
            currentPhase: true,
          },
        },
        stickyNotes: {
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Check access
    const hasAccess =
      team.project.professorId === session.id ||
      team.members.some((member: { userId: string }) => member.userId === session.id);

    if (!hasAccess) {
      return NextResponse.json(
        { error: "You do not have access to this team" },
        { status: 403 }
      );
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Get team error:", error);
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

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
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

    // Only the project professor can update team details
    if (team.project.professorId !== session.id) {
      return NextResponse.json(
        { error: "Only the project professor can update team details" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, topic } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (topic !== undefined) updateData.topic = topic;

    const updatedTeam = await prisma.team.update({
      where: { id },
      data: updateData,
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ team: updatedTeam });
  } catch (error) {
    console.error("Update team error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
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

    if (team.project.professorId !== session.id) {
      return NextResponse.json(
        { error: "Only the project professor can delete teams" },
        { status: 403 }
      );
    }

    await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Delete team error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const { action } = body;

    if (action !== "join" && action !== "leave") {
      return NextResponse.json(
        { error: "Invalid action. Supported actions: join, leave" },
        { status: 400 }
      );
    }

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, professorId: true },
        },
        members: true,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    if (action === "leave") {
      const member = team.members.find(
        (m: { userId: string }) => m.userId === session.id
      );

      if (!member) {
        return NextResponse.json(
          { error: "You are not a member of this team" },
          { status: 400 }
        );
      }

      await prisma.teamMember.delete({
        where: { id: member.id },
      });

      return NextResponse.json({ message: "Successfully left the team" });
    }

    // action === "join"
    // Check if user is already a member of this team
    const existingMember = team.members.find(
      (member: { userId: string }) => member.userId === session.id
    );

    if (existingMember) {
      return NextResponse.json(
        { error: "You are already a member of this team" },
        { status: 409 }
      );
    }

    // Check if user is already in another team in the same project
    const existingProjectMembership = await prisma.teamMember.findFirst({
      where: {
        userId: session.id,
        team: {
          projectId: team.project.id,
        },
      },
    });

    if (existingProjectMembership) {
      return NextResponse.json(
        { error: "You are already a member of another team in this project" },
        { status: 409 }
      );
    }

    const membership = await prisma.teamMember.create({
      data: {
        userId: session.id,
        teamId: id,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        team: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(
      { message: "Successfully joined the team", membership },
      { status: 201 }
    );
  } catch (error) {
    console.error("Join team error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
