import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateJoinCode } from "@/lib/utils";

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
        { error: "Only professors can create projects" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, theme } = body;

    if (!title || !theme) {
      return NextResponse.json(
        { error: "Title and theme are required" },
        { status: 400 }
      );
    }

    if (!["STARTUP", "JOB_CREATION", "PROBLEM_SOLVING"].includes(theme)) {
      return NextResponse.json(
        { error: "Theme must be STARTUP, JOB_CREATION, or PROBLEM_SOLVING" },
        { status: 400 }
      );
    }

    let joinCode = generateJoinCode();

    // Ensure join code is unique
    let existing = await prisma.project.findUnique({
      where: { joinCode },
    });
    while (existing) {
      joinCode = generateJoinCode();
      existing = await prisma.project.findUnique({
        where: { joinCode },
      });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        theme,
        joinCode,
        professorId: session.id,
      },
      include: {
        professor: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    let projects;

    if (session.role === "PROFESSOR") {
      projects = await prisma.project.findMany({
        where: { professorId: session.id },
        include: {
          professor: {
            select: { id: true, name: true, email: true },
          },
          teams: {
            include: {
              members: true,
            },
          },
          _count: {
            select: { teams: true, templates: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // STUDENT: return projects they are a member of through teams
      projects = await prisma.project.findMany({
        where: {
          teams: {
            some: {
              members: {
                some: {
                  userId: session.id,
                },
              },
            },
          },
        },
        include: {
          professor: {
            select: { id: true, name: true, email: true },
          },
          teams: {
            include: {
              members: true,
            },
          },
          _count: {
            select: { teams: true, templates: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("List projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
