import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerAnchor - 커리어 앵커 진단 플랫폼",
  description: "40개 문항의 커리어 앵커 검사를 통해 자신의 핵심 가치와 커리어 성향을 파악하세요. 그룹 분석과 시각화 리포트를 제공합니다.",
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
