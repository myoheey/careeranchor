export type ThemeType = "STARTUP" | "JOB_CREATION" | "PROBLEM_SOLVING";

export interface PhaseInfo {
  phase: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

export const themeLabels: Record<ThemeType, string> = {
  STARTUP: "창업",
  JOB_CREATION: "창직",
  PROBLEM_SOLVING: "문제해결",
};

export const themeColors: Record<ThemeType, { primary: string; bg: string; light: string }> = {
  STARTUP: { primary: "#dc2626", bg: "#fef2f2", light: "#fee2e2" },
  JOB_CREATION: { primary: "#2563eb", bg: "#eff6ff", light: "#dbeafe" },
  PROBLEM_SOLVING: { primary: "#059669", bg: "#ecfdf5", light: "#d1fae5" },
};

export const phaseData: Record<ThemeType, PhaseInfo[]> = {
  STARTUP: [
    {
      phase: 0,
      title: "커리어 앵커 검사",
      subtitle: "Career Anchor Assessment",
      description: "40개 문항에 6점 척도로 응답하고 자신의 커리어 성향을 파악합니다.",
      icon: "🧭",
      color: "#8b5cf6",
    },
    {
      phase: 1,
      title: "시장 문제 발견",
      subtitle: "Market Problem Discovery",
      description: "고객과 시장의 문제를 발견하고 비즈니스 기회를 탐색합니다.",
      icon: "🔍",
      color: "#f59e0b",
    },
    {
      phase: 2,
      title: "비즈니스 아이디어",
      subtitle: "Business Ideation",
      description: "문제를 해결할 혁신적인 비즈니스 아이디어를 발산하고 평가합니다.",
      icon: "💡",
      color: "#10b981",
    },
    {
      phase: 3,
      title: "비즈니스 모델 설계",
      subtitle: "Business Model Design",
      description: "지속가능한 비즈니스 모델과 차별화 전략을 구체적으로 설계합니다.",
      icon: "📐",
      color: "#3b82f6",
    },
    {
      phase: 4,
      title: "사업 실행 계획",
      subtitle: "Business Execution Plan",
      description: "비즈니스 실행을 위한 구체적인 계획과 일정을 수립합니다.",
      icon: "🚀",
      color: "#ef4444",
    },
  ],
  JOB_CREATION: [
    {
      phase: 0,
      title: "커리어 앵커 검사",
      subtitle: "Career Anchor Assessment",
      description: "40개 문항에 6점 척도로 응답하고 자신의 커리어 성향을 파악합니다.",
      icon: "🧭",
      color: "#8b5cf6",
    },
    {
      phase: 1,
      title: "직업 기회 탐색",
      subtitle: "Job Opportunity Exploration",
      description: "자신의 강점과 미래 트렌드를 분석하여 새로운 직업 기회를 발견합니다.",
      icon: "🔭",
      color: "#f59e0b",
    },
    {
      phase: 2,
      title: "직업 아이디어",
      subtitle: "Job Ideation",
      description: "새로운 직업과 직무에 대한 창의적인 아이디어를 발산하고 구체화합니다.",
      icon: "✨",
      color: "#10b981",
    },
    {
      phase: 3,
      title: "직업 설계",
      subtitle: "Job Design",
      description: "새로운 직무의 역할, 책임, 성장 경로를 체계적으로 설계합니다.",
      icon: "🏗️",
      color: "#3b82f6",
    },
    {
      phase: 4,
      title: "경력 개발 계획",
      subtitle: "Career Development Plan",
      description: "장기적인 커리어 로드맵과 실행 가능한 개발 계획을 수립합니다.",
      icon: "📈",
      color: "#ef4444",
    },
  ],
  PROBLEM_SOLVING: [
    {
      phase: 0,
      title: "커리어 앵커 검사",
      subtitle: "Career Anchor Assessment",
      description: "40개 문항에 6점 척도로 응답하고 자신의 커리어 성향을 파악합니다.",
      icon: "🧭",
      color: "#8b5cf6",
    },
    {
      phase: 1,
      title: "문제 정의",
      subtitle: "Problem Definition",
      description: "사회 문제를 발견하고 근본 원인을 분석하여 명확하게 정의합니다.",
      icon: "🎯",
      color: "#f59e0b",
    },
    {
      phase: 2,
      title: "솔루션 아이디어",
      subtitle: "Solution Ideation",
      description: "문제를 해결할 창의적인 솔루션 아이디어를 발산하고 선정합니다.",
      icon: "💡",
      color: "#10b981",
    },
    {
      phase: 3,
      title: "솔루션 설계",
      subtitle: "Solution Design",
      description: "선택한 솔루션을 구체적으로 설계하고 프로토타입을 계획합니다.",
      icon: "🔧",
      color: "#3b82f6",
    },
    {
      phase: 4,
      title: "실행 계획",
      subtitle: "Execution Plan",
      description: "솔루션 실행을 위한 구체적인 계획과 영향력 평가 방법을 수립합니다.",
      icon: "📋",
      color: "#ef4444",
    },
  ],
};

export const careerAnchorQuestions = [
  "나는 특정 분야의 전문가로 인정받고 싶다",
  "나는 조직을 이끌고 관리하는 역할을 좋아한다",
  "나는 자유롭고 독립적으로 일하는 것을 선호한다",
  "나는 안정적이고 예측 가능한 직업을 원한다",
  "나는 새로운 사업을 창출하는 것에 관심이 있다",
  "나는 사회에 기여하고 봉사하는 일을 중시한다",
  "나는 도전적인 문제를 해결하는 것을 즐긴다",
  "나는 일과 삶의 균형을 가장 중요하게 생각한다",
  "나는 기술적 역량을 깊이 있게 발전시키고 싶다",
  "나는 팀을 이끌고 성과를 만들어내는 것을 좋아한다",
  "나는 나만의 방식으로 일하는 것을 중요하게 생각한다",
  "나는 고용 안정성을 매우 중시한다",
  "나는 새로운 제품이나 서비스를 만들어내고 싶다",
  "나는 다른 사람들을 돕는 일에 보람을 느낀다",
  "나는 경쟁에서 이기는 것이 동기부여가 된다",
  "나는 개인 생활을 희생하면서까지 일하고 싶지 않다",
  "나는 전문 분야에서 최고가 되고 싶다",
  "나는 조직의 의사결정에 영향력을 행사하고 싶다",
  "나는 규칙에 얽매이지 않는 환경을 선호한다",
  "나는 재정적 안정을 최우선으로 생각한다",
  "나는 혁신적인 아이디어를 실현시키고 싶다",
  "나는 세상을 더 나은 곳으로 만들고 싶다",
  "나는 불가능해 보이는 일에 도전하는 것을 좋아한다",
  "나는 가족과의 시간을 충분히 가질 수 있는 직업을 원한다",
  "나는 같은 분야에서 꾸준히 경력을 쌓고 싶다",
  "나는 높은 직위에 오르는 것을 목표로 한다",
  "나는 창의적이고 자율적인 업무 환경을 원한다",
  "나는 정기적인 수입을 보장받고 싶다",
  "나는 나만의 사업체를 가지고 싶다",
  "나는 사회적 가치를 실현하는 일을 하고 싶다",
  "나는 끊임없이 새로운 도전을 원한다",
  "나는 근무 시간과 장소의 유연성을 중시한다",
  "나는 전문성을 인정받는 것에 큰 보람을 느낀다",
  "나는 리더십을 발휘할 기회를 찾는다",
  "나는 틀에 박힌 업무보다 유연한 업무를 선호한다",
  "나는 퇴직 후 안정도 미리 계획하고 싶다",
  "나는 무에서 유를 창조하는 것에 열정이 있다",
  "나는 약자를 돕고 정의를 실현하는 일에 관심이 있다",
  "나는 극한 상황에서 능력을 발휘하는 것을 좋아한다",
  "나는 취미와 여가를 즐길 수 있는 직업을 선호한다",
];

export const careerAnchorCategories = [
  { name: "전문/기술 역량", key: "TF", color: "#8b5cf6", questions: [0, 8, 16, 24, 32] },
  { name: "관리 역량", key: "GM", color: "#3b82f6", questions: [1, 9, 17, 25, 33] },
  { name: "자율/독립", key: "AU", color: "#10b981", questions: [2, 10, 18, 26, 34] },
  { name: "안정/보장", key: "SE", color: "#f59e0b", questions: [3, 11, 19, 27, 35] },
  { name: "창업/창의", key: "EC", color: "#ef4444", questions: [4, 12, 20, 28, 36] },
  { name: "봉사/헌신", key: "SV", color: "#ec4899", questions: [5, 13, 21, 29, 37] },
  { name: "순수 도전", key: "CH", color: "#f97316", questions: [6, 14, 22, 30, 38] },
  { name: "라이프스타일", key: "LS", color: "#06b6d4", questions: [7, 15, 23, 31, 39] },
];

export const defaultTemplates = [
  // Phase 0 - Common
  {
    title: "커리어 앵커 결과 분석",
    description: "커리어 앵커 검사 결과를 분석하고 팀원들과 공유하는 보드",
    phase: 0,
    theme: null,
  },
  // PROBLEM_SOLVING templates
  {
    title: "문제 발견 브레인스토밍",
    description: "사회 문제를 자유롭게 발산하고 분류하는 보드",
    phase: 1,
    theme: "PROBLEM_SOLVING",
  },
  {
    title: "근본 원인 분석 (5 Whys)",
    description: "문제의 근본 원인을 파악하기 위한 분석 보드",
    phase: 1,
    theme: "PROBLEM_SOLVING",
  },
  {
    title: "솔루션 아이디어 맵",
    description: "다양한 솔루션 아이디어를 발산하고 평가하는 보드",
    phase: 2,
    theme: "PROBLEM_SOLVING",
  },
  {
    title: "솔루션 프로토타입 캔버스",
    description: "선택한 솔루션의 프로토타입을 설계하는 보드",
    phase: 3,
    theme: "PROBLEM_SOLVING",
  },
  {
    title: "실행 계획 타임라인",
    description: "솔루션 실행을 위한 단계별 계획 수립 보드",
    phase: 4,
    theme: "PROBLEM_SOLVING",
  },
  // JOB_CREATION templates
  {
    title: "강점-트렌드 매트릭스",
    description: "개인 강점과 미래 트렌드를 교차 분석하는 보드",
    phase: 1,
    theme: "JOB_CREATION",
  },
  {
    title: "미래 직업 아이디어 월",
    description: "새로운 직업 아이디어를 자유롭게 발산하는 보드",
    phase: 2,
    theme: "JOB_CREATION",
  },
  {
    title: "직무 설계 캔버스",
    description: "새로운 직무의 역할과 책임을 설계하는 보드",
    phase: 3,
    theme: "JOB_CREATION",
  },
  {
    title: "커리어 로드맵",
    description: "장기적인 경력 개발 계획을 수립하는 보드",
    phase: 4,
    theme: "JOB_CREATION",
  },
  // STARTUP templates
  {
    title: "고객 문제 탐색 캔버스",
    description: "고객의 페인포인트와 니즈를 탐색하는 보드",
    phase: 1,
    theme: "STARTUP",
  },
  {
    title: "비즈니스 아이디어 평가 매트릭스",
    description: "비즈니스 아이디어를 다양한 기준으로 평가하는 보드",
    phase: 2,
    theme: "STARTUP",
  },
  {
    title: "린 캔버스 (Lean Canvas)",
    description: "비즈니스 모델을 한 페이지로 설계하는 보드",
    phase: 3,
    theme: "STARTUP",
  },
  {
    title: "사업 실행 로드맵",
    description: "사업 실행을 위한 구체적인 일정과 마일스톤을 수립하는 보드",
    phase: 4,
    theme: "STARTUP",
  },
];
