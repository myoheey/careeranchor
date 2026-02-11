"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import StickyBoard from "@/components/StickyBoard";

interface Template {
  id: string;
  title: string;
  description: string | null;
  phase: number;
  projectId: string;
}

interface Team {
  id: string;
  name: string;
}

interface Project {
  id: string;
  title: string;
  theme: string;
  teams: Team[];
}

interface UserInfo {
  id: string;
  name: string;
  role: string;
}

export default function BoardPage(
  props: { params: Promise<{ id: string; templateId: string }> }
) {
  const params = use(props.params);
  const projectId = params.id;
  const templateId = params.templateId;

  const [template, setTemplate] = useState<Template | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [templateRes, projectRes, userRes] = await Promise.all([
        fetch(`/api/templates/${templateId}`),
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/auth/me`),
      ]);

      if (templateRes.ok) {
        const data = await templateRes.json();
        setTemplate(data.template);
      }

      if (projectRes.ok) {
        const data = await projectRes.json();
        setProject(data.project);
        if (data.project.teams.length > 0 && !selectedTeamId) {
          setSelectedTeamId(data.project.teams[0].id);
        }
      }

      if (userRes.ok) {
        const data = await userRes.json();
        setUser(data.user);
      }
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  }, [projectId, templateId, selectedTeamId]);

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
          <p className="text-slate-500 text-sm">보드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!template || !project || !user) {
    return (
      <div className="card p-12 text-center max-w-md mx-auto">
        <p className="text-red-500 mb-4">템플릿을 찾을 수 없습니다.</p>
        <Link href={`/projects/${projectId}`} className="btn-primary">
          프로젝트로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/${projectId}/phases/${template.phase}`}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded-lg px-3 py-2 hover:border-indigo-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            돌아가기
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {template.title}
            </h1>
            {template.description && (
              <p className="text-sm text-slate-500 mt-0.5">{template.description}</p>
            )}
          </div>
        </div>

        {/* Team Selector */}
        {project.teams.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600">팀:</label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="text-sm py-2 px-3 min-w-[140px]"
            >
              {project.teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Sticky Board */}
      <div className="card overflow-hidden" style={{ minHeight: "600px" }}>
        <StickyBoard
          templateId={templateId}
          teamId={selectedTeamId}
          userId={user.id}
          userName={user.name}
        />
      </div>
    </div>
  );
}
