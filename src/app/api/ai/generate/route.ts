import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface InfographicSection {
  heading: string;
  points: string[];
}

interface InfographicResponse {
  title: string;
  sections: InfographicSection[];
  summary: string;
}

const GEMINI_MODEL = "gemini-3-flash-preview";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function generateWithGemini(
  notes: { content: string; author: { name: string } }[],
  templateTitle: string
): Promise<InfographicResponse> {
  const notesText = notes
    .map((n, i) => `${i + 1}. ${n.content} (by ${n.author.name})`)
    .join("\n");

  const prompt = `You are a helpful assistant that summarizes brainstorming sticky notes into structured infographic content. Always respond with valid JSON matching this schema: { title: string, sections: [{heading: string, points: string[]}], summary: string }

Summarize the following sticky notes from the template "${templateTitle}" into infographic content. Group related ideas into sections with clear headings and key points.

Sticky Notes:
${notesText}

Respond with a JSON object containing: title, sections (array of {heading, points}), and summary.`;

  const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error("No content returned from Gemini");
  }

  // Parse the JSON from the response (handle markdown code blocks)
  let jsonString = content.trim();
  if (jsonString.startsWith("```")) {
    jsonString = jsonString
      .replace(/^```(?:json)?\s*/, "")
      .replace(/\s*```$/, "");
  }

  return JSON.parse(jsonString) as InfographicResponse;
}

function generateLocally(
  notes: { content: string; author: { name: string } }[],
  templateTitle: string
): InfographicResponse {
  // Group notes by author for organized sections
  const notesByAuthor: Record<string, string[]> = {};
  const allContents: string[] = [];

  for (const note of notes) {
    const authorName = note.author.name;
    if (!notesByAuthor[authorName]) {
      notesByAuthor[authorName] = [];
    }
    notesByAuthor[authorName].push(note.content);
    allContents.push(note.content);
  }

  // Create thematic groupings based on simple keyword analysis
  const sections: InfographicSection[] = [];

  // Group by contributor
  const authors = Object.keys(notesByAuthor);
  if (authors.length > 1) {
    for (const author of authors) {
      sections.push({
        heading: `Ideas from ${author}`,
        points: notesByAuthor[author],
      });
    }
  } else {
    // Single author or no grouping needed - create a general section
    sections.push({
      heading: "Key Ideas",
      points: allContents,
    });
  }

  // Add a summary section combining all unique themes
  const uniqueNotes = [...new Set(allContents)];
  const summaryPoints =
    uniqueNotes.length > 5
      ? uniqueNotes.slice(0, 5).concat([
          `... and ${uniqueNotes.length - 5} more ideas`,
        ])
      : uniqueNotes;

  sections.push({
    heading: "Highlights",
    points: summaryPoints,
  });

  return {
    title: `${templateTitle} - Summary`,
    sections,
    summary: `This infographic summarizes ${notes.length} sticky note${notes.length === 1 ? "" : "s"} from "${templateTitle}". ${authors.length} contributor${authors.length === 1 ? "" : "s"} shared ideas covering ${uniqueNotes.length} unique point${uniqueNotes.length === 1 ? "" : "s"}.`,
  };
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { templateId, teamId } = body;

    if (!templateId || !teamId) {
      return NextResponse.json(
        { error: "templateId and teamId are required" },
        { status: 400 }
      );
    }

    // Verify the template exists
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Verify the team exists
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Fetch all sticky notes for this template and team
    const notes = await prisma.stickyNote.findMany({
      where: {
        templateId,
        teamId,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    if (notes.length === 0) {
      return NextResponse.json(
        { error: "No sticky notes found for this template and team" },
        { status: 404 }
      );
    }

    let infographic: InfographicResponse;

    const apiKey = process.env.GEMINI_API_KEY;
    const isApiKeyValid =
      apiKey &&
      apiKey.trim() !== "" &&
      apiKey !== "your-gemini-api-key" &&
      !apiKey.startsWith("placeholder");

    if (isApiKeyValid) {
      try {
        infographic = await generateWithGemini(notes, template.title);
      } catch (error) {
        console.error("Gemini generation failed, falling back to local:", error);
        infographic = generateLocally(notes, template.title);
      }
    } else {
      infographic = generateLocally(notes, template.title);
    }

    return NextResponse.json(infographic);
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
