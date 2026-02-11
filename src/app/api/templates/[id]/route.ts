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

    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        stickyNotes: {
          include: {
            author: {
              select: { id: true, name: true },
            },
            team: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        project: {
          select: { id: true, title: true, professorId: true },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Get template error:", error);
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

    if (session.role !== "PROFESSOR") {
      return NextResponse.json(
        { error: "Only professors can update templates" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        project: {
          select: { professorId: true },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Verify ownership: either the template creator or the project professor
    if (
      template.createdBy !== session.id &&
      template.project?.professorId !== session.id
    ) {
      return NextResponse.json(
        { error: "You do not have permission to update this template" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, phase, theme, isDefault, content } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (phase !== undefined) {
      if (typeof phase !== "number" || phase < 0) {
        return NextResponse.json(
          { error: "Phase must be a non-negative number" },
          { status: 400 }
        );
      }
      updateData.phase = phase;
    }
    if (theme !== undefined) updateData.theme = theme;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (content !== undefined) {
      updateData.content =
        content !== null ? JSON.stringify(content) : null;
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ template: updatedTemplate });
  } catch (error) {
    console.error("Update template error:", error);
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

    if (session.role !== "PROFESSOR") {
      return NextResponse.json(
        { error: "Only professors can delete templates" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        project: {
          select: { professorId: true },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (
      template.createdBy !== session.id &&
      template.project?.professorId !== session.id
    ) {
      return NextResponse.json(
        { error: "You do not have permission to delete this template" },
        { status: 403 }
      );
    }

    await prisma.template.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Delete template error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
