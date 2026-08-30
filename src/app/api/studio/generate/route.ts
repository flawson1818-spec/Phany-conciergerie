import { NextResponse } from "next/server";
import { buildStudioPrompt, generateStudioTrack } from "@/lib/studio";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.story || !body.genre || !body.mood || !body.era || !body.vocal) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    const payload = {
      story: String(body.story),
      genre: String(body.genre),
      mood: String(body.mood),
      era: String(body.era),
      vocal: String(body.vocal),
      energy: Number(body.energy ?? 70),
    };

    const prompt = buildStudioPrompt(payload);
    const result = generateStudioTrack(payload);

    return NextResponse.json({
      ...result,
      metadata: {
        ...result.metadata,
        promptUsed: prompt,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la génération." }, { status: 500 });
  }
}
