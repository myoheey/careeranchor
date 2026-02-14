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

function buildPrompt(results: Record<string, number>, userName: string): string {
  const sorted = [...careerAnchorCategories].sort(
    (a, b) => (results[b.key] || 0) - (results[a.key] || 0)
  );

  const scoreLines = sorted
    .map((cat) => `- ${ANCHOR_DETAILS[cat.key].name} (${cat.key}): ${(results[cat.key] || 0).toFixed(1)}점/6점 — ${ANCHOR_DETAILS[cat.key].desc}`)
    .join("\n");

  return `당신은 커리어 상담 전문가입니다. 아래는 "${userName}"님의 Schein 커리어 앵커 검사 결과입니다 (6점 만점).

${scoreLines}

위 결과를 분석하여 아래 JSON 형식으로만 응답해주세요. 다른 텍스트 없이 JSON만 출력하세요.

{
  "summary": "전체적인 커리어 성향 요약 (2-3문장)",
  "strengths": [
    {
      "anchor": "앵커 코드 (예: TF)",
      "title": "강점 제목",
      "description": "구체적인 강점 설명 (2-3문장)"
    }
  ],
  "weaknesses": [
    {
      "anchor": "앵커 코드",
      "title": "보완점 제목",
      "description": "구체적인 보완 방향 설명 (2-3문장)"
    }
  ],
  "careers": [
    {
      "field": "추천 진로 분야",
      "roles": ["구체적인 직업/역할 1", "구체적인 직업/역할 2"],
      "reason": "이 진로를 추천하는 이유 (1-2문장)"
    }
  ],
  "advice": "커리어 개발을 위한 종합 조언 (3-4문장)"
}

규칙:
- strengths는 상위 2-3개 앵커 기반으로 작성
- weaknesses는 하위 2개 앵커 기반으로 작성
- careers는 3-4개 추천
- 한국어로 작성
- 구체적이고 실용적인 내용으로 작성`;
}

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const existing = await prisma.careerAnchorResult.findUnique({
      where: { userId: session.id },
    });

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
    const prompt = buildPrompt(results, session.name);

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI 서비스가 설정되지 않았습니다. 관리자에게 문의하세요." },
        { status: 503 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 2048,
        messages: [
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status, await response.text());
      return NextResponse.json(
        { error: "AI 리포트 생성에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 502 }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.content?.[0]?.text || "";

    let report;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      report = JSON.parse(jsonMatch[0]);
    } catch {
      console.error("Failed to parse AI response:", content);
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
