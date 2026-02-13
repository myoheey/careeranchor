"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { careerAnchorCategories } from "@/lib/career-anchor-data";

interface Result {
  id: string;
  scores: Record<string, number>;
  topAnchor: string;
  aiReport: string | null;
  createdAt: string;
}

export default function ResultsListPage() {
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/survey").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([meData, surveyData]) => {
        if (!meData) { router.replace("/login"); return; }
        setUser(meData.user);
        if (surveyData) setResults(surveyData.results || []);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const getTopAnchorName = (key: string) => {
    return careerAnchorCategories.find((c) => c.key === key)?.name || key;
  };

  const getTopAnchorColor = (key: string) => {
    return careerAnchorCategories.find((c) => c.key === key)?.color || "#6b7280";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">Career Anchor</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{user?.name}</span>
            <Link href="/survey" className="text-sm text-blue-600 font-medium hover:underline">
              새 검사
            </Link>
            <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-slate-600">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">내 검사 결과</h2>
        <p className="text-slate-500 mb-8">지금까지 실시한 커리어 앵커 검사 결과입니다.</p>

        {results.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
            <div className="text-4xl mb-4">&#x1F4CB;</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">아직 검사 결과가 없습니다</h3>
            <p className="text-sm text-slate-500 mb-6">커리어 앵커 검사를 실시하고 AI 분석을 받아보세요.</p>
            <Link href="/survey" className="btn-primary">
              검사 시작하기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/results/${result.id}`}
                className="block bg-white border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: getTopAnchorColor(result.topAnchor) }}
                    >
                      {getTopAnchorName(result.topAnchor)}
                    </span>
                    {result.aiReport && (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        AI 분석 완료
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(result.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Mini bar chart */}
                <div className="flex gap-1.5">
                  {[...careerAnchorCategories]
                    .sort((a, b) => (result.scores[b.key] || 0) - (result.scores[a.key] || 0))
                    .slice(0, 4)
                    .map((cat) => (
                      <div key={cat.key} className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-500">{cat.name}</span>
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${((result.scores[cat.key] || 0) / 6) * 100}%`,
                              backgroundColor: cat.color,
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-slate-600">
                          {(result.scores[cat.key] || 0).toFixed(1)}
                        </span>
                      </div>
                    ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
