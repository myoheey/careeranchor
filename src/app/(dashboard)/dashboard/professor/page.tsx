"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string | null;
  theme: string;
  joinCode: string;
  currentPhase: number;
  createdAt: string;
  _count: {
    teams: number;
    templates: number;
  };
}

const themeConfig: Record<string, { label: string; color: string; bg: string }> = {
  STARTUP: { label: "창업", color: "text-theme-startup", bg: "bg-theme-startup" },
  JOB_CREATION: { label: "창직", color: "text-theme-job", bg: "bg-theme-job" },
  PROBLEM_SOLVING: { label: "문제해결", color: "text-theme-problem", bg: "bg-theme-problem" },
};

const phaseLabels = ["Phase 0: 커리어 앵커", "Phase 1: 탐색", "Phase 2: 아이디어", "Phase 3: 설계", "Phase 4: 실행"];

export default function ProfessorDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [projectsRes, meRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/auth/me"),
      ]);

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.projects);
      }

      if (meRes.ok) {
        const data = await meRes.json();
        setUserName(data.user.name);
      }
    } catch {
      // error fetching
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const copyJoinCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // clipboard not available
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-text">
            안녕하세요, {userName} 교수님
          </h1>
          <p className="text-sm text-text-muted mt-1">프로젝트를 관리하고 학생들의 진행 상황을 확인하세요</p>
        </div>
        <Link href="/projects/create" className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 프로젝트 만들기
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-2xl font-bold text-primary">{projects.length}</p>
          <p className="text-sm text-text-muted mt-1">전체 프로젝트</p>
        </div>
        <div className="card p-5">
          <p className="text-2xl font-bold text-primary">
            {projects.reduce((sum, p) => sum + p._count.teams, 0)}
          </p>
          <p className="text-sm text-text-muted mt-1">전체 팀 수</p>
        </div>
        <div className="card p-5">
          <p className="text-2xl font-bold text-accent">
            {projects.filter((p) => p.currentPhase > 0).length}
          </p>
          <p className="text-sm text-text-muted mt-1">진행 중</p>
        </div>
        <div className="card p-5">
          <p className="text-2xl font-bold text-primary-soft">
            {projects.filter((p) => p.currentPhase >= 4).length}
          </p>
          <p className="text-sm text-text-muted mt-1">완료</p>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-primary-lighter" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-text mb-1">아직 프로젝트가 없습니다</h3>
          <p className="text-sm text-text-muted mb-5">첫 프로젝트를 만들어 학생들과 시작해보세요</p>
          <Link href="/projects/create" className="btn-primary text-sm">
            새 프로젝트 만들기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => {
            const theme = themeConfig[project.theme] || themeConfig.STARTUP;
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="card p-5 block hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
              >
                {/* Theme & Phase */}
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 text-xs font-medium">
                    <span className={`w-2 h-2 rounded-full ${theme.bg}`} />
                    <span className={theme.color}>{theme.label}</span>
                  </span>
                  <span className="text-xs text-text-muted bg-surface-secondary px-2 py-0.5 rounded-full">
                    {phaseLabels[project.currentPhase] || `Phase ${project.currentPhase}`}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-text mb-1">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="text-sm text-text-muted mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Join Code */}
                <div
                  className="flex items-center gap-2 bg-surface-secondary border border-border-light rounded-lg px-3 py-2 mb-3"
                  onClick={(e) => {
                    e.preventDefault();
                    copyJoinCode(project.joinCode);
                  }}
                >
                  <span className="text-xs text-text-muted">참여코드</span>
                  <code className="text-sm font-mono font-semibold text-primary tracking-wider flex-1">
                    {project.joinCode}
                  </code>
                  <button className="text-text-muted hover:text-primary transition-colors">
                    {copiedCode === project.joinCode ? (
                      <svg className="w-4 h-4 text-primary-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {project._count.teams}개 팀
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {project._count.templates}개 템플릿
                  </span>
                </div>

                {/* Phase Progress */}
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((phase) => (
                    <div
                      key={phase}
                      className={`h-1.5 flex-1 rounded-full ${
                        phase <= project.currentPhase ? "bg-primary-lighter" : "bg-border-light"
                      }`}
                    />
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
