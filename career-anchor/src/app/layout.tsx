import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "커리어 앵커 검사 | Career Anchor Assessment",
  description: "Edgar Schein의 커리어 앵커 검사를 통해 나의 커리어 성향을 파악하고 AI 분석 리포트를 받아보세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
