"use client";

import { useTransition } from "react";
import { updateDemandeStatut } from "@/lib/actions/recherche";
import { DEMANDE_STATUT_LABELS, DEMANDE_STATUT_ORDER } from "@/lib/constants";
import type { DemandeStatut } from "@/generated/prisma/client";

export function DemandeStatutSelect({ demandeId, statut }: { demandeId: string; statut: DemandeStatut }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={statut}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value as DemandeStatut;
        startTransition(() => {
          updateDemandeStatut(demandeId, value);
        });
      }}
      className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-700 disabled:opacity-50"
    >
      {DEMANDE_STATUT_ORDER.map((s) => (
        <option key={s} value={s}>
          {DEMANDE_STATUT_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
