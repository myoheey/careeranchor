import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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

    const note = await prisma.stickyNote.findUnique({
      where: { id },
      include: {
        template: {
          include: {
            project: {
              select: { professorId: true },
            },
          },
        },
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Sticky note not found" },
        { status: 404 }
      );
    }

    // Check permission: author, team member, or project professor
    const isAuthor = note.authorId === session.id;
    const isProfessor =
      note.template.project?.professorId === session.id;
    const isTeamMember = note.team?.members.some(
      (member: { userId: string }) => member.userId === session.id
    );

    if (!isAuthor && !isProfessor && !isTeamMember) {
      return NextResponse.json(
        { error: "You do not have permission to update this note" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content, color, posX, posY, width, height } = body;

    const updateData: Record<string, unknown> = {};
    if (content !== undefined) updateData.content = content;
    if (color !== undefined) updateData.color = color;
    if (posX !== undefined) updateData.posX = parseFloat(String(posX));
    if (posY !== undefined) updateData.posY = parseFloat(String(posY));
    if (width !== undefined) updateData.width = parseFloat(String(width));
    if (height !== undefined) updateData.height = parseFloat(String(height));

    const updatedNote = await prisma.stickyNote.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true },
        },
        team: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error("Update sticky note error:", error);
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

    const note = await prisma.stickyNote.findUnique({
      where: { id },
      include: {
        template: {
          include: {
            project: {
              select: { professorId: true },
            },
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Sticky note not found" },
        { status: 404 }
      );
    }

    // Only the author or the project professor can delete a note
    const isAuthor = note.authorId === session.id;
    const isProfessor =
      note.template.project?.professorId === session.id;

    if (!isAuthor && !isProfessor) {
      return NextResponse.json(
        { error: "You do not have permission to delete this note" },
        { status: 403 }
      );
    }

    await prisma.stickyNote.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Sticky note deleted successfully" });
  } catch (error) {
    console.error("Delete sticky note error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
