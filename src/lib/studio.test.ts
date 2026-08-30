import test from "node:test";
import assert from "node:assert/strict";
import { buildStudioPrompt, generateStudioTrack } from "./studio";

test("buildStudioPrompt includes story and production details", () => {
  const result = buildStudioPrompt({
    story: "Une nuit à Lomé sous la pluie",
    genre: "Afrobeats",
    mood: "Épique",
    era: "Moderne Hi-Fi",
    vocal: "Voix féminine pop",
    energy: 78,
  });

  assert.match(result, /Une nuit à Lomé sous la pluie/);
  assert.match(result, /Afrobeats/);
  assert.match(result, /Épique/);
  assert.match(result, /Moderne Hi-Fi/);
  assert.match(result, /Voix féminine pop/);
  assert.match(result, /78/);
});

test("generateStudioTrack returns a ready-to-play payload", () => {
  const result = generateStudioTrack({
    story: "Un départ plein d'espoir",
    genre: "Pop",
    mood: "Nostalgique",
    era: "Analogique 80s",
    vocal: "Voix masculine soul",
    energy: 65,
  });

  assert.equal(result.status, "success");
  assert.ok(result.trackId.length > 0);
  assert.ok(result.metadata.title.length > 0);
  assert.ok(result.media.previewMp3.includes("https://"));
});
