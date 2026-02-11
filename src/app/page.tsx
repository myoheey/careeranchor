import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-white/80 font-medium">
                2025 학기 새로운 학습 경험
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6">
              Entrepreneurship
              <span className="block mt-2 bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent">
                LMS
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-indigo-100/90 max-w-2xl mx-auto mb-12 leading-relaxed">
              창의적 문제해결과 앙트러프러너십을 위한 학습 플랫폼
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="btn-accent text-lg px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                시작하기
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-lg font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all duration-200"
              >
                로그인
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 3 Themes */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">3가지 테마</h3>
              <p className="text-indigo-200/80 text-sm leading-relaxed">
                창업, 창직, 문제해결<br />
                맞춤형 학습 경로
              </p>
            </div>

            {/* Team Collaboration */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">팀 협업</h3>
              <p className="text-indigo-200/80 text-sm leading-relaxed">
                실시간 팀 활동과<br />
                스티키 노트 보드
              </p>
            </div>

            {/* AI Insights */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">AI 인사이트</h3>
              <p className="text-indigo-200/80 text-sm leading-relaxed">
                AI 기반 분석과<br />
                맞춤형 피드백
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              어떻게 진행되나요?
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              4단계의 간단한 과정으로 앙트러프러너십 여정을 시작하세요
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-extrabold group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">회원가입</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                교수자 또는 학생으로<br />계정을 만드세요
              </p>
              {/* Arrow connector (hidden on mobile) */}
              <div className="hidden lg:block absolute top-8 -right-4 w-8 text-slate-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-extrabold group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">프로젝트 참여</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                참여 코드로 프로젝트에<br />참여하세요
              </p>
              <div className="hidden lg:block absolute top-8 -right-4 w-8 text-slate-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-2xl font-extrabold group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">팀 활동</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                팀원들과 브레인스토밍과<br />협업을 진행하세요
              </p>
              <div className="hidden lg:block absolute top-8 -right-4 w-8 text-slate-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative text-center group">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl font-extrabold group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">결과 도출</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                프로젝트 결과물을<br />완성하고 발표하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Themes Preview Section */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              3가지 학습 테마
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              관심 분야에 맞는 테마를 선택하여 프로젝트를 진행하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Startup */}
            <div className="card p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-t-red-500">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">창업 (Startup)</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                고객 문제를 발견하고, 혁신적인 비즈니스 모델을 설계하여 실행 계획을 수립합니다.
              </p>
            </div>

            {/* Job Creation */}
            <div className="card p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-t-blue-500">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">창직 (Job Creation)</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                자신의 강점과 미래 트렌드를 분석하여 새로운 직업과 커리어를 설계합니다.
              </p>
            </div>

            {/* Problem Solving */}
            <div className="card p-8 hover:shadow-xl transition-all duration-300 border-t-4 border-t-green-500">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">문제해결 (Problem Solving)</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                사회 문제를 발견하고 창의적인 솔루션을 설계하여 실행 계획을 수립합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
              EntrePreneur LMS
            </div>
            <p className="text-sm text-slate-500 mb-6">
              창의적 문제해결과 앙트러프러너십을 위한 학습 플랫폼
            </p>
            <div className="border-t border-slate-800 pt-6">
              <p className="text-xs text-slate-600">
                &copy; {new Date().getFullYear()} EntrePreneur LMS. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
