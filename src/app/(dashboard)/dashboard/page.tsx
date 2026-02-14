"use client";

import { useState, useEffect } from "react";
import ProfileForm from "@/components/ProfileForm";
import CareerAnchorSurvey from "@/components/CareerAnchorSurvey";
import AIReport from "@/components/AIReport";

type Step = "profile" | "survey" | "report";

export default function DashboardPage() {
  const [step, setStep] = useState<Step>("profile");
  const [hasResults, setHasResults] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadState() {
      try {
        const [profileRes, anchorRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/career-anchor"),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const p = profileData.profile;
          if (p && (p.gender || p.ageRange || p.job)) {
            setHasProfile(true);
          }
        }

        if (anchorRes.ok) {
          const anchorData = await anchorRes.json();
          if (anchorData.result) {
            setHasResults(true);
            if (anchorData.result.aiReport) {
              setAiReport(anchorData.result.aiReport);
            }
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadState();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (hasResults) {
        setStep("report");
      } else if (hasProfile) {
        setStep("survey");
      } else {
        setStep("profile");
      }
    }
  }, [loading, hasProfile, hasResults]);

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

  return (
    <div>
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          {[
            { key: "profile", label: "기본 정보", num: 1 },
            { key: "survey", label: "진단 검사", num: 2 },
            { key: "report", label: "AI 리포트", num: 3 },
          ].map((s, i) => {
            const isActive = step === s.key;
            const isCompleted =
              (s.key === "profile" && hasProfile) ||
              (s.key === "survey" && hasResults) ||
              (s.key === "report" && !!aiReport);
            return (
              <div key={s.key} className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => {
                    if (s.key === "profile") setStep("profile");
                    else if (s.key === "survey" && hasProfile) setStep("survey");
                    else if (s.key === "report" && hasResults) setStep("report");
                  }}
                  className={`flex items-center gap-2 w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : isCompleted
                        ? "bg-primary/10 text-primary"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive ? "bg-white/20" : isCompleted ? "bg-primary/20" : "bg-slate-200"
                  }`}>
                    {isCompleted && !isActive ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.num
                    )}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < 2 && <div className="w-6 h-px bg-slate-200 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      {step === "profile" && (
        <ProfileForm
          onComplete={() => {
            setHasProfile(true);
            setStep("survey");
          }}
          onSkip={() => {
            setHasProfile(true);
            setStep("survey");
          }}
        />
      )}

      {step === "survey" && (
        <CareerAnchorSurvey
          onComplete={() => {
            setHasResults(true);
            setAiReport(null);
            setStep("report");
          }}
        />
      )}

      {step === "report" && (
        <AIReport existingReport={aiReport} hasResults={hasResults} />
      )}
    </div>
  );
}
