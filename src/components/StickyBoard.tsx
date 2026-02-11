"use client";

import { useState, useEffect, useCallback } from "react";
import StickyNote from "./StickyNote";

interface Note {
  id: string;
  content: string;
  color: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
  authorName: string;
  authorId: string;
}

interface StickyBoardProps {
  templateId: string;
  teamId: string;
  userId: string;
  userName: string;
}

export default function StickyBoard({
  templateId,
  teamId,
  userId,
  userName,
}: StickyBoardProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/notes?templateId=${templateId}&teamId=${teamId}`
      );
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes ?? data ?? []);
      }
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  }, [templateId, teamId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Add new note
  const handleAddNote = useCallback(async () => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          teamId,
          content: "",
          color: "#FEF3C7",
          posX: 100 + Math.random() * 200,
          posY: 100 + Math.random() * 200,
          width: 200,
          height: 160,
        }),
      });
      if (res.ok) {
        const newNote = await res.json();
        setNotes((prev) => [
          ...prev,
          {
            ...newNote,
            authorName: userName,
            authorId: userId,
          },
        ]);
      }
    } catch {
      // handle silently
    }
  }, [templateId, teamId, userName, userId]);

  // Update note
  const handleUpdateNote = useCallback(
    async (
      id: string,
      data: { content?: string; color?: string; posX?: number; posY?: number }
    ) => {
      // Optimistic update
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, ...data } : note))
      );

      try {
        await fetch(`/api/notes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch {
        // Revert on failure
        fetchNotes();
      }
    },
    [fetchNotes]
  );

  // Delete note
  const handleDeleteNote = useCallback(
    async (id: string) => {
      setNotes((prev) => prev.filter((note) => note.id !== id));

      try {
        await fetch(`/api/notes/${id}`, { method: "DELETE" });
      } catch {
        fetchNotes();
      }
    },
    [fetchNotes]
  );

  // AI summary
  const handleAiSummary = useCallback(async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, teamId }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data.result ?? data.content ?? "");
        setShowAiModal(true);
      }
    } catch {
      // handle silently
    } finally {
      setAiLoading(false);
    }
  }, [templateId, teamId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-sm text-slate-500">Loading board...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="sticky top-0 z-30 flex items-center gap-3 p-3 bg-white/80 backdrop-blur-md border-b border-slate-200 rounded-t-xl">
        <button
          onClick={handleAddNote}
          className="btn-primary text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Note
        </button>

        <button
          onClick={handleAiSummary}
          disabled={aiLoading}
          className="btn-accent text-sm disabled:opacity-50"
        >
          {aiLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              AI 요약 생성
            </>
          )}
        </button>

        <span className="ml-auto text-xs text-slate-400">
          {notes.length} notes
        </span>
      </div>

      {/* Board canvas */}
      <div
        className="relative overflow-auto bg-slate-50 rounded-b-xl"
        style={{
          height: "calc(100vh - 220px)",
        }}
      >
        <div
          className="relative"
          style={{
            minWidth: "2000px",
            minHeight: "1500px",
            backgroundImage:
              "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              id={note.id}
              content={note.content}
              color={note.color}
              posX={note.posX}
              posY={note.posY}
              width={note.width}
              height={note.height}
              authorName={note.authorName}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
              isOwner={note.authorId === userId}
            />
          ))}

          {notes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-6xl mb-4 opacity-30">📝</div>
                <p className="text-slate-400 text-lg font-medium">
                  No notes yet
                </p>
                <p className="text-slate-300 text-sm mt-1">
                  Click &quot;+ Add Note&quot; to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Result Modal */}
      {showAiModal && aiResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowAiModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    AI Summary
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generated from {notes.length} notes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="prose prose-sm max-w-none">
                {/* Render AI result with formatting */}
                {aiResult.split("\n").map((line, i) => {
                  // Handle headings
                  if (line.startsWith("### ")) {
                    return (
                      <h4
                        key={i}
                        className="text-base font-bold text-indigo-700 mt-4 mb-2"
                      >
                        {line.replace("### ", "")}
                      </h4>
                    );
                  }
                  if (line.startsWith("## ")) {
                    return (
                      <h3
                        key={i}
                        className="text-lg font-bold text-slate-900 mt-5 mb-2 pb-1 border-b border-slate-100"
                      >
                        {line.replace("## ", "")}
                      </h3>
                    );
                  }
                  if (line.startsWith("# ")) {
                    return (
                      <h2
                        key={i}
                        className="text-xl font-bold text-slate-900 mt-6 mb-3"
                      >
                        {line.replace("# ", "")}
                      </h2>
                    );
                  }
                  // Handle bullet points
                  if (line.startsWith("- ") || line.startsWith("* ")) {
                    return (
                      <div key={i} className="flex gap-2 mb-1 ml-2">
                        <span className="text-indigo-400 mt-0.5">&#x2022;</span>
                        <span className="text-slate-700 text-sm">
                          {line.replace(/^[-*] /, "")}
                        </span>
                      </div>
                    );
                  }
                  // Handle numbered items
                  if (/^\d+\. /.test(line)) {
                    const num = line.match(/^(\d+)\. /)?.[1];
                    return (
                      <div key={i} className="flex gap-2 mb-1.5 ml-2">
                        <span className="text-indigo-500 font-bold text-sm min-w-[20px]">
                          {num}.
                        </span>
                        <span className="text-slate-700 text-sm">
                          {line.replace(/^\d+\. /, "")}
                        </span>
                      </div>
                    );
                  }
                  // Handle bold text
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <p
                        key={i}
                        className="font-semibold text-slate-800 mt-3 mb-1"
                      >
                        {line.replace(/\*\*/g, "")}
                      </p>
                    );
                  }
                  // Empty line
                  if (line.trim() === "") {
                    return <div key={i} className="h-2" />;
                  }
                  // Regular paragraph
                  return (
                    <p key={i} className="text-sm text-slate-700 mb-1 leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowAiModal(false)}
                className="btn-primary text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
