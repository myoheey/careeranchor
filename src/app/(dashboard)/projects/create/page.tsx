"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ThemeType = "STARTUP" | "JOB_CREATION" | "PROBLEM_SOLVING";

const themes: {
  key: ThemeType;
  label: string;
  english: string;
  description: string;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  selectedBg: string;
  selectedBorder: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "STARTUP",
    label: "창업",
    english: "Startup",
    description: "고객 문제를 해결하는 비즈니스를 창출합니다",
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    selectedBg: "bg-red-50",
    selectedBorder: "border-red-500",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    key: "JOB_CREATION",
    label: "창직",
    english: "Job Creation",
    description: "새로운 직업과 커리어를 설계합니다",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    selectedBg: "bg-blue-50",
    selectedBorder: "border-blue-500",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    key: "PROBLEM_SOLVING",
    label: "문제해결",
    english: "Problem Solving",
    description: "사회 문제를 창의적으로 해결합니다",
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    selectedBg: "bg-green-50",
    selectedBorder: "border-green-500",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function CreateProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState<ThemeType | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!theme) {
      setError("테마를 선택해주세요.");
      return;
    }

    if (!title.trim()) {
      setError("프로젝트 제목을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), theme }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "프로젝트 생성에 실패했습니다.");
        setLoading(false);
        return;
      }

      router.push(`/projects/${data.project.id}`);
    } catch {
      setError("서버 연결에 실패했습니다. 다시 시도해주세요.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
          대시보드
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-700 font-medium">새 프로젝트</span>
      </nav>

      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">새 프로젝트 만들기</h1>
        <p className="text-sm text-slate-500 mb-8">
          테마를 선택하고 프로젝트 정보를 입력하세요
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-4">
              테마 선택
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {themes.map((t) => (
                <label
                  key={t.key}
                  className={`relative cursor-pointer rounded-2xl border-2 p-6 text-center transition-all duration-200 hover:shadow-lg ${
                    theme === t.key
                      ? `${t.selectedBorder} ${t.selectedBg} shadow-md`
                      : `border-slate-200 bg-white hover:border-slate-300`
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={t.key}
                    checked={theme === t.key}
                    onChange={(e) => setTheme(e.target.value as ThemeType)}
                    className="sr-only"
                  />
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-xl ${t.bgColor} ${t.iconColor} flex items-center justify-center transition-colors`}>
                    {t.icon}
                  </div>
                  <p className="text-base font-bold text-slate-800 mb-0.5">{t.label}</p>
                  <p className="text-xs text-slate-400 mb-2">{t.english}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{t.description}</p>
                  {theme === t.key && (
                    <div className="absolute top-3 right-3">
                      <svg className={`w-6 h-6 ${t.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">
              프로젝트 제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 2025 1학기 앙트러프러너십"
              required
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
              설명 <span className="text-slate-400 font-normal">(선택)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
              rows={3}
              className="w-full resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  생성 중...
                </>
              ) : (
                "프로젝트 만들기"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
