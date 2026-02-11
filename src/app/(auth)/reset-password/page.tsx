"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="card p-6 text-center">
        <p className="text-sm text-red-500 mb-4">유효하지 않은 링크입니다.</p>
        <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          비밀번호 재설정 다시 요청
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "비밀번호 변경에 실패했습니다.");
        setLoading(false);
        return;
      }

      setDone(true);
    } catch {
      setError("서버 연결에 실패했습니다.");
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="card p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-emerald-50 flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-slate-900 mb-2">비밀번호 변경 완료</h1>
        <p className="text-sm text-slate-500 mb-6">
          새 비밀번호로 로그인할 수 있습니다.
        </p>
        <Link href="/login" className="btn-primary inline-flex justify-center px-6 py-2.5">
          로그인하기
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-slate-900">새 비밀번호 설정</h1>
        <p className="text-sm text-slate-500 mt-1">
          새로운 비밀번호를 입력해주세요.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            새 비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자 이상"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 mb-1">
            비밀번호 확인
          </label>
          <input
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="card p-6 text-center">
          <p className="text-sm text-slate-500">로딩 중...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
