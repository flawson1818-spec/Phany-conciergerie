"use client";

import { useTransition } from "react";
import { updateAnnonceStatut } from "@/lib/actions/recherche";
import { ANNONCE_STATUT_LABELS } from "@/lib/constants";
import type { AnnonceStatut } from "@/generated/prisma/client";

const ORDER: AnnonceStatut[] = ["DISPONIBLE", "PROPOSEE", "INDISPONIBLE"];

export function AnnonceStatutSelect({ annonceId, statut }: { annonceId: string; statut: AnnonceStatut }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={statut}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value as AnnonceStatut;
        startTransition(() => {
          updateAnnonceStatut(annonceId, value);
        });
      }}
      className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-700 disabled:opacity-50"
    >
      {ORDER.map((s) => (
        <option key={s} value={s}>
          {ANNONCE_STATUT_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
