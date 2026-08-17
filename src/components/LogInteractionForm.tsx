"use client";

import { useRef } from "react";
import { logInteraction } from "@/lib/actions/prospects";
import { INTERACTION_TYPES, PROSPECT_STATUT_LABELS, PROSPECT_STATUT_ORDER } from "@/lib/constants";
import type { ProspectStatut } from "@/generated/prisma/client";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

function defaultRelanceDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 10);
}

export function LogInteractionForm({ prospectId, statut }: { prospectId: string; statut: ProspectStatut }) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = logInteraction.bind(null, prospectId);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData);
        formRef.current?.reset();
      }}
      className="space-y-4"
    >
      <div>
        <span className="mb-1 block text-sm font-medium text-neutral-700">Type de contact</span>
        <select name="type" defaultValue="Appel" className={inputClass}>
          {INTERACTION_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-neutral-700">Note</span>
        <textarea name="note" rows={3} placeholder="Ce qui a été dit, décidé..." className={inputClass} />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-neutral-700">Faire avancer le statut</span>
        <select name="statut" defaultValue={statut} className={inputClass}>
          {[...PROSPECT_STATUT_ORDER, "PERDU" as ProspectStatut].map((s) => (
            <option key={s} value={s}>
              {PROSPECT_STATUT_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-neutral-700">Prochaine relance *</span>
        <input type="date" name="prochaineRelance" required defaultValue={defaultRelanceDate()} className={inputClass} />
        <p className="mt-1 text-xs text-neutral-400">
          La règle d&apos;or : ne jamais laisser un prospect sans prochaine action.
        </p>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        Enregistrer le contact
      </button>
    </form>
  );
}
