"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) router.replace("/survey");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">Career Anchor</h1>
          <div className="flex gap-3">
            <Link href="/login" className="btn-outline text-sm">
              로그인
            </Link>
            <Link href="/register" className="btn-primary text-sm">
              회원가입
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center animate-fade-in">
          <div className="text-6xl mb-6">&#x1F9ED;</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            나의 커리어 앵커를<br />발견하세요
          </h2>
          <p className="text-lg text-slate-500 mb-8 leading-relaxed">
            Edgar Schein의 커리어 앵커 이론에 기반한 40문항 검사를 통해<br className="hidden sm:block" />
            자신의 커리어 성향을 파악하고, AI가 분석한 맞춤 리포트를 받아보세요.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="text-2xl mb-2">&#x1F4CB;</div>
              <h3 className="font-semibold text-slate-900 mb-1">40문항 검사</h3>
              <p className="text-sm text-slate-500">6점 리커트 척도로 8가지 커리어 앵커 유형을 측정합니다</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="text-2xl mb-2">&#x1F4CA;</div>
              <h3 className="font-semibold text-slate-900 mb-1">시각화 결과</h3>
              <p className="text-sm text-slate-500">레이더 차트와 바 차트로 나의 커리어 성향을 한눈에 확인</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <div className="text-2xl mb-2">&#x1F916;</div>
              <h3 className="font-semibold text-slate-900 mb-1">AI 분석 리포트</h3>
              <p className="text-sm text-slate-500">강점, 약점, 추천 직업을 담은 맞춤 분석 문서를 생성합니다</p>
            </div>
          </div>

          <Link href="/register" className="btn-primary text-base px-8 py-3">
            무료로 시작하기
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center">
        <p className="text-sm text-slate-400">Career Anchor Assessment</p>
      </footer>
    </div>
  );
}
