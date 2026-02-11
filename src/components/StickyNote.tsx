"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const STICKY_COLORS = [
  "#FEF3C7",
  "#DBEAFE",
  "#D1FAE5",
  "#FCE7F3",
  "#E0E7FF",
  "#FED7AA",
  "#CCFBF1",
  "#F3E8FF",
];

interface StickyNoteProps {
  id: string;
  content: string;
  color: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
  authorName: string;
  onUpdate: (
    id: string,
    data: {
      content?: string;
      color?: string;
      posX?: number;
      posY?: number;
    }
  ) => void;
  onDelete: (id: string) => void;
  isOwner: boolean;
}

export default function StickyNote({
  id,
  content,
  color,
  posX,
  posY,
  width,
  height,
  authorName,
  onUpdate,
  onDelete,
  isOwner,
}: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const noteRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Drag via DOM manipulation (avoids React state in effect)
  useEffect(() => {
    const el = noteRef.current;
    if (!el) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (isEditing || showColorPicker) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.tagName === "TEXTAREA") return;

      e.preventDefault();
      e.stopPropagation();
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: posX,
        origY: posY,
      };
      el.style.zIndex = "100";
      el.style.cursor = "grabbing";
      el.classList.add("dragging");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      const newX = Math.max(0, dragState.current.origX + dx);
      const newY = Math.max(0, dragState.current.origY + dy);
      el.style.left = `${newX}px`;
      el.style.top = `${newY}px`;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      const newX = Math.max(0, dragState.current.origX + dx);
      const newY = Math.max(0, dragState.current.origY + dy);
      dragState.current = null;
      el.style.zIndex = "1";
      el.style.cursor = "grab";
      el.classList.remove("dragging");
      if (dx !== 0 || dy !== 0) {
        onUpdate(id, { posX: newX, posY: newY });
      }
    };

    el.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [id, posX, posY, isEditing, showColorPicker, onUpdate]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isOwner) return;
      e.stopPropagation();
      setEditContent(content);
      setIsEditing(true);
    },
    [isOwner, content]
  );

  const handleEditBlur = useCallback(() => {
    setIsEditing(false);
    if (editContent !== content) {
      onUpdate(id, { content: editContent });
    }
  }, [editContent, content, id, onUpdate]);

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
        setEditContent(content);
      }
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        handleEditBlur();
      }
    },
    [content, handleEditBlur]
  );

  const handleColorChange = useCallback(
    (newColor: string) => {
      onUpdate(id, { color: newColor });
      setShowColorPicker(false);
    },
    [id, onUpdate]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onDelete(id);
    },
    [id, onDelete]
  );

  return (
    <div
      ref={noteRef}
      className="sticky-note absolute rounded-lg select-none group"
      style={{
        left: `${posX}px`,
        top: `${posY}px`,
        width: `${width}px`,
        minHeight: `${height}px`,
        backgroundColor: color,
        zIndex: 1,
        cursor: "grab",
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* Delete button */}
      {isOwner && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10 shadow-sm"
          title="Delete"
        >
          X
        </button>
      )}

      {/* Color picker toggle */}
      {isOwner && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker(!showColorPicker);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full border-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
          style={{ backgroundColor: color }}
          title="Change color"
        />
      )}

      {/* Color picker dropdown */}
      {showColorPicker && (
        <div
          className="absolute top-8 right-1 bg-white rounded-lg shadow-lg p-2 z-20 flex flex-wrap gap-1.5 w-[120px]"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {STICKY_COLORS.map((c) => (
            <button
              key={c}
              onClick={(e) => {
                e.stopPropagation();
                handleColorChange(c);
              }}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                c === color ? "border-indigo-500 scale-110" : "border-slate-200"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}

      {/* Content area */}
      <div className="p-3 pt-4 h-full flex flex-col">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleEditBlur}
            onKeyDown={handleEditKeyDown}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full flex-1 bg-transparent border-none outline-none resize-none text-sm text-slate-800 leading-relaxed"
            style={{ minHeight: `${height - 48}px` }}
            placeholder="Write something..."
          />
        ) : (
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap flex-1">
            {content || "Double-click to edit"}
          </p>
        )}

        {/* Author */}
        <div className="mt-2 pt-1.5 border-t border-black/5">
          <span className="text-[10px] text-slate-500 font-medium">
            {authorName}
          </span>
        </div>
      </div>
    </div>
  );
}
