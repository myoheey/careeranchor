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

  const themeColor = (theme: string) => {
    const colors: Record<string, string> = {
      STARTUP: "text-red-600 bg-red-50",
      JOB_CREATION: "text-blue-600 bg-blue-50",
      PROBLEM_SOLVING: "text-green-600 bg-green-50",
    };
    return colors[theme] || "text-slate-600 bg-slate-50";
  };

  // Search project by join code
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
            : "프로젝트를 찾을 수 없습니다. 코드를 다시 확인해주세요."
        );
      } finally {
        setLoading(false);
      }
    },
    [joinCode]
  );

  // Join the project
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                프로젝트 참여
              </h3>
              <p className="text-xs text-slate-400">
                참여 코드를 입력하세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Search form */}
          <form onSubmit={handleSearch} className="mb-4">
            <label
              htmlFor="join-code"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              참여 코드 <span className="text-red-400">*</span>
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
                placeholder="예: A1B2C3D4"
                className="flex-1 font-mono text-center text-lg tracking-widest uppercase"
                maxLength={8}
              />
              <button
                type="submit"
                disabled={loading || !joinCode.trim()}
                className="btn-primary text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>

          {/* Project preview */}
          {project && (
            <div className="card p-4 border-2 border-indigo-100 bg-indigo-50/30 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shrink-0">
                  {project.theme === "STARTUP"
                    ? "🚀"
                    : project.theme === "JOB_CREATION"
                    ? "💼"
                    : "🔧"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">
                    {project.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${themeColor(
                        project.theme
                      )}`}
                    >
                      {themeLabel(project.theme)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {project.professorName}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full btn-accent text-sm mt-4 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    참여 중...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    이 프로젝트에 참여하기
                  </>
                )}
              </button>
            </div>
          )}

          {/* Hint */}
          {!project && !error && (
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl">
              <svg
                className="w-4 h-4 text-slate-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs text-slate-500 leading-relaxed">
                교수님이 공유한 8자리 참여 코드를 입력하세요. 코드는 대소문자를
                구분하지 않습니다.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-center"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
