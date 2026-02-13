import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-warm">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border-light">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold text-primary tracking-tight">
            Entre<span className="text-primary-lighter">LMS</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-text-secondary hover:text-primary transition-colors font-medium">
              로그인
            </Link>
            <Link href="/register" className="btn-primary text-sm">
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary-soft/8 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-[15%] w-80 h-80 bg-accent-soft/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-soft" />
              <span className="text-xs font-medium text-primary-light tracking-wide">
                Entrepreneurship Learning Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-text leading-[1.15] mb-6 tracking-tight">
              창의적 문제해결을 위한
              <br />
              <span className="text-primary-light">학습 플랫폼</span>
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed mb-10 max-w-lg">
              커리어 앵커 분석부터 팀 프로젝트까지,
              <br className="hidden sm:block" />
              체계적인 앙트러프러너십 교육을 경험하세요.
            </p>

            <div className="flex items-center gap-4">
              <Link href="/register" className="btn-primary text-base px-7 py-3">
                무료로 시작하기
              </Link>
              <Link href="/login" className="btn-outline text-base px-7 py-3 text-text-secondary hover:text-primary">
                로그인
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 flex items-center gap-12 sm:gap-16">
            <div>
              <p className="text-3xl font-bold text-primary">3</p>
              <p className="text-sm text-text-muted mt-1">학습 테마</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-3xl font-bold text-primary">5</p>
              <p className="text-sm text-text-muted mt-1">단계별 과정</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="text-3xl font-bold text-primary">40</p>
              <p className="text-sm text-text-muted mt-1">앵커 문항</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white border-y border-border-light">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-xs font-semibold text-primary-lighter uppercase tracking-widest">Features</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text mt-2">
              학습에 필요한 모든 도구
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group p-6 rounded-xl border border-border bg-surface-warm hover:bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="w-11 h-11 rounded-lg bg-primary/8 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-text mb-2">커리어 앵커 분석</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                40개 문항을 통해 자신의 커리어 성향을 파악하고, 팀 밸런스를 분석합니다.
              </p>
            </div>

            <div className="group p-6 rounded-xl border border-border bg-surface-warm hover:bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="w-11 h-11 rounded-lg bg-primary/8 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-text mb-2">팀 협업</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                팀을 구성하고, 스티키 노트 보드로 브레인스토밍과 아이디어를 공유합니다.
              </p>
            </div>

            <div className="group p-6 rounded-xl border border-border bg-surface-warm hover:bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="w-11 h-11 rounded-lg bg-primary/8 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-text mb-2">단계별 학습</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                5단계 체계적 과정으로 탐색, 아이디어, 설계, 실행까지 완성합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Themes */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-xs font-semibold text-primary-lighter uppercase tracking-widest">Themes</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text mt-2">
              3가지 맞춤형 학습 경로
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-border hover:shadow-lg hover:shadow-theme-startup/5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-8 rounded-full bg-theme-startup" />
                <div>
                  <h3 className="text-base font-semibold text-text">창업</h3>
                  <p className="text-xs text-text-muted">Startup</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                고객 문제를 발견하고, 비즈니스 모델을 설계하여 실행 계획을 수립합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-border hover:shadow-lg hover:shadow-theme-job/5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-8 rounded-full bg-theme-job" />
                <div>
                  <h3 className="text-base font-semibold text-text">창직</h3>
                  <p className="text-xs text-text-muted">Job Creation</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                강점과 미래 트렌드를 분석하여 새로운 직업과 커리어를 설계합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-border hover:shadow-lg hover:shadow-theme-problem/5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-8 rounded-full bg-theme-problem" />
                <div>
                  <h3 className="text-base font-semibold text-text">문제해결</h3>
                  <p className="text-xs text-text-muted">Problem Solving</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                사회 문제를 발견하고 창의적인 솔루션을 설계하여 실행합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            지금 시작하세요
          </h2>
          <p className="text-primary-soft/80 mb-10 max-w-md mx-auto leading-relaxed">
            교수자는 프로젝트를 만들고, 학생은 참여 코드로 바로 시작할 수 있습니다.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-primary font-medium text-base px-8 py-3 rounded-lg hover:bg-surface-warm transition-all hover:shadow-lg">
            무료로 시작하기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-8 border-t border-primary-light/20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-white/60">
            Entre<span className="text-white/40">LMS</span>
          </span>
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} EntreLMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
