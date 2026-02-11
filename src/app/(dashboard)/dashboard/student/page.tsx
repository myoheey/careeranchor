"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import JoinProjectModal from "@/components/JoinProjectModal";

interface Team {
  id: string;
  name: string;
  topic: string | null;
  members: { userId: string }[];
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  theme: string;
  currentPhase: number;
  teams: Team[];
  professor: {
    name: string;
  };
}

const themeConfig: Record<string, { label: string; color: string; bg: string }> = {
  STARTUP: { label: "창업", color: "text-red-700", bg: "bg-red-100" },
  JOB_CREATION: { label: "창직", color: "text-blue-700", bg: "bg-blue-100" },
  PROBLEM_SOLVING: { label: "문제해결", color: "text-green-700", bg: "bg-green-100" },
};

const phaseLabels = ["Phase 0: 커리어 앵커", "Phase 1: 탐색", "Phase 2: 아이디어", "Phase 3: 설계", "Phase 4: 실행"];

export default function StudentDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-500 text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            안녕하세요, {userName}님
          </h1>
          <p className="text-slate-500 mt-1">참여 중인 프로젝트를 확인하고 팀 활동을 진행하세요</p>
        </div>
        <button
          onClick={() => setShowJoinModal(true)}
          className="btn-accent text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          프로젝트 참여
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">참여 중인 프로젝트가 없습니다</h3>
          <p className="text-sm text-slate-500 mb-6">
            교수님이 공유한 참여 코드를 입력하여 프로젝트에 참여하세요
          </p>
          <button
            onClick={() => setShowJoinModal(true)}
            className="btn-accent"
          >
            프로젝트 참여하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const theme = themeConfig[project.theme] || themeConfig.STARTUP;
            const myTeam = project.teams.find((t) =>
              t.members.some((m) => m.userId)
            );

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="card p-6 hover:shadow-lg transition-all duration-200 group block"
              >
                {/* Theme Badge & Phase */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${theme.bg} ${theme.color}`}>
                    {theme.label}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {phaseLabels[project.currentPhase] || `Phase ${project.currentPhase}`}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>

                {/* Professor */}
                <p className="text-xs text-slate-400 mb-3">
                  담당 교수: {project.professor.name}
                </p>

                {/* My Team */}
                {myTeam && (
                  <div className="flex items-center gap-2 bg-indigo-50 rounded-lg px-3 py-2 mb-4">
                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium text-indigo-700">{myTeam.name}</span>
                    {myTeam.topic && (
                      <span className="text-xs text-indigo-500 truncate">- {myTeam.topic}</span>
                    )}
                  </div>
                )}

                {/* Phase Progress */}
                <div className="mt-4 flex gap-1">
                  {[0, 1, 2, 3, 4].map((phase) => (
                    <div
                      key={phase}
                      className={`h-1.5 flex-1 rounded-full ${
                        phase <= project.currentPhase ? "bg-indigo-500" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Join Project Modal */}
      {showJoinModal && (
        <JoinProjectModal
          onClose={() => setShowJoinModal(false)}
          onJoined={() => {
            setShowJoinModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
