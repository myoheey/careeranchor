"use client";

import { useState, useEffect, useMemo } from "react";
import { careerAnchorCategories } from "@/lib/phase-data";

interface MemberResult {
  userId: string;
  userName: string;
  results: Record<string, number>;
  topAnchor: string;
}

interface TeamAnchorDashboardProps {
  projectId: string;
}

const ANCHOR_LABELS: Record<string, string> = {
  TF: "전문/기술",
  GM: "관리",
  AU: "자율/독립",
  SE: "안정/보장",
  EC: "창업/창의",
  SV: "봉사/헌신",
  CH: "순수 도전",
  LS: "라이프스타일",
};

export default function TeamAnchorDashboard({ projectId }: TeamAnchorDashboardProps) {
  const [memberResults, setMemberResults] = useState<MemberResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/career-anchor?projectId=${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setMemberResults(data.results);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [projectId]);

  // Team average scores
  const teamAverage = useMemo(() => {
    if (memberResults.length === 0) return null;
    const avg: Record<string, number> = {};
    for (const cat of careerAnchorCategories) {
      const sum = memberResults.reduce((acc, m) => acc + (m.results[cat.key] || 0), 0);
      avg[cat.key] = Math.round((sum / memberResults.length) * 100) / 100;
    }
    return avg;
  }, [memberResults]);

  // Strengths and weaknesses
  const insights = useMemo(() => {
    if (!teamAverage) return null;
    const sorted = [...careerAnchorCategories].sort(
      (a, b) => (teamAverage[b.key] || 0) - (teamAverage[a.key] || 0)
    );
    const strengths = sorted.slice(0, 2);
    const weaknesses = sorted.slice(-2).reverse();
    return { strengths, weaknesses };
  }, [teamAverage]);

  const maxScore = 6;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (memberResults.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-700 mb-2">
          아직 검사 결과가 없습니다
        </h3>
        <p className="text-sm text-slate-500">
          팀원들이 커리어 앵커 검사를 완료하면 여기에 결과가 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Team Balance Analysis */}
      {teamAverage && insights && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            팀 밸런스 분석
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            팀 전체의 커리어 앵커 평균 점수
          </p>

          {/* Team radar chart */}
          <div className="flex justify-center mb-6">
            <div className="relative w-72 h-72">
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
                const score = teamAverage[cat.key] || 0;
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
                      className="absolute w-3 h-3 rounded-full border-2 border-white shadow-md z-10"
                      style={{
                        backgroundColor: cat.color,
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
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
                        opacity="0.3"
                      />
                    </svg>
                  </div>
                );
              })}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
              >
                <polygon
                  points={careerAnchorCategories
                    .map((cat, i) => {
                      const score = teamAverage[cat.key] || 0;
                      const angle =
                        (i / careerAnchorCategories.length) * 2 * Math.PI - Math.PI / 2;
                      const radius = (score / maxScore) * 48;
                      const x = 50 + radius * Math.cos(angle);
                      const y = 50 + radius * Math.sin(angle);
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  fill="rgba(16, 185, 129, 0.15)"
                  stroke="rgba(16, 185, 129, 0.6)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>

          {/* Team average bar chart */}
          <div className="mb-6">
            <div className="flex flex-col gap-2">
              {[...careerAnchorCategories]
                .sort((a, b) => (teamAverage[b.key] || 0) - (teamAverage[a.key] || 0))
                .map((cat) => {
                  const score = teamAverage[cat.key] || 0;
                  const percentage = (score / maxScore) * 100;
                  return (
                    <div key={cat.key} className="flex items-center gap-3">
                      <div className="w-24 text-right">
                        <span className="text-xs font-medium text-slate-600">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                          style={{
                            width: `${Math.max(percentage, 5)}%`,
                            backgroundColor: cat.color,
                          }}
                        >
                          <span className="text-[10px] font-bold text-white drop-shadow-sm">
                            {score.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <h4 className="text-sm font-bold text-emerald-800 mb-2">
                팀 강점
              </h4>
              {insights.strengths.map((cat) => (
                <div key={cat.key} className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-emerald-700 font-medium">
                    {cat.name}
                  </span>
                  <span className="text-xs text-emerald-500">
                    {(teamAverage[cat.key] || 0).toFixed(1)}점
                  </span>
                </div>
              ))}
              <p className="text-xs text-emerald-600 mt-2">
                팀이 이 영역에서 높은 역량을 보입니다.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
              <h4 className="text-sm font-bold text-amber-800 mb-2">
                보완 필요
              </h4>
              {insights.weaknesses.map((cat) => (
                <div key={cat.key} className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-amber-700 font-medium">
                    {cat.name}
                  </span>
                  <span className="text-xs text-amber-500">
                    {(teamAverage[cat.key] || 0).toFixed(1)}점
                  </span>
                </div>
              ))}
              <p className="text-xs text-amber-600 mt-2">
                이 영역에 관심을 가지면 팀 역량이 균형잡힙니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Team Member Results */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          팀원 검사 결과
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {memberResults.length}명이 검사를 완료했습니다.
        </p>

        <div className="space-y-3">
          {memberResults.map((member) => {
            const topCat = careerAnchorCategories.find((c) => c.key === member.topAnchor);
            const sorted = [...careerAnchorCategories].sort(
              (a, b) => (member.results[b.key] || 0) - (member.results[a.key] || 0)
            );
            const top3 = sorted.slice(0, 3);

            return (
              <div
                key={member.userId}
                className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: topCat?.color || "#94a3b8" }}
                    >
                      {member.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {member.userName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {ANCHOR_LABELS[member.topAnchor] || member.topAnchor} 유형
                      </p>
                    </div>
                  </div>
                  {topCat && (
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: topCat.color }}
                    >
                      {topCat.name}
                    </span>
                  )}
                </div>

                {/* Mini bar chart for top 3 */}
                <div className="flex flex-col gap-1.5">
                  {top3.map((cat) => {
                    const score = member.results[cat.key] || 0;
                    const percentage = (score / maxScore) * 100;
                    return (
                      <div key={cat.key} className="flex items-center gap-2">
                        <div className="w-16 text-right">
                          <span className="text-[10px] text-slate-500">
                            {cat.name}
                          </span>
                        </div>
                        <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(percentage, 5)}%`,
                              backgroundColor: cat.color,
                              opacity: 0.8,
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500 w-8">
                          {score.toFixed(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
