"use client";

import { useState, useCallback } from "react";
import { careerAnchorCategories } from "@/lib/phase-data";

interface AIReportData {
  summary: string;
  strengths: { anchor: string; title: string; description: string }[];
  weaknesses: { anchor: string; title: string; description: string }[];
  careers: { field: string; roles: string[]; reason: string }[];
  advice: string;
}

interface AIReportProps {
  existingReport: AIReportData | null;
  hasResults: boolean;
}

function getAnchorColor(key: string): string {
  return careerAnchorCategories.find((c) => c.key === key)?.color || "#6b7280";
}

function getAnchorName(key: string): string {
  return careerAnchorCategories.find((c) => c.key === key)?.name || key;
}

export default function AIReport({ existingReport, hasResults }: AIReportProps) {
  const [report, setReport] = useState<AIReportData | null>(existingReport);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateReport = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai-report", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "리포트 생성에 실패했습니다.");
        return;
      }
      setReport(data.report);
    } catch {
      setError("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  if (!hasResults) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-2">AI 커리어 리포트</h3>
        <p className="text-sm text-slate-500">커리어 앵커 검사를 먼저 완료하면 AI가 맞춤형 리포트를 생성해드립니다.</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-2">AI 커리어 리포트 생성</h3>
        <p className="text-sm text-slate-500 mb-6">
          검사 결과를 기반으로 AI가 강점, 보완점, 추천 진로를 분석해드립니다.
        </p>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200/60 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <button
          onClick={generateReport}
          disabled={loading}
          className="btn-primary px-8 py-2.5 disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI 분석 중...
            </span>
          ) : (
            "AI 리포트 생성하기"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl border border-violet-200/50 p-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-900">AI 커리어 분석 리포트</h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{report.summary}</p>
      </div>

      {/* Strengths */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-emerald-700 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
          강점 분석
        </h3>
        <div className="space-y-3">
          {report.strengths.map((s, i) => (
            <div key={i} className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100" style={{ borderLeftWidth: "4px", borderLeftColor: getAnchorColor(s.anchor) }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md text-white" style={{ backgroundColor: getAnchorColor(s.anchor) }}>
                  {getAnchorName(s.anchor)}
                </span>
                <span className="font-semibold text-slate-900 text-sm">{s.title}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-amber-700 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          보완점 분석
        </h3>
        <div className="space-y-3">
          {report.weaknesses.map((w, i) => (
            <div key={i} className="p-4 rounded-lg bg-amber-50/50 border border-amber-100" style={{ borderLeftWidth: "4px", borderLeftColor: getAnchorColor(w.anchor) }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md text-white" style={{ backgroundColor: getAnchorColor(w.anchor) }}>
                  {getAnchorName(w.anchor)}
                </span>
                <span className="font-semibold text-slate-900 text-sm">{w.title}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{w.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Career Recommendations */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-blue-700 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
          </svg>
          추천 진로
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {report.careers.map((c, i) => (
            <div key={i} className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
              <h4 className="font-semibold text-slate-900 text-sm mb-2">{c.field}</h4>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {c.roles.map((role, j) => (
                  <span key={j} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                    {role}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{c.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advice */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          종합 조언
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed">{report.advice}</p>
      </div>

      {/* Regenerate */}
      <div className="text-center">
        <button
          onClick={() => {
            setReport(null);
            setError("");
          }}
          className="text-sm text-text-muted hover:text-primary transition-colors"
        >
          리포트 다시 생성하기
        </button>
      </div>
    </div>
  );
}
