import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return local.charAt(0) + "*".repeat(local.length - 1) + "@" + domain;
  }
  const visible = Math.min(3, Math.ceil(local.length / 2));
  return local.slice(0, visible) + "*".repeat(local.length - visible) + "@" + domain;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "이름을 입력해주세요." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { name: name.trim() },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "해당 이름으로 등록된 계정을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      email: maskEmail(user.email),
    });
  } catch (error) {
    console.error("Find ID error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
