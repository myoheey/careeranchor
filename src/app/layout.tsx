import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EntrePreneur LMS - 앙트러프러너십 학습 플랫폼",
  description:
    "창업, 창직, 문제해결을 위한 앙트러프러너십 학습 관리 시스템. 팀 기반 프로젝트 학습과 AI 기반 인사이트를 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
