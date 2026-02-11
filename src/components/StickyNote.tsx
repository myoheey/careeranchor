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
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [position, setPosition] = useState({ x: posX, y: posY });

  const noteRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Sync position from props when not dragging
  useEffect(() => {
    if (!isDragging) {
      setPosition({ x: posX, y: posY });
    }
  }, [posX, posY, isDragging]);

  // Sync content from props when not editing
  useEffect(() => {
    if (!isEditing) {
      setEditContent(content);
    }
  }, [content, isEditing]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isEditing || showColorPicker) return;
      e.preventDefault();
      e.stopPropagation();
      const rect = noteRef.current?.getBoundingClientRect();
      if (!rect) return;

      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      setIsDragging(true);
    },
    [isEditing, showColorPicker, position]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      setPosition({ x: Math.max(0, newX), y: Math.max(0, newY) });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onUpdate(id, { posX: position.x, posY: position.y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, id, onUpdate, position.x, position.y]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isOwner) return;
      e.stopPropagation();
      setIsEditing(true);
    },
    [isOwner]
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
      className={`sticky-note absolute rounded-lg select-none group ${
        isDragging ? "dragging" : ""
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        minHeight: `${height}px`,
        backgroundColor: color,
        zIndex: isDragging ? 100 : 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
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
