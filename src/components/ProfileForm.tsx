"use client";

import { useState, useEffect, useCallback } from "react";

interface ProfileData {
  gender: string;
  ageRange: string;
  job: string;
  industry: string;
  experience: string;
}

interface ProfileFormProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const GENDER_OPTIONS = [
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
  { value: "other", label: "기타" },
];

const AGE_OPTIONS = [
  { value: "20s", label: "20대" },
  { value: "30s", label: "30대" },
  { value: "40s", label: "40대" },
  { value: "50s", label: "50대" },
  { value: "60+", label: "60대 이상" },
];

const EXPERIENCE_OPTIONS = [
  { value: "0-2", label: "0~2년" },
  { value: "3-5", label: "3~5년" },
  { value: "6-10", label: "6~10년" },
  { value: "11-15", label: "11~15년" },
  { value: "16-20", label: "16~20년" },
  { value: "20+", label: "20년 이상" },
];

const INDUSTRY_OPTIONS = [
  "IT/소프트웨어",
  "금융/보험",
  "제조/생산",
  "교육",
  "의료/헬스케어",
  "유통/물류",
  "미디어/콘텐츠",
  "건설/부동산",
  "공공/정부",
  "컨설팅",
  "마케팅/광고",
  "디자인/예술",
  "법률",
  "연구/R&D",
  "서비스업",
  "기타",
];

export default function ProfileForm({ onComplete, onSkip }: ProfileFormProps) {
  const [profile, setProfile] = useState<ProfileData>({
    gender: "",
    ageRange: "",
    job: "",
    industry: "",
    experience: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            const p = data.profile;
            if (p.gender || p.ageRange || p.job || p.industry || p.experience) {
              setProfile({
                gender: p.gender || "",
                ageRange: p.ageRange || "",
                job: p.job || "",
                industry: p.industry || "",
                experience: p.experience || "",
              });
            }
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        onComplete();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }, [profile, onComplete]);

  const isValid = profile.gender && profile.ageRange && profile.job && profile.experience;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10 p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">기본 정보 입력</h2>
            <p className="text-sm text-slate-500">맞춤형 AI 분석을 위해 기본 정보를 입력해주세요</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Gender */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-sm font-semibold text-slate-900 mb-3">성별 <span className="text-red-400">*</span></label>
          <div className="flex gap-2">
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setProfile((p) => ({ ...p, gender: opt.value }))}
                className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                  profile.gender === opt.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 text-slate-600 hover:border-primary/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Age Range */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-sm font-semibold text-slate-900 mb-3">연령대 <span className="text-red-400">*</span></label>
          <div className="flex flex-wrap gap-2">
            {AGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setProfile((p) => ({ ...p, ageRange: opt.value }))}
                className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                  profile.ageRange === opt.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 text-slate-600 hover:border-primary/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Current Job */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-sm font-semibold text-slate-900 mb-3">현재 직업/직무 <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={profile.job}
            onChange={(e) => setProfile((p) => ({ ...p, job: e.target.value }))}
            placeholder="예: 소프트웨어 개발자, 마케팅 매니저, 대학생 등"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {/* Industry */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-sm font-semibold text-slate-900 mb-3">업종/산업</label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRY_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setProfile((p) => ({ ...p, industry: opt }))}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  profile.industry === opt
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 text-slate-600 hover:border-primary/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-sm font-semibold text-slate-900 mb-3">경력 <span className="text-red-400">*</span></label>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setProfile((p) => ({ ...p, experience: opt.value }))}
                className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                  profile.experience === opt.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-slate-200 text-slate-600 hover:border-primary/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        {onSkip && (
          <button onClick={onSkip} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            건너뛰기
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!isValid || saving}
          className="btn-primary px-8 py-2.5 ml-auto disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "저장 중..." : "다음 단계로"}
        </button>
      </div>
    </div>
  );
}
