"use client";

import { useTransition } from "react";
import { updateSejourStatut } from "@/lib/actions/corporate";
import { SEJOUR_STATUT_LABELS, SEJOUR_STATUT_ORDER } from "@/lib/constants";
import type { SejourStatut } from "@/generated/prisma/client";

export function SejourStatutSelect({
  sejourId,
  contratId,
  statut,
}: {
  sejourId: string;
  contratId: string;
  statut: SejourStatut;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={statut}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value as SejourStatut;
        startTransition(() => {
          updateSejourStatut(sejourId, contratId, value);
        });
      }}
      className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-700 disabled:opacity-50"
    >
      {SEJOUR_STATUT_ORDER.map((s) => (
        <option key={s} value={s}>
          {SEJOUR_STATUT_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
