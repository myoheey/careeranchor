"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { phaseData, ThemeType } from "@/lib/phase-data";
import CareerAnchorSurvey from "@/components/CareerAnchorSurvey";
import TeamAnchorDashboard from "@/components/TeamAnchorDashboard";
import CreateTemplateModal from "@/components/CreateTemplateModal";

interface Template {
  id: string;
  title: string;
  description: string | null;
  phase: number;
  isDefault: boolean;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  theme: ThemeType;
  currentPhase: number;
}

interface UserSession {
  id: string;
  role: "PROFESSOR" | "STUDENT";
  name: string;
}

export default function PhaseDetailPage(
  props: { params: Promise<{ id: string; phaseNum: string }> }
) {
  const params = use(props.params);
  const projectId = params.id;
  const phaseNum = parseInt(params.phaseNum, 10);

  const [project, setProject] = useState<Project | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [projectRes, templatesRes, meRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/templates?projectId=${projectId}&phase=${phaseNum}`),
        fetch("/api/auth/me"),
      ]);

      if (projectRes.ok) {
        const data = await projectRes.json();
        setProject(data.project);
      }

      if (templatesRes.ok) {
        const data = await templatesRes.json();
        setTemplates(data.templates);
      }

      if (meRes.ok) {
        const data = await meRes.json();
        setUser(data.user);
      }
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  }, [projectId, phaseNum]);

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

  if (!project) {
    return (
      <div className="card p-12 text-center max-w-md mx-auto">
        <p className="text-red-500 mb-4">프로젝트를 찾을 수 없습니다.</p>
        <Link href="/dashboard" className="btn-primary">
          대시보드로 돌아가기
        </Link>
      </div>
    );
  }

  const phases = phaseData[project.theme] || phaseData.STARTUP;
  const currentPhaseInfo = phases.find((p) => p.phase === phaseNum);

  if (!currentPhaseInfo) {
    return (
      <div className="card p-12 text-center max-w-md mx-auto">
        <p className="text-red-500 mb-4">유효하지 않은 단계입니다.</p>
        <Link href={`/projects/${projectId}`} className="btn-primary">
          프로젝트로 돌아가기
        </Link>
      </div>
    );
  }

  const isProfessor = user?.role === "PROFESSOR";

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
        <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
          대시보드
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link href={`/projects/${projectId}`} className="hover:text-indigo-600 transition-colors">
          {project.title}
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-700 font-medium">Phase {phaseNum}</span>
      </nav>

      {/* Phase Header */}
      <div
        className="card p-6 sm:p-8 mb-8 relative overflow-hidden"
        style={{ borderTop: `4px solid ${currentPhaseInfo.color}` }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{currentPhaseInfo.icon}</span>
              <div>
                <p className="text-xs text-slate-400 font-medium">Phase {phaseNum}</p>
                <h1 className="text-2xl font-bold text-slate-900">{currentPhaseInfo.title}</h1>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2">{currentPhaseInfo.subtitle}</p>
            <p className="text-slate-500">{currentPhaseInfo.description}</p>
          </div>
          {isProfessor && phaseNum === 0 && (
            <span className="shrink-0 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
              교수 뷰
            </span>
          )}
        </div>
      </div>

      {/* Phase 0: Career Anchor */}
      {phaseNum === 0 ? (
        <div className="space-y-8">
          {/* Professor: show only dashboard (no survey) */}
          {isProfessor ? (
            <div>
              <div className="card p-5 mb-6 bg-indigo-50 border-indigo-100">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-indigo-700">
                    학생들의 커리어 앵커 검사 결과를 확인할 수 있습니다. 검사가 완료된 팀원들의 결과와 팀 밸런스 분석이 아래에 표시됩니다.
                  </p>
                </div>
              </div>
              <TeamAnchorDashboard projectId={projectId} />
            </div>
          ) : (
            /* Student: show survey + dashboard */
            <>
              <CareerAnchorSurvey projectId={projectId} />
              <TeamAnchorDashboard projectId={projectId} />
            </>
          )}
        </div>
      ) : (
        <>
          {/* Templates Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                템플릿
                <span className="text-sm font-normal text-slate-400 ml-2">
                  ({templates.length}개)
                </span>
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 템플릿 만들기
              </button>
            </div>

            {templates.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-700 mb-2">
                  아직 템플릿이 없습니다
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  새 템플릿을 만들어 팀 활동을 시작하세요
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary text-sm"
                >
                  템플릿 만들기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Link
                    key={template.id}
                    href={`/projects/${projectId}/board/${template.id}`}
                    className="card p-5 hover:shadow-lg transition-all duration-200 group block"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                      </div>
                      {template.isDefault && (
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          기본
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                      {template.title}
                    </h3>
                    {template.description && (
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {template.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center text-xs text-indigo-500 font-medium group-hover:gap-2 transition-all">
                      보드 열기
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <CreateTemplateModal
          projectId={projectId}
          phase={phaseNum}
          theme={project.theme}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
