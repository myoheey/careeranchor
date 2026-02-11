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

    if (session.role !== "PROFESSOR") {
      return NextResponse.json(
        { error: "Only professors can create templates" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, phase, theme, projectId, isDefault, content } =
      body;

    if (!title || phase === undefined) {
      return NextResponse.json(
        { error: "Title and phase are required" },
        { status: 400 }
      );
    }

    if (typeof phase !== "number" || phase < 0) {
      return NextResponse.json(
        { error: "Phase must be a non-negative number" },
        { status: 400 }
      );
    }

    // If projectId is specified, verify the professor owns the project
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      if (project.professorId !== session.id) {
        return NextResponse.json(
          {
            error:
              "You do not have permission to create templates for this project",
          },
          { status: 403 }
        );
      }
    }

    const template = await prisma.template.create({
      data: {
        title,
        description: description || null,
        phase,
        theme: theme || null,
        projectId: projectId || null,
        isDefault: isDefault || false,
        createdBy: session.id,
        content: content ? JSON.stringify(content) : null,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Create template error:", error);
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
    const phaseParam = searchParams.get("phase");

    const where: Record<string, unknown> = {};

    if (projectId) {
      // Return templates for this project plus default templates
      where.OR = [{ projectId }, { isDefault: true }];
    }

    if (phaseParam !== null) {
      const phase = parseInt(phaseParam, 10);
      if (isNaN(phase)) {
        return NextResponse.json(
          { error: "Phase must be a valid number" },
          { status: 400 }
        );
      }
      where.phase = phase;
    }

    const templates = await prisma.template.findMany({
      where,
      include: {
        _count: {
          select: { stickyNotes: true },
        },
      },
      orderBy: [{ phase: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("List templates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
