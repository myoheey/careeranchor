"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";

interface TeamMember {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  joinedAt: string;
}

interface Team {
  id: string;
  name: string;
  topic: string | null;
  members: TeamMember[];
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  theme: string;
  professorId: string;
  teams: Team[];
}

export default function TeamsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const projectId = params.id;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  // Team creation state
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamTopic, setTeamTopic] = useState("");
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [joiningTeam, setJoiningTeam] = useState<string | null>(null);
  const [leavingTeam, setLeavingTeam] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [projectRes, meRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch("/api/auth/me"),
      ]);

      if (projectRes.ok) {
        const data = await projectRes.json();
        setProject(data.project);
      }

      if (meRes.ok) {
        const data = await meRes.json();
        setUserRole(data.user.role);
        setUserId(data.user.id);
      }
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setCreatingTeam(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName.trim(), topic: teamTopic.trim() || null }),
      });
      if (res.ok) {
        setTeamName("");
        setTeamTopic("");
        setShowCreateTeam(false);
        fetchData();
      }
    } catch {
      // error
    } finally {
      setCreatingTeam(false);
    }
  };

  const joinTeam = async (teamId: string) => {
    setJoiningTeam(teamId);
    try {
      const res = await fetch(`/api/projects/${projectId}/teams/${teamId}/join`, {
        method: "POST",
      });
      if (res.ok) {
        fetchData();
      }
    } catch {
      // error
    } finally {
      setJoiningTeam(null);
    }
  };

  const leaveTeam = async (teamId: string) => {
    setLeavingTeam(teamId);
    try {
      const res = await fetch(`/api/projects/${projectId}/teams/${teamId}/leave`, {
        method: "POST",
      });
      if (res.ok) {
        fetchData();
      }
    } catch {
      // error
    } finally {
      setLeavingTeam(null);
    }
  };

  const isProfessor = userRole === "PROFESSOR";

  const isInTeam = (team: Team) => {
    return team.members.some((m) => m.userId === userId);
  };

  const isInAnyTeam = project?.teams.some((t) => isInTeam(t)) ?? false;

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
        <span className="text-slate-700 font-medium">팀 관리</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">팀 관리</h1>
          <p className="text-slate-500 mt-1">
            {project.teams.length}개의 팀이 등록되어 있습니다
          </p>
        </div>
        {isProfessor && (
          <button
            onClick={() => setShowCreateTeam(!showCreateTeam)}
            className="btn-primary text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            새 팀 만들기
          </button>
        )}
      </div>

      {/* Create Team Form */}
      {showCreateTeam && (
        <div className="card p-6 mb-6 animate-fade-in">
          <h3 className="font-semibold text-slate-800 mb-4">새 팀 만들기</h3>
          <form onSubmit={createTeam}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  팀 이름
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="예: A팀"
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  주제 <span className="text-slate-400 font-normal">(선택)</span>
                </label>
                <input
                  type="text"
                  value={teamTopic}
                  onChange={(e) => setTeamTopic(e.target.value)}
                  placeholder="예: 헬스케어 스타트업"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateTeam(false)}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
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
        </div>
      )}

      {/* Teams List */}
      {project.teams.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">아직 팀이 없습니다</h3>
          <p className="text-sm text-slate-500">
            {isProfessor
              ? "새 팀을 만들어 학생들이 참여할 수 있도록 하세요"
              : "교수님이 팀을 생성하면 여기에 표시됩니다"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.teams.map((team) => {
            const isMember = isInTeam(team);
            return (
              <div key={team.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{team.name}</h3>
                    {team.topic && (
                      <p className="text-sm text-slate-500 mt-0.5">{team.topic}</p>
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {team.members.length}명
                  </span>
                </div>

                {/* Members */}
                <div className="space-y-2 mb-4">
                  {team.members.length === 0 ? (
                    <p className="text-sm text-slate-400 py-2">아직 팀원이 없습니다</p>
                  ) : (
                    team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 py-2 px-3 rounded-lg bg-slate-50"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {member.user.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {member.user.name}
                            {member.userId === userId && (
                              <span className="text-xs text-indigo-500 ml-1">(나)</span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{member.user.email}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Student Actions */}
                {!isProfessor && (
                  <div className="pt-3 border-t border-slate-100">
                    {isMember ? (
                      <button
                        onClick={() => leaveTeam(team.id)}
                        disabled={leavingTeam === team.id}
                        className="w-full text-sm font-medium text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {leavingTeam === team.id ? "탈퇴 중..." : "팀 탈퇴"}
                      </button>
                    ) : (
                      <button
                        onClick={() => joinTeam(team.id)}
                        disabled={joiningTeam === team.id || isInAnyTeam}
                        className="w-full btn-primary text-sm justify-center disabled:opacity-50"
                      >
                        {joiningTeam === team.id
                          ? "참여 중..."
                          : isInAnyTeam
                          ? "이미 다른 팀에 소속됨"
                          : "팀 참여"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
