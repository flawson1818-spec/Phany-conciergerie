import Link from "next/link";
import { createProposition, updateProposition } from "@/lib/actions/recherche";
import { STATUT_PAIEMENT_VISITE_LABELS } from "@/lib/constants";
import { StatutPaiementVisiteBadge } from "@/components/StatusBadge";
import type { AnnonceExterne, Property, Proposition } from "@/generated/prisma/client";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

function fmtFCFA(n: number | null) {
  if (n === null) return "—";
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
}

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

type PropositionWithRelations = Proposition & { property: Property | null; annonceExterne: AnnonceExterne | null };

export function PropositionsPanel({
  demandeId,
  propositions,
  properties,
  annonces,
}: {
  demandeId: string;
  propositions: PropositionWithRelations[];
  properties: Property[];
  annonces: AnnonceExterne[];
}) {
  const createAction = createProposition.bind(null, demandeId);

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-neutral-900">Propositions ({propositions.length})</h2>

      <form action={createAction} className="mb-5 space-y-3 rounded-lg border border-neutral-100 bg-neutral-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Proposer un bien</p>
        <select name="propertyId" defaultValue="" className={inputClass}>
          <option value="">— Bien PHANY (inventaire interne) —</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
            </option>
          ))}
        </select>
        <select name="annonceExterneId" defaultValue="" className={inputClass}>
          <option value="">— Annonce repérée (Facebook, WhatsApp, web...) —</option>
          {annonces.map((a) => (
            <option key={a.id} value={a.id}>
              {a.titre}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          name="fraisVisite"
          placeholder="Frais de visite demandés au client (FCFA)"
          className={inputClass}
        />
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Envoyer la proposition
        </button>
      </form>

      {propositions.length === 0 ? (
        <p className="text-sm text-neutral-400">Aucune proposition envoyée pour le moment.</p>
      ) : (
        <ul className="space-y-3">
          {propositions.map((p) => {
            const updateAction = updateProposition.bind(null, p.id, demandeId);
            const label = p.property
              ? `Bien PHANY : ${p.property.nom}`
              : p.annonceExterne
                ? `Annonce : ${p.annonceExterne.titre}`
                : "—";
            const link = p.property ? `/biens/${p.property.id}` : null;

            return (
              <li key={p.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {link ? <Link href={link} className="hover:underline">{label}</Link> : label}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Frais de visite {fmtFCFA(p.fraisVisite)} · Visite le {fmtDate(p.dateVisite)}
                    </p>
                  </div>
                  <StatutPaiementVisiteBadge statut={p.statutPaiement} />
                </div>

                <form action={updateAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="number"
                    min={0}
                    name="fraisVisite"
                    placeholder="Frais de visite (FCFA)"
                    defaultValue={p.fraisVisite ?? ""}
                    className={inputClass}
                  />
                  <select name="statutPaiement" defaultValue={p.statutPaiement} className={inputClass}>
                    {Object.entries(STATUT_PAIEMENT_VISITE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    name="dateVisite"
                    defaultValue={p.dateVisite ? p.dateVisite.toISOString().slice(0, 10) : ""}
                    className={inputClass}
                  />
                  <input
                    name="resultatVisite"
                    placeholder="Résultat de la visite"
                    defaultValue={p.resultatVisite ?? ""}
                    className={inputClass}
                  />
                  <button
                    type="submit"
                    className="sm:col-span-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Mettre à jour
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
