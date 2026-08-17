import {
  POTENTIEL_LABELS,
  PROSPECT_STATUT_LABELS,
  PROSPECT_STATUT_ORDER,
  PROSPECT_TYPE_LABELS,
} from "@/lib/constants";
import type { Apporteur, Potentiel, Prospect, ProspectStatut, ProspectType } from "@/generated/prisma/client";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export function ProspectForm({
  action,
  prospect,
  apporteurs,
  includeStatut = false,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  prospect?: Prospect | null;
  apporteurs: Apporteur[];
  includeStatut?: boolean;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nom *">
          <input name="nom" required defaultValue={prospect?.nom} className={inputClass} />
        </Field>
        <Field label="Téléphone">
          <input name="telephone" defaultValue={prospect?.telephone ?? ""} className={inputClass} />
        </Field>
        <Field label="Type de prospect">
          <select name="type" defaultValue={prospect?.type ?? "PROPRIETAIRE_MEUBLE"} className={inputClass}>
            {Object.entries(PROSPECT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Source">
          <input
            name="source"
            placeholder="Terrain, Facebook, LinkedIn, Réseau..."
            defaultValue={prospect?.source ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Quartier">
          <input name="quartier" defaultValue={prospect?.quartier ?? ""} className={inputClass} />
        </Field>
        <Field label="Type de bien">
          <input
            name="typeBien"
            placeholder="Appartement, Villa, Studio..."
            defaultValue={prospect?.typeBien ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Nombre de chambres">
          <input
            type="number"
            min={0}
            name="nbChambres"
            defaultValue={prospect?.nbChambres ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Potentiel">
          <select name="potentiel" defaultValue={prospect?.potentiel ?? "MOYEN"} className={inputClass}>
            {Object.entries(POTENTIEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        {includeStatut && (
          <Field label="Statut">
            <select name="statut" defaultValue={prospect?.statut ?? "NOUVEAU"} className={inputClass}>
              {[...PROSPECT_STATUT_ORDER, "PERDU" as ProspectStatut].map((s) => (
                <option key={s} value={s}>
                  {PROSPECT_STATUT_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Apporteur d'affaires">
          <select name="apporteurId" defaultValue={prospect?.apporteurId ?? ""} className={inputClass}>
            <option value="">Aucun</option>
            {apporteurs.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nom}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Prochaine relance">
          <input
            type="date"
            name="prochaineRelance"
            defaultValue={prospect?.prochaineRelance ? prospect.prochaineRelance.toISOString().slice(0, 10) : ""}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" name="meuble" defaultChecked={prospect?.meuble} className="h-4 w-4 rounded border-neutral-300" />
          Meublé
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="disponible"
            defaultChecked={prospect?.disponible}
            className="h-4 w-4 rounded border-neutral-300"
          />
          Disponible actuellement
        </label>
      </div>

      <Field label="Notes">
        <textarea name="notes" rows={4} defaultValue={prospect?.notes ?? ""} className={inputClass} />
      </Field>

      <button
        type="submit"
        className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
      >
        {submitLabel}
      </button>
    </form>
  );
}
