"use client";

import { useMemo, useState } from "react";

const genres = [
  "Afrobeats",
  "Pop/Variété",
  "Hip-Hop/Trap",
  "EDM/Electro",
  "Synthwave",
  "Lo-Fi",
  "Rock/Metal",
  "Gospel",
];

const moods = ["Épique", "Nostalgique", "Festif", "Mélancolique", "Énergique", "Céleste"];
const eras = ["Moderne Hi-Fi", "Analogique 80s", "Lo-Fi Crackle", "Acoustique Intimiste"];
const vocals = ["Voix féminine pop", "Voix masculine soul", "Duo harmonisateur", "Auto-Tune trap"];

export function StudioGenerator() {
  const [story, setStory] = useState("Une nuit à Lomé sous la pluie, pleine de souvenirs et d'espoir.");
  const [genre, setGenre] = useState("Afrobeats");
  const [mood, setMood] = useState("Épique");
  const [era, setEra] = useState("Moderne Hi-Fi");
  const [vocal, setVocal] = useState("Voix féminine pop");
  const [energy, setEnergy] = useState(78);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    trackId: string;
    metadata: {
      title: string;
      bpm: number;
      key: string;
      promptUsed: string;
      masteringSpecs: string;
    };
    media: {
      previewMp3: string;
      masteredWav: string;
      stemsZip: string;
    };
  } | null>(null);

  const quickStats = useMemo(
    () => [
      { label: "Styles", value: "14+" },
      { label: "Mastering", value: "-14 LUFS" },
      { label: "Temps", value: "< 2 min" },
    ],
    [],
  );

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story, genre, mood, era, vocal, energy }),
      });

      if (!response.ok) {
        throw new Error("La génération a échoué.");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Impossible de générer la piste pour le moment. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-8 text-slate-100 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(168,85,247,0.15)] backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-fuchsia-300">
                AI Sound Engineer Studio
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                Créez une chanson qui ressemble à un hit pro.
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
                Racontez votre histoire, choisissez le style et laissez l’IA composer, mixer et masteriser en quelques minutes.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-left">
              {quickStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/30">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Briefing</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Studio de création</h2>
              </div>
              <button
                type="button"
                onClick={() => setStory("Une nuit à Lomé sous la pluie, pleine de souvenirs et d'espoir.")}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
              >
                Exemple
              </button>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">1. Votre histoire</span>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  rows={5}
                  placeholder="Ex : Une soirée inoubliable sous les étoiles à Lomé..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30"
                />
              </label>

              <div>
                <span className="mb-2 block text-sm font-medium text-slate-200">2. Style musical</span>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {genres.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setGenre(item)}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        genre === item
                          ? "border-fuchsia-500 bg-fuchsia-500/20 text-white shadow-lg shadow-fuchsia-500/20"
                          : "border-white/10 bg-slate-950/70 text-slate-300 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">3. Émotion</span>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30"
                  >
                    {moods.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">4. Signature sonore</span>
                  <select
                    value={era}
                    onChange={(e) => setEra(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30"
                  >
                    {eras.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">5. Voix</span>
                  <select
                    value={vocal}
                    onChange={(e) => setVocal(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30"
                  >
                    {vocals.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">6. Énergie</span>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
                      <span>Calme</span>
                      <span className="font-semibold text-white">{energy}/100</span>
                      <span>Forte</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={100}
                      value={energy}
                      onChange={(e) => setEnergy(Number(e.target.value))}
                      className="h-2 w-full accent-fuchsia-500"
                    />
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || !story.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(168,85,247,0.45)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Génération en cours..." : "Créer la piste"}
              </button>
            </div>
          </section>

          <aside className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/30">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Sortie</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Piste générée</h2>
              </div>
              {result?.status === "success" ? (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                  Ready
                </span>
              ) : null}
            </div>

            {result ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-4">
                  <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                    <span>Mastered</span>
                    <span>{result.metadata.bpm} BPM</span>
                  </div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-500 text-xl shadow-lg shadow-fuchsia-500/30">
                      ▶
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white">{result.metadata.title}</div>
                      <div className="text-xs text-slate-400">{result.metadata.key}</div>
                    </div>
                  </div>

                  <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400" />
                  </div>

                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-400">
                    <span>Intro</span>
                    <span>Refrain</span>
                    <span>Bridge</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2">
                    <span>Mastering</span>
                    <span className="font-medium text-white">{result.metadata.masteringSpecs}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2">
                    <span>Voix</span>
                    <span className="font-medium text-white">{vocal}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2">
                    <span>Identifiant</span>
                    <span className="font-mono text-xs text-cyan-300">{result.trackId}</span>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <a
                    href={result.media.previewMp3}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-medium text-white hover:bg-white/10"
                  >
                    Preview MP3
                  </a>
                  <a
                    href={result.media.masteredWav}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-medium text-white hover:bg-white/10"
                  >
                    WAV Master
                  </a>
                  <a
                    href={result.media.stemsZip}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-xs font-medium text-white hover:bg-white/10"
                  >
                    Stems ZIP
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-center text-sm text-slate-400">
                Votre piste apparaîtra ici avec une pré-écoute, le mastering et les exports prêts à partager.
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
