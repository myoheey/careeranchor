import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const defaultTemplates = [
  { title: "커리어 앵커 결과 분석", description: "커리어 앵커 검사 결과를 분석하고 팀원들과 공유하는 보드", phase: 0, theme: null },
  { title: "문제 발견 브레인스토밍", description: "사회 문제를 자유롭게 발산하고 분류하는 보드", phase: 1, theme: "PROBLEM_SOLVING" },
  { title: "근본 원인 분석 (5 Whys)", description: "문제의 근본 원인을 파악하기 위한 분석 보드", phase: 1, theme: "PROBLEM_SOLVING" },
  { title: "솔루션 아이디어 맵", description: "다양한 솔루션 아이디어를 발산하고 평가하는 보드", phase: 2, theme: "PROBLEM_SOLVING" },
  { title: "솔루션 프로토타입 캔버스", description: "선택한 솔루션의 프로토타입을 설계하는 보드", phase: 3, theme: "PROBLEM_SOLVING" },
  { title: "실행 계획 타임라인", description: "솔루션 실행을 위한 단계별 계획 수립 보드", phase: 4, theme: "PROBLEM_SOLVING" },
  { title: "강점-트렌드 매트릭스", description: "개인 강점과 미래 트렌드를 교차 분석하는 보드", phase: 1, theme: "JOB_CREATION" },
  { title: "미래 직업 아이디어 월", description: "새로운 직업 아이디어를 자유롭게 발산하는 보드", phase: 2, theme: "JOB_CREATION" },
  { title: "직무 설계 캔버스", description: "새로운 직무의 역할과 책임을 설계하는 보드", phase: 3, theme: "JOB_CREATION" },
  { title: "커리어 로드맵", description: "장기적인 경력 개발 계획을 수립하는 보드", phase: 4, theme: "JOB_CREATION" },
  { title: "고객 문제 탐색 캔버스", description: "고객의 페인포인트와 니즈를 탐색하는 보드", phase: 1, theme: "STARTUP" },
  { title: "비즈니스 아이디어 평가 매트릭스", description: "비즈니스 아이디어를 다양한 기준으로 평가하는 보드", phase: 2, theme: "STARTUP" },
  { title: "린 캔버스 (Lean Canvas)", description: "비즈니스 모델을 한 페이지로 설계하는 보드", phase: 3, theme: "STARTUP" },
  { title: "사업 실행 로드맵", description: "사업 실행을 위한 구체적인 일정과 마일스톤을 수립하는 보드", phase: 4, theme: "STARTUP" },
];

async function main() {
  console.log("Seeding default templates...");

  for (const template of defaultTemplates) {
    await prisma.template.create({
      data: {
        ...template,
        isDefault: true,
      },
    });
  }

  console.log(`Created ${defaultTemplates.length} default templates.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
