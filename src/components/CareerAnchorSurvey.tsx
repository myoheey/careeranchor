"use client";

import { useState, useMemo, useCallback } from "react";
import {
  careerAnchorQuestions,
  careerAnchorCategories,
} from "@/lib/phase-data";

interface CareerAnchorSurveyProps {
  onComplete: (results: Record<string, number>) => void;
}

const LIKERT_LABELS = [
  "전혀 아니다",
  "아니다",
  "약간 아니다",
  "약간 그렇다",
  "그렇다",
  "매우 그렇다",
];

const QUESTIONS_PER_PAGE = 5;

export default function CareerAnchorSurvey({
  onComplete,
}: CareerAnchorSurveyProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = careerAnchorQuestions.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const currentQuestions = useMemo(() => {
    const start = currentPage * QUESTIONS_PER_PAGE;
    return careerAnchorQuestions.slice(start, start + QUESTIONS_PER_PAGE).map(
      (q, i) => ({
        index: start + i,
        text: q,
      })
    );
  }, [currentPage]);

  const canGoNext = useMemo(() => {
    return currentQuestions.every((q) => answers[q.index] !== undefined);
  }, [currentQuestions, answers]);

  const allAnswered = answeredCount === totalQuestions;

  const handleAnswer = useCallback((questionIndex: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  }, []);

  // Calculate results by category
  const results = useMemo(() => {
    if (!allAnswered) return null;

    const categoryResults: Record<string, number> = {};
    for (const cat of careerAnchorCategories) {
      const sum = cat.questions.reduce(
        (acc, qIdx) => acc + (answers[qIdx] || 0),
        0
      );
      const avg = sum / cat.questions.length;
      categoryResults[cat.key] = Math.round(avg * 100) / 100;
    }
    return categoryResults;
  }, [answers, allAnswered]);

  const sortedCategories = useMemo(() => {
    if (!results) return [];
    return [...careerAnchorCategories].sort(
      (a, b) => (results[b.key] || 0) - (results[a.key] || 0)
    );
  }, [results]);

  const maxScore = 6;

  const handleSubmit = useCallback(() => {
    if (!results) return;
    setShowResults(true);
  }, [results]);

  const handleComplete = useCallback(() => {
    if (!results) return;
    onComplete(results);
  }, [results, onComplete]);

  // Results view
  if (showResults && results) {
    return (
      <div className="animate-fade-in">
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            커리어 앵커 검사 결과
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Career Anchor Assessment Results
          </p>

          {/* Radar-like chart using CSS */}
          <div className="mb-8">
            <div className="flex flex-col gap-3">
              {sortedCategories.map((cat) => {
                const score = results[cat.key] || 0;
                const percentage = (score / maxScore) * 100;
                return (
                  <div key={cat.key} className="flex items-center gap-3">
                    <div className="w-28 text-right">
                      <span className="text-sm font-medium text-slate-700">
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-3"
                        style={{
                          width: `${Math.max(percentage, 5)}%`,
                          backgroundColor: cat.color,
                        }}
                      >
                        <span className="text-xs font-bold text-white drop-shadow-sm">
                          {score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="w-10 text-right">
                      <span className="text-xs text-slate-400">
                        / {maxScore}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Radar chart (octagon) using CSS */}
          <div className="flex justify-center mb-8">
            <div className="relative w-64 h-64">
              {/* Background rings */}
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
              {/* Data points and labels */}
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
                    {/* Dot */}
                    <div
                      className="absolute w-3 h-3 rounded-full border-2 border-white shadow-md z-10"
                      style={{
                        backgroundColor: cat.color,
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                    {/* Label */}
                    <div
                      className="absolute text-[9px] font-medium text-slate-500 whitespace-nowrap"
                      style={{
                        left: `${labelX}%`,
                        top: `${labelY}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {cat.name}
                    </div>
                    {/* Line from center to dot */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 100 100"
                    >
                      <line
                        x1="50"
                        y1="50"
                        x2={x}
                        y2={y}
                        stroke={cat.color}
                        strokeWidth="1.5"
                        opacity="0.4"
                      />
                    </svg>
                  </div>
                );
              })}
              {/* Filled polygon */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
              >
                <polygon
                  points={careerAnchorCategories
                    .map((cat, i) => {
                      const score = results[cat.key] || 0;
                      const angle =
                        (i / careerAnchorCategories.length) * 2 * Math.PI -
                        Math.PI / 2;
                      const radius = (score / maxScore) * 48;
                      const x = 50 + radius * Math.cos(angle);
                      const y = 50 + radius * Math.sin(angle);
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  fill="rgba(79, 70, 229, 0.15)"
                  stroke="rgba(79, 70, 229, 0.6)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>

          {/* Top 3 anchors */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800">
              상위 3개 커리어 앵커
            </h3>
            {sortedCategories.slice(0, 3).map((cat, i) => (
              <div
                key={cat.key}
                className="flex items-start gap-3 p-4 rounded-xl border border-slate-100"
                style={{
                  backgroundColor: `${cat.color}08`,
                  borderLeftWidth: "4px",
                  borderLeftColor: cat.color,
                }}
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: cat.color }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800">
                      {cat.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white font-semibold" style={{ color: cat.color }}>
                      {(results[cat.key] || 0).toFixed(1)}점
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {getAnchorDescription(cat.key)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button onClick={handleComplete} className="btn-primary text-base px-8 py-3">
            결과 저장하고 계속하기
          </button>
        </div>
      </div>
    );
  }

  // Survey view
  return (
    <div className="animate-fade-in">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">
            진행률: {answeredCount} / {totalQuestions}
          </span>
          <span className="text-sm font-medium text-indigo-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-slate-400">
            Page {currentPage + 1} / {totalPages}
          </span>
          <span className="text-xs text-slate-400">
            6점 척도 (1=전혀 아니다, 6=매우 그렇다)
          </span>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {currentQuestions.map((q) => (
          <div key={q.index} className="card p-5">
            <div className="flex items-start gap-3 mb-4">
              <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                {q.index + 1}
              </span>
              <p className="text-sm font-medium text-slate-800 pt-0.5 leading-relaxed">
                {q.text}
              </p>
            </div>

            {/* Likert scale */}
            <div className="grid grid-cols-6 gap-1.5 ml-10">
              {LIKERT_LABELS.map((label, i) => {
                const value = i + 1;
                const isSelected = answers[q.index] === value;
                return (
                  <button
                    key={value}
                    onClick={() => handleAnswer(q.index, value)}
                    className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-2 transition-all text-center ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 shadow-sm"
                        : "border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30"
                    }`}
                  >
                    <span
                      className={`text-lg font-bold ${
                        isSelected ? "text-indigo-600" : "text-slate-400"
                      }`}
                    >
                      {value}
                    </span>
                    <span
                      className={`text-[10px] leading-tight ${
                        isSelected
                          ? "text-indigo-600 font-medium"
                          : "text-slate-400"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          이전
        </button>

        <div className="flex gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentPage
                  ? "bg-indigo-500 scale-125"
                  : "bg-slate-200 hover:bg-slate-300"
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
            className="btn-accent text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            결과 보기
          </button>
        )}
      </div>
    </div>
  );
}

function getAnchorDescription(key: string): string {
  const descriptions: Record<string, string> = {
    TF: "특정 분야의 전문성을 깊이 있게 발전시키는 것에 가치를 둡니다. 자신의 전문 분야에서 최고가 되는 것을 목표로 하며, 기술적 역량의 성장이 핵심 동기입니다.",
    GM: "조직을 이끌고 관리하는 역할에서 보람을 찾습니다. 높은 직위와 영향력을 추구하며, 팀의 성과를 만들어내는 리더십이 핵심 역량입니다.",
    AU: "자유롭고 독립적인 업무 환경을 중시합니다. 규칙에 얽매이지 않고 자신만의 방식으로 일하는 것을 선호하며, 창의적이고 자율적인 환경에서 능력을 발휘합니다.",
    SE: "안정적이고 예측 가능한 환경을 추구합니다. 고용 안정성과 재정적 보장을 중요하게 여기며, 장기적인 안정을 기반으로 경력을 쌓아갑니다.",
    EC: "새로운 것을 창조하고 사업을 만들어내는 것에 열정이 있습니다. 혁신적인 아이디어를 실현시키고 무에서 유를 창조하는 기업가 정신이 핵심입니다.",
    SV: "사회에 기여하고 다른 사람들을 돕는 것에 큰 보람을 느낍니다. 세상을 더 나은 곳으로 만들고자 하는 봉사 정신과 사회적 가치 실현이 핵심 동기입니다.",
    CH: "끊임없이 새로운 도전을 추구합니다. 불가능해 보이는 일에 도전하고 경쟁에서 이기는 것에 동기부여를 받으며, 극한 상황에서 능력을 발휘합니다.",
    LS: "일과 삶의 균형을 가장 중요하게 생각합니다. 가족과의 시간, 취미, 여가를 충분히 즐길 수 있는 유연한 근무 환경을 추구합니다.",
  };
  return descriptions[key] || "";
}
