"use client";

import { useState, useCallback, useRef, type ReactNode } from "react";
import { careerAnchorCategories } from "@/lib/phase-data";
import { anchorDetails, anchorTheoryIntro, interpretationGuide } from "@/lib/anchor-content";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface AIReportData {
  executiveSummary: string;
  profileAnalysis: string;
  anchorAnalysis: { anchor: string; score: number; rank: number; interpretation: string; currentJobFit: string }[];
  strengths: { anchor: string; title: string; description: string; actionItems: string[] }[];
  weaknesses: { anchor: string; title: string; description: string; actionItems: string[] }[];
  anchorCombination: { title: string; description: string };
  careers: { field: string; roles: string[]; reason: string; fitScore: number }[];
  careerRoadmap: {
    shortTerm: { period: string; goals: string[]; description: string };
    midTerm: { period: string; goals: string[]; description: string };
    longTerm: { period: string; goals: string[]; description: string };
  };
  organizationFit: {
    idealCulture: string;
    idealSize: string;
    idealLeader: string;
    idealTeam: string;
    redFlags: string[];
  };
  workStyle: {
    communication: string;
    decisionMaking: string;
    stressManagement: string;
    motivation: string;
  };
  growthAdvice: {
    mindset: string;
    skills: string[];
    resources: string[];
    networking: string;
  };
  closingMessage: string;
  // backward compat with old format
  summary?: string;
  advice?: string;
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
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPdf = useCallback(async () => {
    if (!reportRef.current) return;
    setDownloadingPdf(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = reportRef.current;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: "커리어앵커_진단리포트.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError("PDF 생성에 실패했습니다.");
    } finally {
      setDownloadingPdf(false);
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-2">AI 커리어 리포트 생성</h3>
        <p className="text-sm text-slate-500 mb-6">
          검사 결과를 기반으로 AI가 20페이지 이상의 종합 리포트를 생성합니다.
          <br />강점, 보완점, 추천 진로, 커리어 로드맵, 조직 적합도까지 분석해드립니다.
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
              AI 분석 중... (30초~1분 소요)
            </span>
          ) : (
            "AI 종합 리포트 생성하기"
          )}
        </button>
      </div>
    );
  }

  // Check if this is the new expanded format or old format
  const isExpanded = !!report.executiveSummary;

  return (
    <div className="animate-fade-in">
      {/* Download Button */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={handleDownloadPdf}
          disabled={downloadingPdf}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {downloadingPdf ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              PDF 생성 중...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              PDF 다운로드
            </>
          )}
        </button>
        <button
          onClick={() => {
            setReport(null);
            setError("");
          }}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          다시 생성
        </button>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="space-y-6 report-content">
        {/* Cover Section */}
        <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-8 text-center text-white" style={{ pageBreakAfter: "always" }}>
          <div className="py-8">
            <p className="text-sm font-medium text-white/70 mb-2 tracking-widest uppercase">Career Anchor Assessment Report</p>
            <h1 className="text-3xl font-bold mb-3">커리어 앵커 종합 진단 리포트</h1>
            <div className="w-16 h-0.5 bg-white/30 mx-auto mb-4" />
            <p className="text-white/80 text-sm">AI 기반 맞춤형 커리어 분석</p>
            <p className="text-white/50 text-xs mt-6">
              {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })} 발행
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        {isExpanded && report.executiveSummary && (
          <section className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl border border-violet-200/50 p-6" style={{ pageBreakAfter: "always" }}>
            <SectionHeader icon="sparkles" title="종합 요약" color="violet" />
            <p className="text-sm text-slate-700 leading-relaxed mb-4">{report.executiveSummary}</p>
            {report.profileAnalysis && (
              <div className="mt-4 p-4 bg-white/60 rounded-lg border border-violet-100">
                <h4 className="text-sm font-semibold text-violet-700 mb-2">프로필 기반 분석</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{report.profileAnalysis}</p>
              </div>
            )}
          </section>
        )}

        {/* Backward compat: old summary */}
        {!isExpanded && report.summary && (
          <section className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl border border-violet-200/50 p-6">
            <SectionHeader icon="sparkles" title="AI 커리어 분석 리포트" color="violet" />
            <p className="text-sm text-slate-700 leading-relaxed">{report.summary}</p>
          </section>
        )}

        {/* Career Anchor Theory */}
        <section className="bg-white rounded-xl border border-slate-200 p-6" style={{ pageBreakAfter: "always" }}>
          <SectionHeader icon="book" title={anchorTheoryIntro.title} color="slate" />
          {anchorTheoryIntro.paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-slate-600 leading-relaxed mb-3">{p}</p>
          ))}
        </section>

        {/* Interpretation Guide */}
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <SectionHeader icon="chart" title={interpretationGuide.title} color="blue" />
          {interpretationGuide.sections.map((s, i) => (
            <div key={i} className="mb-4 last:mb-0">
              <h4 className="text-sm font-semibold text-slate-800 mb-1">{s.subtitle}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </section>

        {/* 8 Anchor Analysis (AI generated) */}
        {isExpanded && report.anchorAnalysis && (
          <section style={{ pageBreakBefore: "always" }}>
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <SectionHeader icon="anchor" title="8가지 커리어 앵커 상세 분석" color="indigo" />
              <p className="text-sm text-slate-500 mb-4">당신의 각 커리어 앵커별 점수와 AI 맞춤 해석입니다.</p>
            </div>
            <div className="space-y-4">
              {report.anchorAnalysis.map((item: any) => {
                const detail = anchorDetails[item.anchor];
                const color = getAnchorColor(item.anchor);
                const score = item.score || 0;
                const pct = (score / 6) * 100;
                return (
                  <div key={item.anchor} className="bg-white rounded-xl border border-slate-200 p-5" style={{ pageBreakInside: "avoid" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{detail?.icon || "📊"}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900">{getAnchorName(item.anchor)}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ backgroundColor: color }}>
                            #{item.rank}위
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{detail?.subtitle}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold" style={{ color }}>{score.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">/6.0</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-2">{item.interpretation}</p>
                    {item.currentJobFit && (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-medium text-slate-500 mb-1">현재 직무 적합도</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.currentJobFit}</p>
                      </div>
                    )}
                    {/* Static content from anchor-content.ts */}
                    {detail && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                          <p className="text-xs font-semibold text-emerald-700 mb-1">핵심 동기 요인</p>
                          <ul className="text-xs text-slate-600 space-y-0.5">
                            {detail.motivators.slice(0, 3).map((m, j) => (
                              <li key={j}>• {m}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                          <p className="text-xs font-semibold text-amber-700 mb-1">스트레스 요인</p>
                          <ul className="text-xs text-slate-600 space-y-0.5">
                            {detail.stressors.slice(0, 3).map((s, j) => (
                              <li key={j}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Anchor Combination */}
        {isExpanded && report.anchorCombination && (
          <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50 p-6" style={{ pageBreakBefore: "always", pageBreakInside: "avoid" }}>
            <SectionHeader icon="puzzle" title={`앵커 조합 분석: ${report.anchorCombination.title}`} color="indigo" />
            <p className="text-sm text-slate-700 leading-relaxed">{report.anchorCombination.description}</p>
          </section>
        )}

        {/* Strengths */}
        <section className="bg-white rounded-xl border border-slate-200 p-6" style={{ pageBreakBefore: "always" }}>
          <SectionHeader icon="up" title="강점 분석" color="emerald" />
          <div className="space-y-4">
            {(report.strengths || []).map((s: any, i: number) => (
              <div key={i} className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100" style={{ borderLeftWidth: "4px", borderLeftColor: getAnchorColor(s.anchor), pageBreakInside: "avoid" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md text-white" style={{ backgroundColor: getAnchorColor(s.anchor) }}>
                    {getAnchorName(s.anchor)}
                  </span>
                  <span className="font-semibold text-slate-900 text-sm">{s.title}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{s.description}</p>
                {s.actionItems && s.actionItems.length > 0 && (
                  <div className="bg-white/60 rounded-md p-3">
                    <p className="text-xs font-semibold text-emerald-700 mb-1.5">실천 액션</p>
                    <ul className="space-y-1">
                      {s.actionItems.map((item: string, j: number) => (
                        <li key={j} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Weaknesses */}
        <section className="bg-white rounded-xl border border-slate-200 p-6" style={{ pageBreakInside: "avoid" }}>
          <SectionHeader icon="alert" title="보완점 분석" color="amber" />
          <div className="space-y-4">
            {(report.weaknesses || []).map((w: any, i: number) => (
              <div key={i} className="p-4 rounded-lg bg-amber-50/50 border border-amber-100" style={{ borderLeftWidth: "4px", borderLeftColor: getAnchorColor(w.anchor), pageBreakInside: "avoid" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md text-white" style={{ backgroundColor: getAnchorColor(w.anchor) }}>
                    {getAnchorName(w.anchor)}
                  </span>
                  <span className="font-semibold text-slate-900 text-sm">{w.title}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{w.description}</p>
                {w.actionItems && w.actionItems.length > 0 && (
                  <div className="bg-white/60 rounded-md p-3">
                    <p className="text-xs font-semibold text-amber-700 mb-1.5">개선 액션</p>
                    <ul className="space-y-1">
                      {w.actionItems.map((item: string, j: number) => (
                        <li key={j} className="text-xs text-slate-600 flex items-start gap-1.5">
                          <span className="text-amber-500 mt-0.5">→</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Career Recommendations */}
        <section className="bg-white rounded-xl border border-slate-200 p-6" style={{ pageBreakBefore: "always" }}>
          <SectionHeader icon="briefcase" title="추천 진로" color="blue" />
          <div className="space-y-3">
            {(report.careers || []).map((c: any, i: number) => (
              <div key={i} className="p-4 rounded-lg bg-blue-50/50 border border-blue-100" style={{ pageBreakInside: "avoid" }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 text-sm">{c.field}</h4>
                  {c.fitScore && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      적합도 {c.fitScore}/10
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(c.roles || []).map((role: string, j: number) => (
                    <span key={j} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                      {role}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{c.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Career Roadmap */}
        {isExpanded && report.careerRoadmap && (
          <section className="bg-white rounded-xl border border-slate-200 p-6" style={{ pageBreakBefore: "always" }}>
            <SectionHeader icon="roadmap" title="커리어 로드맵" color="teal" />
            <div className="space-y-4">
              {[
                { data: report.careerRoadmap.shortTerm, color: "emerald", icon: "🎯" },
                { data: report.careerRoadmap.midTerm, color: "blue", icon: "🚀" },
                { data: report.careerRoadmap.longTerm, color: "purple", icon: "⭐" },
              ].map((item, i) => (
                item.data && (
                  <div key={i} className={`p-4 rounded-lg border bg-${item.color}-50/30 border-${item.color}-100`} style={{ pageBreakInside: "avoid" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{item.icon}</span>
                      <h4 className="font-semibold text-slate-900 text-sm">{item.data.period}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.data.goals.map((goal: string, j: number) => (
                        <span key={j} className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700">
                          {goal}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.data.description}</p>
                  </div>
                )
              ))}
            </div>
          </section>
        )}

        {/* Organization Fit */}
        {isExpanded && report.organizationFit && (
          <section className="bg-white rounded-xl border border-slate-200 p-6" style={{ pageBreakBefore: "always" }}>
            <SectionHeader icon="building" title="조직 적합도 분석" color="cyan" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <InfoCard title="이상적인 조직 문화" content={report.organizationFit.idealCulture} icon="🏢" />
              <InfoCard title="적합한 조직 규모" content={report.organizationFit.idealSize} icon="📏" />
              <InfoCard title="이상적인 상사/리더" content={report.organizationFit.idealLeader} icon="👤" />
              <InfoCard title="이상적인 팀 환경" content={report.organizationFit.idealTeam} icon="👥" />
            </div>
            {report.organizationFit.redFlags && (
              <div className="p-4 bg-red-50/50 rounded-lg border border-red-100">
                <p className="text-xs font-semibold text-red-700 mb-2">주의해야 할 조직 문화</p>
                <ul className="space-y-1">
                  {report.organizationFit.redFlags.map((flag: string, i: number) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-red-400 mt-0.5">⚠</span> {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Work Style */}
        {isExpanded && report.workStyle && (
          <section className="bg-white rounded-xl border border-slate-200 p-6" style={{ pageBreakInside: "avoid" }}>
            <SectionHeader icon="style" title="업무 스타일 분석" color="orange" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard title="커뮤니케이션 스타일" content={report.workStyle.communication} icon="💬" />
              <InfoCard title="의사결정 방식" content={report.workStyle.decisionMaking} icon="🎯" />
              <InfoCard title="스트레스 관리" content={report.workStyle.stressManagement} icon="🧘" />
              <InfoCard title="동기부여 요인" content={report.workStyle.motivation} icon="⚡" />
            </div>
          </section>
        )}

        {/* Growth Advice */}
        {isExpanded && report.growthAdvice && (
          <section className="bg-white rounded-xl border border-slate-200 p-6" style={{ pageBreakBefore: "always" }}>
            <SectionHeader icon="growth" title="성장 가이드" color="green" />
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">마인드셋</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{report.growthAdvice.mindset}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-green-50/50 rounded-lg border border-green-100">
                <p className="text-xs font-semibold text-green-700 mb-2">개발 추천 스킬</p>
                <ul className="space-y-1">
                  {report.growthAdvice.skills.map((skill: string, i: number) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-green-500 mt-0.5">•</span> {skill}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 mb-2">추천 학습 자원</p>
                <ul className="space-y-1">
                  {report.growthAdvice.resources.map((res: string, i: number) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-blue-500 mt-0.5">📚</span> {res}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100">
              <p className="text-xs font-semibold text-purple-700 mb-2">네트워킹 조언</p>
              <p className="text-sm text-slate-600 leading-relaxed">{report.growthAdvice.networking}</p>
            </div>
          </section>
        )}

        {/* Each Anchor Detail (static content) */}
        <section style={{ pageBreakBefore: "always" }}>
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
            <SectionHeader icon="list" title="8가지 커리어 앵커 유형 상세" color="slate" />
            <p className="text-sm text-slate-500">각 커리어 앵커 유형에 대한 상세 정보입니다.</p>
          </div>
          <div className="space-y-4">
            {Object.values(anchorDetails).map((detail) => (
              <div key={detail.key} className="bg-white rounded-xl border border-slate-200 p-5" style={{ pageBreakInside: "avoid" }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{detail.icon}</span>
                  <div>
                    <h4 className="font-semibold text-slate-900">{detail.name}</h4>
                    <p className="text-xs text-slate-400">{detail.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{detail.summary}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">주요 특성</p>
                    <ul className="text-xs text-slate-600 space-y-0.5">
                      {detail.characteristics.slice(0, 3).map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">추천 직업군</p>
                    <div className="flex flex-wrap gap-1">
                      {detail.careers.slice(0, 4).map((c, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing Message */}
        {isExpanded && report.closingMessage && (
          <section className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10 p-6" style={{ pageBreakBefore: "always", pageBreakInside: "avoid" }}>
            <SectionHeader icon="heart" title="마무리 메시지" color="primary" />
            <p className="text-sm text-slate-700 leading-relaxed italic">{report.closingMessage}</p>
          </section>
        )}

        {/* Backward compat: old advice */}
        {!isExpanded && report.advice && (
          <section className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6">
            <SectionHeader icon="bulb" title="종합 조언" color="slate" />
            <p className="text-sm text-slate-700 leading-relaxed">{report.advice}</p>
          </section>
        )}

        {/* Footer */}
        <div className="text-center py-6 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            본 리포트는 Schein의 커리어 앵커 이론을 기반으로 AI가 생성한 참고 자료입니다.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            CareerAnchor &copy; {new Date().getFullYear()} | AI 기반 커리어 진단 서비스
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, color }: { icon: string; title: string; color: string }) {
  const iconMap: Record<string, ReactNode> = {
    sparkles: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />,
    up: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />,
    alert: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />,
    briefcase: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />,
    book: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />,
    chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
    anchor: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    puzzle: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.421 48.421 0 01-4.185-.07c-.514-.044-1.034.073-1.482.375C3.925 7.605 3.5 8.388 3.5 9.25v0c0 .863.425 1.645 1.076 2.196.448.302.968.419 1.482.375a48.424 48.424 0 014.185-.07.64.64 0 01.657.643v0" />,
    roadmap: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6.75V15m0 0l3-3m-3 3l-3-3m12-1.5V6.75m0 0L15 9.75m3-3l3 3" />,
    building: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />,
    style: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />,
    growth: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />,
    heart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />,
    bulb: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />,
    list: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
  };

  const colorMap: Record<string, string> = {
    violet: "text-violet-600",
    emerald: "text-emerald-700",
    amber: "text-amber-700",
    blue: "text-blue-700",
    slate: "text-slate-900",
    indigo: "text-indigo-700",
    teal: "text-teal-700",
    cyan: "text-cyan-700",
    orange: "text-orange-700",
    green: "text-green-700",
    primary: "text-primary",
    red: "text-red-700",
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <svg className={`w-5 h-5 ${colorMap[color] || "text-slate-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {iconMap[icon] || iconMap.chart}
      </svg>
      <h3 className={`text-lg font-semibold ${colorMap[color] || "text-slate-900"}`}>{title}</h3>
    </div>
  );
}

function InfoCard({ title, content, icon }: { title: string; content: string; icon: string }) {
  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100" style={{ pageBreakInside: "avoid" }}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm">{icon}</span>
        <h4 className="text-xs font-semibold text-slate-700">{title}</h4>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
    </div>
  );
}
