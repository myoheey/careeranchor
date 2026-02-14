import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerAnchor - 커리어 앵커 진단 플랫폼",
  description: "40개 문항의 커리어 앵커 검사를 통해 자신의 핵심 가치와 커리어 성향을 파악하고, AI 맞춤형 진로 리포트를 받아보세요.",
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
