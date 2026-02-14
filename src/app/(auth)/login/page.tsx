"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "로그인에 실패했습니다.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("서버 연결에 실패했습니다.");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">로그인</h1>
        <p className="text-sm text-text-muted mt-2">계정에 로그인하세요</p>
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
              비밀번호
            </label>
            <Link href="/forgot-password" className="text-xs text-primary-lighter hover:text-primary transition-colors">
              비밀번호를 잊으셨나요?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-text-muted">
        <p>
          계정이 없으신가요?{" "}
          <Link href="/register" className="font-medium text-primary hover:text-primary-light transition-colors">
            회원가입
          </Link>
        </p>
        <p>
          <Link href="/find-id" className="font-medium text-primary-lighter hover:text-primary transition-colors">
            아이디(이메일) 찾기
          </Link>
        </p>
      </div>
    </div>
  );
}
