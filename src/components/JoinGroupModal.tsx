"use client";

import { useState } from "react";

interface GroupPreview {
  id: string;
  title: string;
  description: string | null;
  professorName: string;
  memberCount: number;
}

interface JoinGroupModalProps {
  onClose: () => void;
  onJoined: () => void;
}

export default function JoinGroupModal({ onClose, onJoined }: JoinGroupModalProps) {
  const [code, setCode] = useState("");
  const [preview, setPreview] = useState<GroupPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setPreview(null);
    try {
      const res = await fetch(`/api/groups/join?code=${code.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setPreview(data.group);
      } else {
        const data = await res.json();
        setError(data.error || "그룹을 찾을 수 없습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    setError("");
    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joinCode: code.trim() }),
      });
      if (res.ok) {
        onJoined();
      } else {
        const data = await res.json();
        setError(data.error || "참여에 실패했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">그룹 참여하기</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2 mb-4">
          <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="참여 코드 입력" className="flex-1 font-mono tracking-wider uppercase" maxLength={8} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
          <button onClick={handleSearch} disabled={loading || !code.trim()} className="btn-primary text-sm disabled:opacity-50">
            {loading ? "검색 중..." : "검색"}
          </button>
        </div>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        {preview && (
          <div className="border border-slate-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-slate-900 mb-1">{preview.title}</h3>
            {preview.description && <p className="text-sm text-slate-500 mb-2">{preview.description}</p>}
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>담당: {preview.professorName}</span>
              <span>{preview.memberCount}명 참여 중</span>
            </div>
          </div>
        )}
        {preview && (
          <button onClick={handleJoin} disabled={joining} className="btn-primary w-full disabled:opacity-50">
            {joining ? "참여 중..." : "참여하기"}
          </button>
        )}
      </div>
    </div>
  );
}
