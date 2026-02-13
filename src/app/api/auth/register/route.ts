import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "이메일, 비밀번호, 이름, 역할을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    if (!["PROFESSOR", "STUDENT"].includes(role)) {
      return NextResponse.json(
        { error: "역할은 교수자 또는 학생이어야 합니다." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 등록된 이메일 주소입니다." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "PROFESSOR" | "STUDENT",
    });

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    const message =
      error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
