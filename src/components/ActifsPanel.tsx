import Link from "next/link";
import { convertActifToProperty, createActif, updateActif } from "@/lib/actions/assetServices";
import { ACTIF_STATUT_LABELS, ACTIF_STATUT_ORDER } from "@/lib/constants";
import { ActifStatutBadge } from "@/components/StatusBadge";
import type { ActifBancaire } from "@/generated/prisma/client";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

function fmtFCFA(n: number | null) {
  if (n === null) return "—";
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
}

export function ActifsPanel({ mandatId, actifs }: { mandatId: string; actifs: ActifBancaire[] }) {
  const createAction = createActif.bind(null, mandatId);

  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-neutral-900">
        Portefeuille d&apos;actifs ({actifs.length})
      </h2>

      <form action={createAction} className="mb-5 space-y-3 rounded-lg border border-neutral-100 bg-neutral-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Ajouter un actif</p>
        <input name="nom" required placeholder="Nom / référence du bien *" className={inputClass} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input name="adresse" placeholder="Adresse" className={inputClass} />
          <input name="quartier" placeholder="Quartier" className={inputClass} />
          <input name="typeBien" placeholder="Type de bien" className={inputClass} />
          <input type="number" min={0} name="nbChambres" placeholder="Chambres" className={inputClass} />
          <input type="number" min={0} name="valeurEstimee" placeholder="Valeur estimée (FCFA)" className={inputClass} />
          <input
            type="number"
            min={0}
            name="budgetRemiseEnEtat"
            placeholder="Budget remise en état (FCFA)"
            className={inputClass}
          />
        </div>
        <textarea name="notes" placeholder="État constaté, notes..." rows={2} className={inputClass} />
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Ajouter l&apos;actif
        </button>
      </form>

      {actifs.length === 0 ? (
        <p className="text-sm text-neutral-400">Aucun actif enregistré pour ce mandat.</p>
      ) : (
        <ul className="space-y-3">
          {actifs.map((actif) => {
            const updateAction = updateActif.bind(null, actif.id, mandatId);
            const convertAction = convertActifToProperty.bind(null, actif.id, mandatId);
            return (
              <li key={actif.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{actif.nom}</p>
                    <p className="text-xs text-neutral-400">
                      {actif.quartier ?? "—"} {actif.typeBien ? `· ${actif.typeBien}` : ""}
                      {actif.nbChambres ? ` · ${actif.nbChambres} ch.` : ""}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Valeur estimée {fmtFCFA(actif.valeurEstimee)} · Budget remise en état{" "}
                      {fmtFCFA(actif.budgetRemiseEnEtat)}
                      {actif.coutRemiseEnEtatReel !== null ? ` · Coût réel ${fmtFCFA(actif.coutRemiseEnEtatReel)}` : ""}
                    </p>
                  </div>
                  <ActifStatutBadge statut={actif.statut} />
                </div>

                {actif.propertyId ? (
                  <p className="text-sm text-emerald-700">
                    ✓ Converti en bien PHANY —{" "}
                    <Link href={`/biens/${actif.propertyId}`} className="hover:underline">
                      voir la fiche du bien
                    </Link>
                  </p>
                ) : (
                  <>
                    <form action={updateAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <select name="statut" defaultValue={actif.statut} className={inputClass}>
                        {ACTIF_STATUT_ORDER.filter((s) => s !== "EN_EXPLOITATION").map((s) => (
                          <option key={s} value={s}>
                            {ACTIF_STATUT_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={0}
                        name="valeurEstimee"
                        placeholder="Valeur estimée (FCFA)"
                        defaultValue={actif.valeurEstimee ?? ""}
                        className={inputClass}
                      />
                      <input
                        type="number"
                        min={0}
                        name="budgetRemiseEnEtat"
                        placeholder="Budget remise en état (FCFA)"
                        defaultValue={actif.budgetRemiseEnEtat ?? ""}
                        className={inputClass}
                      />
                      <input
                        type="number"
                        min={0}
                        name="coutRemiseEnEtatReel"
                        placeholder="Coût réel des travaux (FCFA)"
                        defaultValue={actif.coutRemiseEnEtatReel ?? ""}
                        className={inputClass}
                      />
                      <textarea
                        name="notes"
                        placeholder="Notes"
                        defaultValue={actif.notes ?? ""}
                        rows={2}
                        className={`sm:col-span-2 ${inputClass}`}
                      />
                      <button
                        type="submit"
                        className="sm:col-span-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                      >
                        Mettre à jour
                      </button>
                    </form>

                    {actif.statut === "PRET" && (
                      <form
                        action={convertAction}
                        className="mt-3 space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3"
                      >
                        <p className="text-xs font-semibold text-emerald-800">
                          Convertir en bien PHANY exploité (réservations, ménage, maintenance)
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <input
                            type="number"
                            min={0}
                            name="loyerEstime"
                            placeholder="Loyer mensuel estimé"
                            required
                            className={inputClass}
                          />
                          <input
                            type="number"
                            min={0}
                            name="chargesMensuelles"
                            placeholder="Charges mensuelles"
                            className={inputClass}
                          />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step="0.1"
                            name="commissionPct"
                            placeholder="Commission %"
                            defaultValue={20}
                            className={inputClass}
                          />
                        </div>
                        <button
                          type="submit"
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                        >
                          Convertir en bien PHANY
                        </button>
                      </form>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
