"use client";

interface PhaseCardProps {
  phase: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

export default function PhaseCard({
  phase,
  title,
  subtitle,
  description,
  icon,
  color,
  isActive,
  isCurrent,
  onClick,
}: PhaseCardProps) {
  return (
    <div
      className={`phase-card card p-5 cursor-pointer ${
        isActive
          ? "opacity-100"
          : "opacity-50 cursor-not-allowed grayscale"
      } ${isCurrent ? "ring-2 ring-offset-2" : ""}`}
      style={
        {
          "--phase-color": color,
          ...(isCurrent ? { ringColor: color } : {}),
        } as React.CSSProperties
      }
      onClick={isActive ? onClick : undefined}
      role="button"
      tabIndex={isActive ? 0 : -1}
      onKeyDown={(e) => {
        if (isActive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Phase number & icon row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {phase}
          </span>
          <span className="text-2xl">{icon}</span>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-2">
          {isCurrent && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white animate-pulse"
              style={{ backgroundColor: color }}
            >
              현재 단계
            </span>
          )}
          {!isActive && (
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-lg font-bold mb-0.5"
        style={{ color: isActive ? color : undefined }}
      >
        {title}
      </h3>
      <p className="text-xs font-medium text-slate-400 mb-2">{subtitle}</p>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>

      {/* Progress bar at bottom */}
      {isActive && (
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                backgroundColor: color,
                width: isCurrent ? "50%" : "100%",
              }}
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {isCurrent ? "진행 중" : "완료"}
          </span>
        </div>
      )}
    </div>
  );
}
