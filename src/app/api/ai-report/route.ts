import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { careerAnchorCategories } from "@/lib/phase-data";

const ANCHOR_DETAILS: Record<string, { name: string; desc: string }> = {
  TF: { name: "전문/기술 역량", desc: "특정 분야의 전문성을 깊이 있게 발전시키는 것에 가치를 둠" },
  GM: { name: "관리 역량", desc: "조직을 이끌고 관리하는 역할에서 보람을 찾음" },
  AU: { name: "자율/독립", desc: "자유롭고 독립적인 업무 환경을 중시" },
  SE: { name: "안정/보장", desc: "안정적이고 예측 가능한 환경을 추구" },
  EC: { name: "창업/창의", desc: "새로운 것을 창조하고 사업을 만들어내는 것에 열정" },
  SV: { name: "봉사/헌신", desc: "사회에 기여하고 다른 사람들을 돕는 것에 보람" },
  CH: { name: "순수 도전", desc: "끊임없이 새로운 도전을 추구" },
  LS: { name: "라이프스타일", desc: "일과 삶의 균형을 가장 중요하게 생각" },
};

interface UserProfile {
  gender: string | null;
  ageRange: string | null;
  job: string | null;
  industry: string | null;
  experience: string | null;
}

function formatProfile(profile: UserProfile): string {
  const parts: string[] = [];
  if (profile.gender) {
    const genderMap: Record<string, string> = { male: "남성", female: "여성", other: "기타" };
    parts.push(`성별: ${genderMap[profile.gender] || profile.gender}`);
  }
  if (profile.ageRange) {
    const ageMap: Record<string, string> = { "20s": "20대", "30s": "30대", "40s": "40대", "50s": "50대", "60+": "60대 이상" };
    parts.push(`연령대: ${ageMap[profile.ageRange] || profile.ageRange}`);
  }
  if (profile.job) parts.push(`현재 직업: ${profile.job}`);
  if (profile.industry) parts.push(`업종: ${profile.industry}`);
  if (profile.experience) {
    const expMap: Record<string, string> = { "0-2": "0~2년", "3-5": "3~5년", "6-10": "6~10년", "11-15": "11~15년", "16-20": "16~20년", "20+": "20년 이상" };
    parts.push(`경력: ${expMap[profile.experience] || profile.experience}`);
  }
  return parts.length > 0 ? parts.join(", ") : "프로필 정보 없음";
}

function buildPrompt(results: Record<string, number>, userName: string, profile: UserProfile): string {
  const sorted = [...careerAnchorCategories].sort(
    (a, b) => (results[b.key] || 0) - (results[a.key] || 0)
  );

  const scoreLines = sorted
    .map((cat) => `- ${ANCHOR_DETAILS[cat.key].name} (${cat.key}): ${(results[cat.key] || 0).toFixed(1)}점/6점 — ${ANCHOR_DETAILS[cat.key].desc}`)
    .join("\n");

  const profileInfo = formatProfile(profile);
  const topAnchors = sorted.slice(0, 3).map((c) => `${ANCHOR_DETAILS[c.key].name}(${c.key})`).join(", ");
  const bottomAnchors = sorted.slice(-2).map((c) => `${ANCHOR_DETAILS[c.key].name}(${c.key})`).join(", ");

  return `당신은 20년 경력의 커리어 상담 전문가이며 조직심리학 박사입니다. 아래는 "${userName}"님의 Schein 커리어 앵커 검사 결과입니다.

[응답자 프로필]
${profileInfo}

[검사 결과 (6점 만점)]
${scoreLines}

상위 앵커: ${topAnchors}
하위 앵커: ${bottomAnchors}

위 결과와 응답자의 프로필(성별, 연령대, 직업, 경력)을 종합적으로 고려하여 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.

{
  "executiveSummary": "이 사람의 커리어 성향을 종합적으로 요약하는 글 (5-6문장, 프로필 정보를 반영한 개인 맞춤형)",
  "profileAnalysis": "응답자의 프로필(연령, 경력, 직업)과 커리어 앵커 결과의 상관관계 분석 (4-5문장)",
  "anchorAnalysis": [
    {
      "anchor": "앵커 코드 (예: TF)",
      "score": 점수(숫자),
      "rank": 순위(숫자),
      "interpretation": "이 앵커가 이 사람에게 어떤 의미인지 해석 (3-4문장, 프로필 반영)",
      "currentJobFit": "현재 직업과의 적합도 분석 (2-3문장)"
    }
  ],
  "strengths": [
    {
      "anchor": "앵커 코드",
      "title": "강점 제목",
      "description": "구체적인 강점 설명과 활용 방안 (3-4문장)",
      "actionItems": ["실천 가능한 액션 아이템 1", "액션 아이템 2", "액션 아이템 3"]
    }
  ],
  "weaknesses": [
    {
      "anchor": "앵커 코드",
      "title": "보완점 제목",
      "description": "구체적인 보완 방향과 실질적 조언 (3-4문장)",
      "actionItems": ["개선을 위한 액션 아이템 1", "액션 아이템 2", "액션 아이템 3"]
    }
  ],
  "anchorCombination": {
    "title": "앵커 조합 분석 제목 (예: '전문성과 도전의 시너지')",
    "description": "상위 2-3개 앵커의 조합이 만들어내는 독특한 커리어 성향 분석 (5-6문장)"
  },
  "careers": [
    {
      "field": "추천 진로 분야",
      "roles": ["구체적 직업 1", "구체적 직업 2", "구체적 직업 3"],
      "reason": "이 진로를 추천하는 이유 (2-3문장, 프로필 반영)",
      "fitScore": 적합도 점수(1-10)
    }
  ],
  "careerRoadmap": {
    "shortTerm": {
      "period": "향후 1-2년",
      "goals": ["구체적 목표 1", "목표 2", "목표 3"],
      "description": "단기 목표 달성을 위한 전략 (3-4문장)"
    },
    "midTerm": {
      "period": "향후 3-5년",
      "goals": ["구체적 목표 1", "목표 2", "목표 3"],
      "description": "중기 커리어 발전 전략 (3-4문장)"
    },
    "longTerm": {
      "period": "향후 5-10년",
      "goals": ["구체적 목표 1", "목표 2"],
      "description": "장기 비전과 전략 (3-4문장)"
    }
  },
  "organizationFit": {
    "idealCulture": "이 사람에게 이상적인 조직 문화 설명 (3-4문장)",
    "idealSize": "적합한 조직 규모와 이유 (2-3문장)",
    "idealLeader": "함께 일하기 좋은 상사/리더 유형 (2-3문장)",
    "idealTeam": "이상적인 팀 환경 (2-3문장)",
    "redFlags": ["피해야 할 조직 문화 특성 1", "특성 2", "특성 3"]
  },
  "workStyle": {
    "communication": "이 사람의 업무 커뮤니케이션 스타일 (2-3문장)",
    "decisionMaking": "의사결정 방식과 특성 (2-3문장)",
    "stressManagement": "스트레스 관리와 대처 방식 (2-3문장)",
    "motivation": "동기부여 요인과 에너지원 (2-3문장)"
  },
  "growthAdvice": {
    "mindset": "성장을 위한 마인드셋 조언 (3-4문장)",
    "skills": ["개발해야 할 핵심 스킬 1", "스킬 2", "스킬 3", "스킬 4"],
    "resources": ["추천 도서/강의/자격증 1", "추천 2", "추천 3"],
    "networking": "네트워킹과 관계 구축 조언 (2-3문장)"
  },
  "closingMessage": "응답자에게 전하는 따뜻하고 격려하는 마무리 메시지 (4-5문장, 이름 사용)"
}

규칙:
- anchorAnalysis는 8개 앵커 모두 포함 (높은 점수 순서대로)
- strengths는 상위 3개 앵커 기반
- weaknesses는 하위 2개 앵커 기반
- careers는 5-6개 추천
- 모든 내용은 한국어로 작성
- 프로필 정보(성별, 연령대, 직업, 경력)를 적극 반영한 개인 맞춤형 분석
- 구체적이고 실용적인 내용으로 작성
- 각 설명은 요청된 문장 수를 반드시 충족`;
}

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const [existing, user] = await Promise.all([
      prisma.careerAnchorResult.findUnique({
        where: { userId: session.id },
      }),
      prisma.user.findUnique({
        where: { id: session.id },
        select: { gender: true, ageRange: true, job: true, industry: true, experience: true },
      }),
    ]);

    if (!existing) {
      return NextResponse.json(
        { error: "커리어 앵커 검사를 먼저 완료해주세요." },
        { status: 400 }
      );
    }

    if (existing.aiReport) {
      return NextResponse.json({
        report: JSON.parse(existing.aiReport),
        cached: true,
      });
    }

    const results = JSON.parse(existing.results) as Record<string, number>;
    const profile: UserProfile = {
      gender: user?.gender ?? null,
      ageRange: user?.ageRange ?? null,
      job: user?.job ?? null,
      industry: user?.industry ?? null,
      experience: user?.experience ?? null,
    };
    const prompt = buildPrompt(results, session.name, profile);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI 서비스가 설정되지 않았습니다. 관리자에게 문의하세요." },
        { status: 503 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: prompt }] },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", response.status, await response.text());
      return NextResponse.json(
        { error: "AI 리포트 생성에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 502 }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let report;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      report = JSON.parse(jsonMatch[0]);
    } catch {
      console.error("Failed to parse Gemini response:", content);
      return NextResponse.json(
        { error: "AI 응답을 처리하는 데 실패했습니다." },
        { status: 500 }
      );
    }

    await prisma.careerAnchorResult.update({
      where: { userId: session.id },
      data: { aiReport: JSON.stringify(report) },
    });

    return NextResponse.json({ report, cached: false });
  } catch (error) {
    console.error("AI report error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
