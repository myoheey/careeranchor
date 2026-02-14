"use client";

import { useState, useEffect, useCallback } from "react";
import TeamAnchorDashboard from "@/components/TeamAnchorDashboard";

interface Group {
  id: string;
  title: string;
  description: string | null;
  joinCode: string;
  createdAt: string;
  _count: {
    members: number;
    careerAnchorResults: number;
  };
}

export default function ProfessorDashboardPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [groupsRes, meRes] = await Promise.all([
        fetch("/api/groups"),
        fetch("/api/auth/me"),
      ]);
      if (groupsRes.ok) {
        const data = await groupsRes.json();
        setGroups(data.groups);
      }
      if (meRes.ok) {
        const data = await meRes.json();
        setUserName(data.user.name);
      }
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const copyJoinCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch { /* clipboard not available */ }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), description: newDesc.trim() || null }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewDesc("");
        setShowCreate(false);
        fetchData();
      }
    } catch { /* error */ } finally {
      setCreating(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-text">안녕하세요, {userName} 교수님</h1>
          <p className="text-sm text-text-muted mt-1">평가 그룹을 관리하고 학생들의 커리어 앵커 결과를 확인하세요</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 그룹 만들기
        </button>
      </div>

      {showCreate && (
        <div className="card p-6 mb-6 animate-fade-in">
          <h2 className="text-base font-semibold text-text mb-4">새 평가 그룹 만들기</h2>
          <div className="space-y-3">
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="그룹 이름 (예: 2026-1 앙트러프러너십)" className="w-full" />
            <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="설명 (선택사항)" className="w-full" />
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={creating || !newTitle.trim()} className="btn-primary text-sm disabled:opacity-50">
                {creating ? "생성 중..." : "생성하기"}
              </button>
              <button onClick={() => setShowCreate(false)} className="btn-outline text-sm">취소</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-2xl font-bold text-primary">{groups.length}</p>
          <p className="text-sm text-text-muted mt-1">전체 그룹</p>
        </div>
        <div className="card p-5">
          <p className="text-2xl font-bold text-primary">
            {groups.reduce((sum, g) => sum + g._count.members, 0)}
          </p>
          <p className="text-sm text-text-muted mt-1">전체 참여자</p>
        </div>
        <div className="card p-5">
          <p className="text-2xl font-bold text-accent">
            {groups.reduce((sum, g) => sum + g._count.careerAnchorResults, 0)}
          </p>
          <p className="text-sm text-text-muted mt-1">검사 완료</p>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-primary-lighter" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-text mb-1">아직 그룹이 없습니다</h3>
          <p className="text-sm text-text-muted mb-5">첫 평가 그룹을 만들어 학생들과 시작해보세요</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">새 그룹 만들기</button>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="card overflow-hidden">
              <div
                className="p-5 cursor-pointer hover:bg-surface-secondary/50 transition-colors"
                onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-text">{group.title}</h3>
                  <svg className={`w-5 h-5 text-text-muted transition-transform ${expandedGroup === group.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {group.description && <p className="text-sm text-text-muted mb-3">{group.description}</p>}
                <div className="flex items-center gap-4 flex-wrap">
                  <div
                    className="flex items-center gap-2 bg-surface-secondary border border-border-light rounded-lg px-3 py-1.5 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); copyJoinCode(group.joinCode); }}
                  >
                    <span className="text-xs text-text-muted">참여코드</span>
                    <code className="text-sm font-mono font-semibold text-primary tracking-wider">{group.joinCode}</code>
                    {copiedCode === group.joinCode ? (
                      <svg className="w-4 h-4 text-primary-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    )}
                  </div>
                  <span className="text-xs text-text-muted">{group._count.members}명 참여</span>
                  <span className="text-xs text-text-muted">{group._count.careerAnchorResults}명 검사완료</span>
                </div>
              </div>
              {expandedGroup === group.id && (
                <div className="border-t border-border-light p-5 bg-surface-warm animate-fade-in">
                  <TeamAnchorDashboard groupId={group.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
