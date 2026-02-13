import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-warm flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-primary relative flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-primary-light/30 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] left-[-5%] w-48 h-48 bg-primary-soft/15 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <Link href="/" className="text-xl font-bold text-white tracking-tight">
            Entre<span className="text-primary-soft">LMS</span>
          </Link>
        </div>

        <div className="relative">
          <h2 className="text-2xl font-bold text-white leading-snug mb-4">
            창의적 문제해결을 위한
            <br />학습 플랫폼
          </h2>
          <p className="text-sm text-primary-soft/70 leading-relaxed max-w-xs">
            커리어 앵커 분석, 팀 협업, 단계별 학습을 통해 체계적인 앙트러프러너십 교육을 경험하세요.
          </p>
        </div>

        <p className="relative text-xs text-white/30">
          &copy; {new Date().getFullYear()} EntreLMS
        </p>
      </div>

      {/* Right form area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <Link href="/" className="lg:hidden mb-8 flex items-center gap-1">
          <span className="text-xl font-bold text-primary tracking-tight">
            Entre<span className="text-primary-lighter">LMS</span>
          </span>
        </Link>

        <div className="w-full max-w-sm">
          {children}
        </div>

        <p className="lg:hidden mt-8 text-xs text-text-muted">
          &copy; {new Date().getFullYear()} EntreLMS
        </p>
      </div>
    </div>
  );
}
