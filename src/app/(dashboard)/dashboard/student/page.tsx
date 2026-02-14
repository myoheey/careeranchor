"use client";

import { useState, useEffect, useCallback } from "react";
import CareerAnchorSurvey from "@/components/CareerAnchorSurvey";
import JoinGroupModal from "@/components/JoinGroupModal";

interface Group {
  id: string;
  title: string;
  description: string | null;
  professorName?: string;
  professor?: { name: string };
  _count: {
    members: number;
    careerAnchorResults: number;
  };
}

export default function StudentDashboardPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

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

  if (activeGroup) {
    const group = groups.find((g) => g.id === activeGroup);
    return (
      <div>
        <button onClick={() => setActiveGroup(null)} className="flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          대시보드로 돌아가기
        </button>
        <h2 className="text-lg font-bold text-text mb-6">{group?.title} - 커리어 앵커 검사</h2>
        <CareerAnchorSurvey groupId={activeGroup} onComplete={() => fetchData()} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-text">안녕하세요, {userName}님</h1>
          <p className="text-sm text-text-muted mt-1">참여 중인 그룹에서 커리어 앵커 검사를 진행하세요</p>
        </div>
        <button onClick={() => setShowJoinModal(true)} className="btn-primary text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          그룹 참여
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-primary-lighter" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-text mb-1">참여 중인 그룹이 없습니다</h3>
          <p className="text-sm text-text-muted mb-5">교수님이 공유한 참여 코드를 입력하여 그룹에 참여하세요</p>
          <button onClick={() => setShowJoinModal(true)} className="btn-primary text-sm">그룹 참여하기</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((group) => {
            const profName = group.professorName || group.professor?.name || "";
            return (
              <div
                key={group.id}
                onClick={() => setActiveGroup(group.id)}
                className="card p-5 cursor-pointer hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
              >
                <h3 className="text-base font-semibold text-text mb-1">{group.title}</h3>
                {group.description && <p className="text-sm text-text-muted mb-2 line-clamp-2">{group.description}</p>}
                {profName && <p className="text-xs text-text-muted mb-3">담당: {profName}</p>}
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span>{group._count.members}명 참여</span>
                  <span>{group._count.careerAnchorResults}명 검사완료</span>
                </div>
                <div className="mt-4">
                  <span className="btn-primary text-xs py-2 px-4">검사 시작 / 결과 보기</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showJoinModal && (
        <JoinGroupModal
          onClose={() => setShowJoinModal(false)}
          onJoined={() => { setShowJoinModal(false); fetchData(); }}
        />
      )}
    </div>
  );
}
