"use client";

import { useTransition } from "react";
import { updatePropertyStatut } from "@/lib/actions/properties";
import { BIEN_STATUT_LABELS } from "@/lib/constants";
import type { BienStatut } from "@/generated/prisma/client";

const ORDER: BienStatut[] = ["EN_PREPARATION", "PRET", "ACTIF", "INACTIF"];

export function BienStatutSelect({ propertyId, statut }: { propertyId: string; statut: BienStatut }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={statut}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value as BienStatut;
        startTransition(() => {
          updatePropertyStatut(propertyId, value);
        });
      }}
      className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-700 disabled:opacity-50"
    >
      {ORDER.map((s) => (
        <option key={s} value={s}>
          {BIEN_STATUT_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
