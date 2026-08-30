export type StudioRequest = {
  story: string;
  genre: string;
  mood: string;
  era: string;
  vocal: string;
  energy: number;
};

export function buildStudioPrompt({
  story,
  genre,
  mood,
  era,
  vocal,
  energy,
}: StudioRequest) {
  return [
    `Concept: ${story}`,
    `Genre: ${genre}`,
    `Mood: ${mood}`,
    `Texture: ${era}`,
    `Voix: ${vocal}`,
    `Énergie: ${energy}/100`,
    "Structure: couplet, refrain, bridge, mixage dynamique, mastering pro, vibe instantanée.",
  ].join(" | ");
}

export function generateStudioTrack(request: StudioRequest) {
  const trackId = `track_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const title = `${request.genre} ${request.mood} ${trackId.slice(-4)}`;

  return {
    status: "success",
    trackId,
    metadata: {
      title,
      bpm: 118 + Math.round((request.energy / 100) * 18),
      key: request.mood === "Épique" ? "A minor" : "C major",
      promptUsed: buildStudioPrompt(request),
      masteringSpecs: "-14 LUFS, 24-bit 44.1kHz WAV",
    },
    media: {
      previewMp3: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      masteredWav: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      stemsZip: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
  };
}
