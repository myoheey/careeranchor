"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  careerAnchorQuestions,
  careerAnchorCategories,
  anchorDescriptions,
} from "@/lib/career-anchor-data";

const LIKERT_LABELS = [
  "전혀 아니다",
  "아니다",
  "약간 아니다",
  "약간 그렇다",
  "그렇다",
  "매우 그렇다",
];

const QUESTIONS_PER_PAGE = 5;

export default function SurveyPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const totalQuestions = careerAnchorQuestions.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) { router.replace("/login"); return; }
        return res.json();
      })
      .then((data) => { if (data) setUser(data.user); })
      .catch(() => router.replace("/login"))
      .finally(() => setAuthLoading(false));
  }, [router]);

  const currentQuestions = useMemo(() => {
    const start = currentPage * QUESTIONS_PER_PAGE;
    return careerAnchorQuestions.slice(start, start + QUESTIONS_PER_PAGE).map(
      (q, i) => ({ index: start + i, text: q })
    );
  }, [currentPage]);

  const canGoNext = useMemo(() => {
    return currentQuestions.every((q) => answers[q.index] !== undefined);
  }, [currentQuestions, answers]);

  const allAnswered = answeredCount === totalQuestions;

  const handleAnswer = useCallback((questionIndex: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  }, []);

  const results = useMemo(() => {
    if (!allAnswered) return null;
    const categoryResults: Record<string, number> = {};
    for (const cat of careerAnchorCategories) {
      const sum = cat.questions.reduce((acc, qIdx) => acc + (answers[qIdx] || 0), 0);
      categoryResults[cat.key] = Math.round((sum / cat.questions.length) * 100) / 100;
    }
    return categoryResults;
  }, [answers, allAnswered]);

  const sortedCategories = useMemo(() => {
    if (!results) return [];
    return [...careerAnchorCategories].sort(
      (a, b) => (results[b.key] || 0) - (results[a.key] || 0)
    );
  }, [results]);

  const handleSubmit = useCallback(() => {
    if (!results) return;
    setShowResults(true);
  }, [results]);

  const handleSave = useCallback(async () => {
    if (!results) return;
    setSaving(true);

    const topAnchor = [...careerAnchorCategories].sort(
      (a, b) => (results[b.key] || 0) - (results[a.key] || 0)
    )[0].key;

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scores: results, topAnchor }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/results/${data.result.id}`);
      }
    } catch {
      // error
    } finally {
      setSaving(false);
    }
  }, [results, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const maxScore = 6;

  // Results view
  if (showResults && results) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-900">Career Anchor</h1>
            <div className="flex items-center gap-3">
              <Link href="/results" className="text-sm text-slate-500 hover:text-slate-700">
                내 결과 목록
              </Link>
              <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-slate-600">
                로그아웃
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
          <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              {user?.name} 님의 커리어 앵커 검사 결과
            </h2>
            <p className="text-sm text-slate-500 mb-8">Career Anchor Assessment Results</p>

            {/* Bar chart */}
            <div className="mb-10">
              <div className="flex flex-col gap-3">
                {sortedCategories.map((cat) => {
                  const score = results[cat.key] || 0;
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
                  const score = results[cat.key] || 0;
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
                        const score = results[cat.key] || 0;
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

            {/* Top 3 anchors */}
            <div className="space-y-3">
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
                        {(results[cat.key] || 0).toFixed(1)}점
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {anchorDescriptions[cat.key]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => { setShowResults(false); setAnswers({}); setCurrentPage(0); }}
              className="btn-outline"
            >
              다시 검사하기
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary px-8 disabled:opacity-60"
            >
              {saving ? "저장 중..." : "결과 저장 & AI 분석 받기"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Survey view
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">Career Anchor</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{user?.name}</span>
            <Link href="/results" className="text-sm text-slate-500 hover:text-slate-700">
              내 결과
            </Link>
            <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-slate-600">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">커리어 앵커 검사</h2>
          <p className="text-slate-500">각 문항에 대해 자신에게 해당하는 정도를 선택해주세요.</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">
              진행률: {answeredCount} / {totalQuestions}
            </span>
            <span className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-lg overflow-hidden">
            <div
              className="h-full rounded-lg transition-all duration-300 bg-blue-600"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-slate-400">Page {currentPage + 1} / {totalPages}</span>
            <span className="text-xs text-slate-400">1=전혀 아니다 ~ 6=매우 그렇다</span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4 mb-6">
          {currentQuestions.map((q) => (
            <div key={q.index} className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-start gap-3 mb-4">
                <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold">
                  {q.index + 1}
                </span>
                <p className="text-sm font-medium text-slate-900 pt-0.5 leading-relaxed">
                  {q.text}
                </p>
              </div>
              <div className="grid grid-cols-6 gap-1.5 ml-10">
                {LIKERT_LABELS.map((label, i) => {
                  const value = i + 1;
                  const isSelected = answers[q.index] === value;
                  return (
                    <button
                      key={value}
                      onClick={() => handleAnswer(q.index, value)}
                      className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg border transition-colors text-center ${
                        isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <span className={`text-lg font-semibold ${isSelected ? "text-blue-600" : "text-slate-400"}`}>
                        {value}
                      </span>
                      <span className={`text-[10px] leading-tight ${isSelected ? "text-blue-600 font-medium" : "text-slate-400"}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed"
          >
            이전
          </button>

          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === currentPage ? "bg-blue-600" : "bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>

          {currentPage < totalPages - 1 ? (
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={!canGoNext}
              className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              결과 보기
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
