import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Get group detail with results
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;

    const group = await prisma.assessmentGroup.findUnique({
      where: { id },
      include: {
        professor: { select: { id: true, name: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { joinedAt: "asc" },
        },
        careerAnchorResults: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check access
    const hasAccess =
      group.professorId === session.id ||
      group.members.some((m) => m.userId === session.id);

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Parse JSON results
    const results = group.careerAnchorResults.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name,
      results: JSON.parse(r.results),
      topAnchor: r.topAnchor,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({
      group: {
        id: group.id,
        title: group.title,
        description: group.description,
        joinCode: group.joinCode,
        professorId: group.professorId,
        professorName: group.professor.name,
        memberCount: group.members.length,
        resultCount: group.careerAnchorResults.length,
        createdAt: group.createdAt,
      },
      members: group.members.map((m) => ({
        userId: m.user.id,
        name: m.user.name,
        email: m.user.email,
        joinedAt: m.joinedAt,
      })),
      results,
      myResult: results.find((r) => r.userId === session.id) || null,
      role: session.role,
    });
  } catch (error) {
    console.error("Get group error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
