"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface CreateTemplateModalProps {
  projectId: string;
  phase: number;
  theme: string;
  onCreated: () => void;
  onClose: () => void;
}

export default function CreateTemplateModal({
  projectId,
  phase,
  theme,
  onCreated,
  onClose,
}: CreateTemplateModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) {
        setError("템플릿 제목을 입력해주세요.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            phase,
            theme,
            title: title.trim(),
            description: description.trim(),
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create template");
        }

        onCreated();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "템플릿 생성에 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    },
    [title, description, projectId, phase, theme, onCreated]
  );

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
            <h3 className="text-base font-semibold text-slate-900">새 템플릿 만들기</h3>
            <p className="text-xs text-slate-500 mt-0.5">Phase {phase}</p>
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

        <form onSubmit={handleSubmit} className="p-5">
          {error && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label htmlFor="template-title" className="block text-sm font-medium text-slate-700 mb-1">
                제목
              </label>
              <input
                ref={titleInputRef}
                id="template-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="템플릿 제목"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="template-description" className="block text-sm font-medium text-slate-700 mb-1">
                설명
              </label>
              <textarea
                id="template-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="템플릿 설명 (선택)"
                rows={3}
                className="resize-none"
                maxLength={500}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "생성 중..." : "템플릿 생성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
