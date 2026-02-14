"use client";

import { useState, useEffect } from "react";
import CareerAnchorSurvey from "@/components/CareerAnchorSurvey";
import AIReport from "@/components/AIReport";

type Tab = "survey" | "report";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("survey");
  const [hasResults, setHasResults] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  useEffect(() => {
    async function loadState() {
      try {
        const res = await fetch("/api/career-anchor");
        if (res.ok) {
          const data = await res.json();
          if (data.result) {
            setHasResults(true);
            if (data.result.aiReport) {
              setAiReport(data.result.aiReport);
            }
          }
        }
      } catch {
        // ignore
      }
    }
    loadState();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-1">커리어 앵커 진단</h1>
        <p className="text-sm text-text-muted">검사를 완료하고 AI 분석 리포트를 확인하세요</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white rounded-lg border border-slate-200 p-1 mb-6">
        <button
          onClick={() => setActiveTab("survey")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === "survey"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
          진단 검사
        </button>
        <button
          onClick={() => setActiveTab("report")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === "report"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          AI 리포트
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "survey" && (
        <CareerAnchorSurvey
          onComplete={() => {
            setHasResults(true);
            setAiReport(null);
            setTimeout(() => setActiveTab("report"), 500);
          }}
        />
      )}
      {activeTab === "report" && (
        <AIReport existingReport={aiReport} hasResults={hasResults} />
      )}
    </div>
  );
}
