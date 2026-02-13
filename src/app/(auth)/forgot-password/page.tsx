"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "요청에 실패했습니다.");
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/8 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-text mb-2">이메일을 확인하세요</h1>
        <p className="text-sm text-text-muted mb-6">
          <strong className="text-text-secondary">{email}</strong>로 비밀번호 재설정 링크를 보냈습니다.
          이메일이 도착하지 않으면 스팸 폴더를 확인해주세요.
        </p>
        <Link href="/login" className="text-sm font-medium text-primary hover:text-primary-light transition-colors">
          로그인으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">비밀번호 재설정</h1>
        <p className="text-sm text-text-muted mt-2">
          가입한 이메일을 입력하면 재설정 링크를 보내드립니다.
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200/60 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "발송 중..." : "재설정 링크 보내기"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        <Link href="/login" className="font-medium text-primary hover:text-primary-light transition-colors">
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
