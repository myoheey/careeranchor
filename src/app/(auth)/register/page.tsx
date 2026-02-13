"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PROFESSOR" | "STUDENT" | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("역할을 선택해주세요.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "회원가입에 실패했습니다.");
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
        <h1 className="text-2xl font-bold text-text">회원가입</h1>
        <p className="text-sm text-text-muted mt-2">새 계정을 만들고 학습을 시작하세요</p>
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
            placeholder="홍길동"
            required
          />
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
            비밀번호
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
          <label className="block text-sm font-medium text-text-secondary mb-2">역할</label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`relative cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${
                role === "PROFESSOR"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary-lighter/40"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="PROFESSOR"
                checked={role === "PROFESSOR"}
                onChange={(e) => setRole(e.target.value as "PROFESSOR")}
                className="sr-only"
              />
              <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                role === "PROFESSOR" ? "bg-primary text-white" : "bg-surface-secondary text-text-muted"
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className={`text-sm font-medium ${role === "PROFESSOR" ? "text-primary" : "text-text-secondary"}`}>
                교수자
              </p>
            </label>

            <label
              className={`relative cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${
                role === "STUDENT"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary-lighter/40"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="STUDENT"
                checked={role === "STUDENT"}
                onChange={(e) => setRole(e.target.value as "STUDENT")}
                className="sr-only"
              />
              <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                role === "STUDENT" ? "bg-primary text-white" : "bg-surface-secondary text-text-muted"
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <p className={`text-sm font-medium ${role === "STUDENT" ? "text-primary" : "text-text-secondary"}`}>
                학생
              </p>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary-light transition-colors">
          로그인
        </Link>
      </p>
    </div>
  );
}
