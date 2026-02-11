"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface JoinProjectModalProps {
  onJoined: () => void;
  onClose: () => void;
}

interface ProjectPreview {
  id: string;
  name: string;
  theme: string;
  professorName: string;
}

export default function JoinProjectModal({
  onJoined,
  onClose,
}: JoinProjectModalProps) {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [project, setProject] = useState<ProjectPreview | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  const themeLabel = (theme: string) => {
    const labels: Record<string, string> = {
      STARTUP: "창업",
      JOB_CREATION: "창직",
      PROBLEM_SOLVING: "문제해결",
    };
    return labels[theme] || theme;
  };

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const code = joinCode.trim().toUpperCase();
      if (!code) {
        setError("참여 코드를 입력해주세요.");
        return;
      }

      setLoading(true);
      setError("");
      setProject(null);

      try {
        const res = await fetch(`/api/projects/${code}/join`, {
          method: "GET",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "프로젝트를 찾을 수 없습니다.");
        }

        const data = await res.json();
        setProject(data.project ?? data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "프로젝트를 찾을 수 없습니다."
        );
      } finally {
        setLoading(false);
      }
    },
    [joinCode]
  );

  const handleJoin = useCallback(async () => {
    if (!project) return;

    setJoining(true);
    setError("");

    try {
      const res = await fetch(`/api/projects/${joinCode.trim().toUpperCase()}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "프로젝트 참여에 실패했습니다.");
      }

      onJoined();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "프로젝트 참여에 실패했습니다."
      );
    } finally {
      setJoining(false);
    }
  }, [project, joinCode, onJoined]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 animate-fade-in"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900">프로젝트 참여</h3>
            <p className="text-xs text-slate-500 mt-0.5">참여 코드를 입력하세요</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {error && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSearch} className="mb-4">
            <label htmlFor="join-code" className="block text-sm font-medium text-slate-700 mb-1">
              참여 코드
            </label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                id="join-code"
                type="text"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value.toUpperCase());
                  setProject(null);
                  setError("");
                }}
                placeholder="A1B2C3D4"
                className="flex-1 font-mono text-center tracking-widest uppercase"
                maxLength={8}
              />
              <button
                type="submit"
                disabled={loading || !joinCode.trim()}
                className="btn-primary shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "검색"}
              </button>
            </div>
          </form>

          {project && (
            <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/50 animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 text-sm truncate">
                    {project.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {themeLabel(project.theme)} &middot; {project.professorName}
                  </p>
                </div>
              </div>
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? "참여 중..." : "이 프로젝트에 참여하기"}
              </button>
            </div>
          )}

          {!project && !error && (
            <p className="text-xs text-slate-400 leading-relaxed">
              교수님이 공유한 8자리 참여 코드를 입력하세요.
            </p>
          )}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full btn-outline justify-center"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
