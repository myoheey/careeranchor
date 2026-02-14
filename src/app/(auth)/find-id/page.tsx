"use client";

import { useState } from "react";
import Link from "next/link";

export default function FindIdPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [foundEmail, setFoundEmail] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFoundEmail(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/find-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "조회에 실패했습니다.");
        setLoading(false);
        return;
      }

      setFoundEmail(data.email);
    } catch {
      setError("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (foundEmail) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/8 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-text mb-2">아이디를 찾았습니다</h1>
        <p className="text-sm text-text-muted mb-2">등록된 이메일 주소입니다:</p>
        <p className="text-lg font-semibold text-primary mb-6">{foundEmail}</p>
        <div className="flex flex-col gap-2 items-center">
          <Link href="/login" className="btn-primary px-8 py-2.5 text-sm">로그인하기</Link>
          <button
            onClick={() => { setFoundEmail(null); setName(""); }}
            className="text-sm text-text-muted hover:text-primary transition-colors"
          >
            다시 검색하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">아이디(이메일) 찾기</h1>
        <p className="text-sm text-text-muted mt-2">
          가입 시 사용한 이름을 입력하면 등록된 이메일을 알려드립니다.
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200/60 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="가입 시 사용한 이름"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "검색 중..." : "아이디 찾기"}
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
