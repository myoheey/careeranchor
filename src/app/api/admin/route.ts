import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { role: true },
  });
  if (!user || user.role !== "admin") return null;
  return session;
}

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [totalUsers, totalResults, totalWithAiReport, users] = await Promise.all([
      prisma.user.count(),
      prisma.careerAnchorResult.count(),
      prisma.careerAnchorResult.count({ where: { aiReport: { not: null } } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          gender: true,
          ageRange: true,
          job: true,
          industry: true,
          experience: true,
          createdAt: true,
          careerAnchorResults: {
            select: {
              topAnchor: true,
              results: true,
              aiReport: true,
              createdAt: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalResults,
        totalWithAiReport,
        completionRate: totalUsers > 0 ? Math.round((totalResults / totalUsers) * 100) : 0,
      },
      users: users.map((u) => ({
        ...u,
        hasResult: u.careerAnchorResults.length > 0,
        topAnchor: u.careerAnchorResults[0]?.topAnchor || null,
        hasAiReport: !!u.careerAnchorResults[0]?.aiReport,
        resultDate: u.careerAnchorResults[0]?.createdAt || null,
      })),
    });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
