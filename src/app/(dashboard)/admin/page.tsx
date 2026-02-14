"use client";

import { useState, useEffect } from "react";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  gender: string | null;
  ageRange: string | null;
  job: string | null;
  industry: string | null;
  experience: string | null;
  createdAt: string;
  hasResult: boolean;
  topAnchor: string | null;
  hasAiReport: boolean;
  resultDate: string | null;
}

interface Stats {
  totalUsers: number;
  totalResults: number;
  totalWithAiReport: number;
  completionRate: number;
}

const ANCHOR_NAMES: Record<string, string> = {
  TF: "전문/기술", GM: "관리", AU: "자율/독립", SE: "안정/보장",
  EC: "창업/창의", SV: "봉사/헌신", CH: "순수 도전", LS: "라이프스타일",
};

const GENDER_MAP: Record<string, string> = { male: "남", female: "여", other: "기타" };
const AGE_MAP: Record<string, string> = { "20s": "20대", "30s": "30대", "40s": "40대", "50s": "50대", "60+": "60+" };
const EXP_MAP: Record<string, string> = { "0-2": "0-2년", "3-5": "3-5년", "6-10": "6-10년", "11-15": "11-15년", "16-20": "16-20년", "20+": "20년+" };

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin");
        if (res.status === 403) {
          setError("관리자 권한이 필요합니다.");
          return;
        }
        if (!res.ok) {
          setError("데이터를 불러오는 데 실패했습니다.");
          return;
        }
        const data = await res.json();
        setStats(data.stats);
        setUsers(data.users);
      } catch {
        setError("서버 연결에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.includes(search) || u.email.includes(search) || (u.job || "").includes(search)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-1">관리자 대시보드</h1>
        <p className="text-sm text-text-muted">사이트 현황 및 사용자 관리</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="전체 회원" value={stats.totalUsers} icon="👥" />
          <StatCard label="검사 완료" value={stats.totalResults} icon="📋" />
          <StatCard label="AI 리포트" value={stats.totalWithAiReport} icon="🤖" />
          <StatCard label="완료율" value={`${stats.completionRate}%`} icon="📊" />
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름, 이메일, 직업으로 검색..."
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-600">이름</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">이메일</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">프로필</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">검사</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">가입일</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{u.name}</span>
                      {u.role === "admin" && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-semibold">Admin</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{u.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {u.gender && <Tag>{GENDER_MAP[u.gender] || u.gender}</Tag>}
                      {u.ageRange && <Tag>{AGE_MAP[u.ageRange] || u.ageRange}</Tag>}
                      {u.job && <Tag>{u.job}</Tag>}
                      {u.experience && <Tag>{EXP_MAP[u.experience] || u.experience}</Tag>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {u.hasResult ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {ANCHOR_NAMES[u.topAnchor || ""] || u.topAnchor}
                        </span>
                        {u.hasAiReport && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">AI</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">미완료</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    {search ? "검색 결과가 없습니다." : "등록된 사용자가 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-400 text-right">
        총 {filteredUsers.length}명{search && ` (전체 ${users.length}명)`}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
      {children}
    </span>
  );
}
