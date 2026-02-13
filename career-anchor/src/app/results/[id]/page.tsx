"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  careerAnchorCategories,
  anchorDescriptions,
} from "@/lib/career-anchor-data";

interface Result {
  id: string;
  scores: Record<string, number>;
  topAnchor: string;
  aiReport: string | null;
  createdAt: string;
  user: { name: string };
}

export default function ResultDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/survey`)
      .then((res) => {
        if (!res.ok) { router.replace("/login"); return null; }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        const found = data.results?.find((r: Result) => r.id === params.id);
        if (found) {
          setResult(found);
          setAiReport(found.aiReport);
        }
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const sortedCategories = useMemo(() => {
    if (!result) return [];
    return [...careerAnchorCategories].sort(
      (a, b) => (result.scores[b.key] || 0) - (result.scores[a.key] || 0)
    );
  }, [result]);

  const generateReport = async () => {
    if (!result) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId: result.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiReport(data.report);
      } else {
        const data = await res.json();
        alert(data.error || "AI 분석 생성에 실패했습니다.");
      }
    } catch {
      alert("서버 연결에 실패했습니다.");
    } finally {
      setGenerating(false);
    }
  };

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

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">결과를 찾을 수 없습니다.</p>
          <Link href="/results" className="btn-primary">목록으로</Link>
        </div>
      </div>
    );
  }

  const maxScore = 6;
  const scores = result.scores;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">Career Anchor</h1>
          <div className="flex items-center gap-3">
            <Link href="/results" className="text-sm text-slate-500 hover:text-slate-700">
              내 결과 목록
            </Link>
            <Link href="/survey" className="text-sm text-blue-600 font-medium hover:underline">
              새 검사
            </Link>
            <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-slate-600">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Results Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-semibold text-slate-900">커리어 앵커 검사 결과</h2>
            <span className="text-xs text-slate-400">
              {new Date(result.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-8">Career Anchor Assessment Results</p>

          {/* Bar chart */}
          <div className="mb-10">
            <div className="flex flex-col gap-3">
              {sortedCategories.map((cat) => {
                const score = scores[cat.key] || 0;
                const percentage = (score / maxScore) * 100;
                return (
                  <div key={cat.key} className="flex items-center gap-3">
                    <div className="w-28 text-right">
                      <span className="text-sm font-medium text-slate-900">{cat.name}</span>
                    </div>
                    <div className="flex-1 h-8 bg-slate-100 rounded-md overflow-hidden relative">
                      <div
                        className="h-full rounded-md transition-all duration-700 ease-out flex items-center justify-end pr-3"
                        style={{ width: `${Math.max(percentage, 8)}%`, backgroundColor: cat.color }}
                      >
                        <span className="text-xs font-semibold text-white">{score.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="w-10 text-right">
                      <span className="text-xs text-slate-400">/ {maxScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Radar chart */}
          <div className="flex justify-center mb-10">
            <div className="relative w-72 h-72">
              {[1, 2, 3, 4, 5, 6].map((ring) => (
                <div
                  key={ring}
                  className="absolute rounded-full border border-slate-200"
                  style={{
                    width: `${(ring / 6) * 100}%`,
                    height: `${(ring / 6) * 100}%`,
                    left: `${50 - (ring / 6) * 50}%`,
                    top: `${50 - (ring / 6) * 50}%`,
                  }}
                />
              ))}
              {careerAnchorCategories.map((cat, i) => {
                const score = scores[cat.key] || 0;
                const angle = (i / careerAnchorCategories.length) * 2 * Math.PI - Math.PI / 2;
                const radius = (score / maxScore) * 48;
                const labelRadius = 55;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                const labelX = 50 + labelRadius * Math.cos(angle);
                const labelY = 50 + labelRadius * Math.sin(angle);

                return (
                  <div key={cat.key}>
                    <div
                      className="absolute w-3 h-3 rounded-full border-2 border-white shadow-sm z-10"
                      style={{ backgroundColor: cat.color, left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                    />
                    <div
                      className="absolute text-[10px] font-medium text-slate-500 whitespace-nowrap"
                      style={{ left: `${labelX}%`, top: `${labelY}%`, transform: "translate(-50%, -50%)" }}
                    >
                      {cat.name}
                    </div>
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                      <line x1="50" y1="50" x2={x} y2={y} stroke={cat.color} strokeWidth="1.5" opacity="0.4" />
                    </svg>
                  </div>
                );
              })}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <polygon
                  points={careerAnchorCategories
                    .map((cat, i) => {
                      const score = scores[cat.key] || 0;
                      const angle = (i / careerAnchorCategories.length) * 2 * Math.PI - Math.PI / 2;
                      const radius = (score / maxScore) * 48;
                      return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`;
                    })
                    .join(" ")}
                  fill="rgba(37, 99, 235, 0.12)"
                  stroke="rgba(37, 99, 235, 0.5)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>

          {/* Top 3 */}
          <div className="space-y-3 mb-6">
            <h3 className="text-base font-semibold text-slate-900">상위 3개 커리어 앵커</h3>
            {sortedCategories.slice(0, 3).map((cat, i) => (
              <div
                key={cat.key}
                className="flex items-start gap-3 p-4 rounded-lg bg-white border border-slate-200"
                style={{ borderLeftWidth: "4px", borderLeftColor: cat.color }}
              >
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-semibold shrink-0"
                  style={{ backgroundColor: cat.color }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900">{cat.name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-md font-semibold"
                      style={{ color: cat.color, backgroundColor: `${cat.color}12` }}
                    >
                      {(scores[cat.key] || 0).toFixed(1)}점
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{anchorDescriptions[cat.key]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Report Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">AI 커리어 분석 리포트</h2>
              <p className="text-sm text-slate-500 mt-1">
                ChatGPT가 분석한 강점, 약점, 추천 직업 리포트
              </p>
            </div>
            {!aiReport && (
              <button
                onClick={generateReport}
                disabled={generating}
                className="btn-primary disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    분석 중...
                  </>
                ) : (
                  "AI 분석 생성"
                )}
              </button>
            )}
          </div>

          {generating && !aiReport && (
            <div className="text-center py-12">
              <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-slate-500">AI가 커리어 분석 리포트를 작성하고 있습니다...</p>
              <p className="text-sm text-slate-400 mt-1">약 10-20초 소요됩니다</p>
            </div>
          )}

          {aiReport && (
            <div className="prose prose-slate max-w-none">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 sm:p-8">
                {aiReport.split("\n").map((line, i) => {
                  if (line.startsWith("# ")) {
                    return <h1 key={i} className="text-xl font-bold text-slate-900 mb-4 mt-0">{line.slice(2)}</h1>;
                  }
                  if (line.startsWith("## ")) {
                    return <h2 key={i} className="text-lg font-semibold text-slate-900 mt-6 mb-3">{line.slice(3)}</h2>;
                  }
                  if (line.startsWith("### ")) {
                    return <h3 key={i} className="text-base font-semibold text-slate-800 mt-4 mb-2">{line.slice(4)}</h3>;
                  }
                  if (line.startsWith("---")) {
                    return <hr key={i} className="my-4 border-slate-300" />;
                  }
                  if (line.startsWith("- ") || line.startsWith("* ")) {
                    return (
                      <div key={i} className="flex gap-2 mb-1.5 ml-2">
                        <span className="text-slate-400 shrink-0">&#x2022;</span>
                        <p className="text-sm text-slate-700 leading-relaxed">{renderBold(line.slice(2))}</p>
                      </div>
                    );
                  }
                  if (line.match(/^\d+\.\s/)) {
                    const content = line.replace(/^\d+\.\s/, "");
                    return (
                      <div key={i} className="flex gap-2 mb-1.5 ml-2">
                        <span className="text-slate-500 shrink-0 text-sm font-medium">{line.match(/^\d+/)?.[0]}.</span>
                        <p className="text-sm text-slate-700 leading-relaxed">{renderBold(content)}</p>
                      </div>
                    );
                  }
                  if (line.trim() === "") {
                    return <div key={i} className="h-2" />;
                  }
                  return <p key={i} className="text-sm text-slate-700 leading-relaxed mb-2">{renderBold(line)}</p>;
                })}
              </div>
            </div>
          )}

          {!aiReport && !generating && (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
              <div className="text-4xl mb-3">&#x1F916;</div>
              <h3 className="font-semibold text-slate-900 mb-2">AI 분석 리포트를 생성해보세요</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                검사 결과를 기반으로 ChatGPT가 강점, 약점, 추천 직업을 분석한<br />
                맞춤 커리어 리포트를 생성합니다.
              </p>
            </div>
          )}
        </div>

        {/* Print button */}
        {aiReport && (
          <div className="flex justify-center gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="btn-outline"
            >
              &#x1F5A8;&#xFE0F; 인쇄 / PDF 저장
            </button>
            <Link href="/survey" className="btn-primary">
              다시 검사하기
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-slate-900">{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
