import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-lg font-bold text-white tracking-tight">
            Entre<span className="text-blue-400">LMS</span>
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
              로그인
            </Link>
            <Link href="/register" className="btn-primary text-sm">
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-24">
          <div className="max-w-2xl">
            <p className="text-blue-400 text-sm font-medium mb-4 tracking-wide uppercase">
              Entrepreneurship Learning Platform
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              창의적 문제해결을 위한
              <br />
              <span className="text-blue-400">학습 플랫폼</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg">
              커리어 앵커 분석부터 팀 프로젝트까지, 체계적인 앙트러프러너십 교육을 경험하세요.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/register" className="btn-primary text-base px-6 py-2.5">
                무료로 시작하기
              </Link>
              <Link href="/login" className="btn-outline text-base px-6 py-2.5 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                로그인
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg">
            <div>
              <p className="text-3xl font-bold text-white">3</p>
              <p className="text-sm text-slate-500 mt-1">학습 테마</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">5</p>
              <p className="text-sm text-slate-500 mt-1">단계별 과정</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">40</p>
              <p className="text-sm text-slate-500 mt-1">앵커 문항</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-blue-600 text-sm font-medium mb-2">주요 기능</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-12">
            학습에 필요한 모든 도구
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">커리어 앵커 분석</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                40개 문항을 통해 자신의 커리어 성향을 파악하고, 팀 밸런스를 분석합니다.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">팀 협업</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                팀을 구성하고, 스티키 노트 보드로 브레인스토밍과 아이디어를 공유합니다.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">단계별 학습</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                5단계 체계적 과정으로 탐색, 아이디어, 설계, 실행까지 완성합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Themes */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-blue-600 text-sm font-medium mb-2">학습 테마</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-12">
            3가지 맞춤형 학습 경로
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 rounded-full bg-red-500" />
                <h3 className="text-lg font-semibold text-slate-900">창업</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                고객 문제를 발견하고, 비즈니스 모델을 설계하여 실행 계획을 수립합니다.
              </p>
              <p className="text-xs text-slate-400 mt-4">Startup</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 rounded-full bg-blue-500" />
                <h3 className="text-lg font-semibold text-slate-900">창직</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                강점과 미래 트렌드를 분석하여 새로운 직업과 커리어를 설계합니다.
              </p>
              <p className="text-xs text-slate-400 mt-4">Job Creation</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 rounded-full bg-emerald-500" />
                <h3 className="text-lg font-semibold text-slate-900">문제해결</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                사회 문제를 발견하고 창의적인 솔루션을 설계하여 실행합니다.
              </p>
              <p className="text-xs text-slate-400 mt-4">Problem Solving</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            지금 시작하세요
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            교수자는 프로젝트를 만들고, 학생은 참여 코드로 바로 시작할 수 있습니다.
          </p>
          <Link href="/register" className="btn-primary text-base px-8 py-3">
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-light py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} EntreLMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
