import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Save or update career anchor results
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, results, topAnchor } = body;

    if (!projectId || !results || !topAnchor) {
      return NextResponse.json(
        { error: "projectId, results, and topAnchor are required" },
        { status: 400 }
      );
    }

    // Verify user has access to the project (must be a team member)
    const membership = await prisma.teamMember.findFirst({
      where: { userId: session.id, team: { projectId } },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of any team in this project" },
        { status: 403 }
      );
    }

    // Upsert: create or update
    const result = await prisma.careerAnchorResult.upsert({
      where: {
        userId_projectId: { userId: session.id, projectId },
      },
      create: {
        userId: session.id,
        projectId,
        results: JSON.stringify(results),
        topAnchor,
      },
      update: {
        results: JSON.stringify(results),
        topAnchor,
      },
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error("Save career anchor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get career anchor results for a project
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId query parameter is required" },
        { status: 400 }
      );
    }

    // Verify user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const hasAccess =
      project.professorId === session.id ||
      !!(await prisma.teamMember.findFirst({
        where: { userId: session.id, team: { projectId } },
      }));

    if (!hasAccess) {
      return NextResponse.json(
        { error: "You do not have access to this project" },
        { status: 403 }
      );
    }

    // Fetch all results for the project with user names
    const results = await prisma.careerAnchorResult.findMany({
      where: { projectId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // Parse JSON results
    const parsed = results.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name,
      userEmail: r.user.email,
      results: JSON.parse(r.results),
      topAnchor: r.topAnchor,
      createdAt: r.createdAt,
    }));

    // Also return current user's result separately for convenience
    const myResult = parsed.find((r) => r.userId === session.id) || null;

    return NextResponse.json({
      results: parsed,
      myResult,
      role: session.role,
    });
  } catch (error) {
    console.error("Get career anchor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
