import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-warm">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-light">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold text-primary tracking-tight">
            Career<span className="text-primary-lighter">Anchor</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-text-secondary hover:text-primary transition-colors font-medium">로그인</Link>
            <Link href="/register" className="btn-primary text-sm">시작하기</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary-soft/8 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-[15%] w-80 h-80 bg-accent-soft/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-soft" />
              <span className="text-xs font-medium text-primary-light tracking-wide">Career Anchor Assessment</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-text leading-[1.15] mb-6 tracking-tight">
              나의 커리어 성향을
              <br />
              <span className="text-primary-light">발견하세요</span>
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed mb-10 max-w-lg">
              40개 문항의 커리어 앵커 검사를 통해
              <br className="hidden sm:block" />
              자신의 핵심 가치와 커리어 성향을 파악하세요.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/register" className="btn-primary text-base px-7 py-3">무료로 시작하기</Link>
              <Link href="/login" className="btn-outline text-base px-7 py-3 text-text-secondary hover:text-primary">로그인</Link>
            </div>
          </div>

          <div className="mt-20 flex items-center gap-12 sm:gap-16">
            <div>
              <p className="text-3xl font-bold text-primary">40</p>
              <p className="text-sm text-text-muted mt-1">검사 문항</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-3xl font-bold text-primary">8</p>
              <p className="text-sm text-text-muted mt-1">앵커 유형</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-3xl font-bold text-primary">6</p>
              <p className="text-sm text-text-muted mt-1">점 척도</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-y border-border-light">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-xs font-semibold text-primary-lighter uppercase tracking-widest">Features</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text mt-2">커리어 앵커 분석의 모든 것</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group p-6 rounded-xl border border-border bg-surface-warm hover:bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="w-11 h-11 rounded-lg bg-primary/8 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-text mb-2">개인 진단</h3>
              <p className="text-sm text-text-muted leading-relaxed">40개 문항에 6점 척도로 응답하고 8가지 커리어 앵커 유형을 분석합니다.</p>
            </div>
            <div className="group p-6 rounded-xl border border-border bg-surface-warm hover:bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="w-11 h-11 rounded-lg bg-primary/8 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-text mb-2">그룹 분석</h3>
              <p className="text-sm text-text-muted leading-relaxed">그룹의 커리어 앵커 평균을 분석하고 강점과 보완점을 파악합니다.</p>
            </div>
            <div className="group p-6 rounded-xl border border-border bg-surface-warm hover:bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="w-11 h-11 rounded-lg bg-primary/8 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-text mb-2">시각화 리포트</h3>
              <p className="text-sm text-text-muted leading-relaxed">바 차트와 레이더 차트로 결과를 시각적으로 확인합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-xs font-semibold text-primary-lighter uppercase tracking-widest">8 Anchors</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text mt-2">8가지 커리어 앵커 유형</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "전문/기술 역량", code: "TF", color: "#8b5cf6" },
              { name: "관리 역량", code: "GM", color: "#3b82f6" },
              { name: "자율/독립", code: "AU", color: "#10b981" },
              { name: "안정/보장", code: "SE", color: "#f59e0b" },
              { name: "창업/창의", code: "EC", color: "#ef4444" },
              { name: "봉사/헌신", code: "SV", color: "#ec4899" },
              { name: "순수 도전", code: "CH", color: "#f97316" },
              { name: "라이프스타일", code: "LS", color: "#06b6d4" },
            ].map((anchor) => (
              <div key={anchor.code} className="bg-white rounded-xl p-4 border border-border hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: anchor.color }} />
                  <span className="text-xs font-mono text-text-muted">{anchor.code}</span>
                </div>
                <p className="text-sm font-semibold text-text">{anchor.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">지금 시작하세요</h2>
          <p className="text-primary-soft/80 mb-10 max-w-md mx-auto leading-relaxed">
            교수님은 그룹을 만들고, 학생은 참여 코드로 바로 시작할 수 있습니다.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-primary font-medium text-base px-8 py-3 rounded-lg hover:bg-surface-warm transition-all hover:shadow-lg">
            무료로 시작하기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <footer className="bg-primary py-8 border-t border-primary-light/20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-white/60">
            Career<span className="text-white/40">Anchor</span>
          </span>
          <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} CareerAnchor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
