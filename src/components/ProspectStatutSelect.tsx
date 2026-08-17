"use client";

import { useTransition } from "react";
import { updateProspectStatut } from "@/lib/actions/prospects";
import { PROSPECT_STATUT_LABELS, PROSPECT_STATUT_ORDER } from "@/lib/constants";
import type { ProspectStatut } from "@/generated/prisma/client";

export function ProspectStatutSelect({
  prospectId,
  statut,
}: {
  prospectId: string;
  statut: ProspectStatut;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={statut}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value as ProspectStatut;
        startTransition(() => {
          updateProspectStatut(prospectId, value);
        });
      }}
      className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-700 disabled:opacity-50"
    >
      {[...PROSPECT_STATUT_ORDER, "PERDU" as const].map((s) => (
        <option key={s} value={s}>
          {PROSPECT_STATUT_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
