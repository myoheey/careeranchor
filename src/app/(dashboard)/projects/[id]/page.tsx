"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { phaseData, themeLabels, ThemeType } from "@/lib/phase-data";

interface Team {
  id: string;
  name: string;
  topic: string | null;
  members: {
    id: string;
    userId: string;
    user: { id: string; name: string; email: string };
  }[];
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  theme: ThemeType;
  joinCode: string;
  currentPhase: number;
  professorId: string;
  teams: Team[];
}

const themeConfig: Record<string, { color: string; bg: string; border: string }> = {
  STARTUP: { color: "text-red-700", bg: "bg-red-100", border: "border-red-500" },
  JOB_CREATION: { color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-500" },
  PROBLEM_SOLVING: { color: "text-green-700", bg: "bg-green-100", border: "border-green-500" },
};

export default function ProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [advancingPhase, setAdvancingPhase] = useState(false);

  // Team creation state
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamTopic, setTeamTopic] = useState("");
  const [creatingTeam, setCreatingTeam] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      const [projectRes, meRes] = await Promise.all([
        fetch(`/api/projects/${params.id}`),
        fetch("/api/auth/me"),
      ]);

      if (meRes.ok) {
        const meData = await meRes.json();
        setUserRole(meData.user.role);
      }

      if (!projectRes.ok) {
        setError("프로젝트를 찾을 수 없습니다.");
        return;
      }

      const data = await projectRes.json();
      setProject(data.project);
    } catch {
      setError("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const copyJoinCode = async () => {
    if (!project) return;
    try {
      await navigator.clipboard.writeText(project.joinCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const advancePhase = async () => {
    if (!project || advancingPhase) return;
    setAdvancingPhase(true);
    try {
      const res = await fetch(`/api/projects/${params.id}/advance-phase`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
      }
    } catch {
      // error
    } finally {
      setAdvancingPhase(false);
    }
  };

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setCreatingTeam(true);
    try {
      const res = await fetch(`/api/projects/${params.id}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName.trim(), topic: teamTopic.trim() || null }),
      });
      if (res.ok) {
        setTeamName("");
        setTeamTopic("");
        setShowCreateTeam(false);
        fetchProject();
      }
    } catch {
      // error
    } finally {
      setCreatingTeam(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-500 text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center max-w-md mx-auto">
        <p className="text-red-500 mb-4">{error || "프로젝트를 찾을 수 없습니다."}</p>
        <Link href="/dashboard" className="btn-primary">
          대시보드로 돌아가기
        </Link>
      </div>
    );
  }

  const isProfessor = userRole === "PROFESSOR";
  const theme = themeConfig[project.theme] || themeConfig.STARTUP;
  const phases = phaseData[project.theme] || phaseData.STARTUP;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
          대시보드
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 font-medium">{project.title}</span>
      </nav>

      {/* Project Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${theme.bg} ${theme.color}`}>
                {themeLabels[project.theme]}
              </span>
              <span className="text-xs text-slate-400">
                Phase {project.currentPhase} / 4
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-slate-500">{project.description}</p>
            )}
          </div>

          {/* Join Code (Professor) */}
          {isProfessor && (
            <div className="flex-shrink-0">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center min-w-[160px]">
                <p className="text-xs text-slate-400 mb-1">참여 코드</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-xl font-semibold text-blue-600 tracking-wider">
                    {project.joinCode}
                  </code>
                  <button
                    onClick={copyJoinCode}
                    className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                    title="복사"
                  >
                    {copiedCode ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">학습 단계</h2>
          {isProfessor && project.currentPhase < 4 && (
            <button
              onClick={advancePhase}
              disabled={advancingPhase}
              className="btn-primary text-sm disabled:opacity-60"
            >
              {advancingPhase ? "진행 중..." : "다음 단계로"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {phases.map((phase) => {
            const isActive = phase.phase === project.currentPhase;
            const isCompleted = phase.phase < project.currentPhase;
            const isLocked = phase.phase > project.currentPhase;

            return (
              <div key={phase.phase} className="relative">
                {/* Connector line (desktop only) */}
                {phase.phase > 0 && (
                  <div className={`hidden sm:block absolute top-6 -left-4 w-4 h-0.5 ${
                    isCompleted || isActive ? "bg-blue-400" : "bg-slate-200"
                  }`} />
                )}

                {isLocked ? (
                  <div
                    className="bg-white border border-slate-200 rounded-lg overflow-hidden opacity-50 cursor-not-allowed"
                    style={{ borderTopWidth: "3px", borderTopColor: "#cbd5e1" } as React.CSSProperties}
                  >
                    <div className="p-4">
                      <div className="text-2xl mb-2 grayscale">{phase.icon}</div>
                      <p className="text-xs text-slate-400 mb-0.5">Phase {phase.phase}</p>
                      <h3 className="text-sm font-semibold text-slate-500 mb-1">{phase.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{phase.description}</p>
                      <div className="mt-2">
                        <svg className="w-4 h-4 text-slate-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/projects/${project.id}/phases/${phase.phase}`}
                    className={`block bg-white border border-slate-200 rounded-lg overflow-hidden transition-colors ${
                      isActive ? "ring-2 ring-blue-500 ring-offset-2" : "hover:border-slate-300"
                    }`}
                    style={{ borderTopWidth: "3px", borderTopColor: phase.color } as React.CSSProperties}
                  >
                    <div className="p-4">
                      <div className="text-2xl mb-2">{phase.icon}</div>
                      <p className="text-xs text-slate-400 mb-0.5">Phase {phase.phase}</p>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">{phase.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{phase.description}</p>
                      {isActive && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            현재 단계
                          </span>
                        </div>
                      )}
                      {isCompleted && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            완료
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Teams Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            팀 목록
            <span className="text-sm font-normal text-slate-400 ml-2">
              ({project.teams.length}개)
            </span>
          </h2>
          <div className="flex gap-2">
            <Link
              href={`/projects/${project.id}/teams`}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
            >
              전체 보기
            </Link>
            {isProfessor && (
              <button
                onClick={() => setShowCreateTeam(!showCreateTeam)}
                className="btn-primary text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                팀 만들기
              </button>
            )}
          </div>
        </div>

        {/* Create Team Form */}
        {showCreateTeam && (
          <form onSubmit={createTeam} className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">팀 이름</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="예: A팀"
                  required
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">주제 (선택)</label>
                <input
                  type="text"
                  value={teamTopic}
                  onChange={(e) => setTeamTopic(e.target.value)}
                  placeholder="예: 헬스케어 스타트업"
                  className="w-full text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateTeam(false)}
                className="text-sm px-3 py-1.5 text-slate-500 hover:text-slate-700 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={creatingTeam}
                className="btn-primary text-sm disabled:opacity-60"
              >
                {creatingTeam ? "생성 중..." : "팀 생성"}
              </button>
            </div>
          </form>
        )}

        {/* Teams List */}
        {project.teams.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400">아직 생성된 팀이 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.teams.map((team) => (
              <div key={team.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-1">{team.name}</h3>
                {team.topic && (
                  <p className="text-xs text-slate-500 mb-2">{team.topic}</p>
                )}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {team.members.map((member) => (
                    <span
                      key={member.id}
                      className="inline-flex items-center gap-1 text-xs bg-white border border-slate-200 rounded-full px-2 py-0.5"
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-white text-[10px] font-semibold">
                        {member.user.name.charAt(0)}
                      </span>
                      {member.user.name}
                    </span>
                  ))}
                  {team.members.length === 0 && (
                    <span className="text-xs text-slate-400">팀원 없음</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
