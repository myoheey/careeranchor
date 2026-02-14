import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { results, topAnchor } = body;

    if (!results || !topAnchor) {
      return NextResponse.json(
        { error: "results and topAnchor are required" },
        { status: 400 }
      );
    }

    const result = await prisma.careerAnchorResult.upsert({
      where: { userId: session.id },
      create: {
        userId: session.id,
        results: JSON.stringify(results),
        topAnchor,
      },
      update: {
        results: JSON.stringify(results),
        topAnchor,
        aiReport: null,
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

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const result = await prisma.careerAnchorResult.findUnique({
      where: { userId: session.id },
    });

    if (!result) {
      return NextResponse.json({ result: null });
    }

    return NextResponse.json({
      result: {
        id: result.id,
        results: JSON.parse(result.results),
        topAnchor: result.topAnchor,
        aiReport: result.aiReport ? JSON.parse(result.aiReport) : null,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get career anchor error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
