import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSejour, updateContrat } from "@/lib/actions/corporate";
import { ContratStatutBadge, SejourStatutBadge } from "@/components/StatusBadge";
import { SejourStatutSelect } from "@/components/SejourStatutSelect";
import { CONTRAT_STATUT_LABELS } from "@/lib/constants";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

export default async function ContratDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(CRM_ROLES);
  const { id } = await params;

  const [contrat, properties] = await Promise.all([
    prisma.contratCorporate.findUnique({
      where: { id },
      include: {
        sejours: { orderBy: { dateArrivee: "desc" }, include: { property: true } },
      },
    }),
    prisma.property.findMany({ orderBy: { nom: "asc" } }),
  ]);

  if (!contrat) notFound();

  const updateAction = updateContrat.bind(null, contrat.id);
  const sejourAction = createSejour.bind(null, contrat.id);

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <Link href="/corporate" className="text-sm text-neutral-500 hover:underline">
        ← Retour à Corporate
      </Link>

      <div className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{contrat.entreprise}</h1>
          <p className="text-sm text-neutral-500">
            {contrat.contactNom ?? "—"} {contrat.contactTelephone ? `· ${contrat.contactTelephone}` : ""}
          </p>
          <div className="mt-2">
            <ContratStatutBadge statut={contrat.statut} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">Informations du contrat</h2>
            <form action={updateAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-neutral-700">Entreprise</span>
                <input name="entreprise" defaultValue={contrat.entreprise} className={inputClass} />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-neutral-700">Contact (nom)</span>
                <input name="contactNom" defaultValue={contrat.contactNom ?? ""} className={inputClass} />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-neutral-700">Contact (téléphone)</span>
                <input name="contactTelephone" defaultValue={contrat.contactTelephone ?? ""} className={inputClass} />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-neutral-700">Contact (email)</span>
                <input type="email" name="contactEmail" defaultValue={contrat.contactEmail ?? ""} className={inputClass} />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-neutral-700">Tarif nuitée (FCFA)</span>
                <input type="number" min={0} name="tarifNuitee" defaultValue={contrat.tarifNuitee ?? ""} className={inputClass} />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-neutral-700">Statut</span>
                <select name="statut" defaultValue={contrat.statut} className={inputClass}>
                  {Object.entries(CONTRAT_STATUT_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-neutral-700">Date de fin</span>
                <input
                  type="date"
                  name="dateFin"
                  defaultValue={contrat.dateFin ? contrat.dateFin.toISOString().slice(0, 10) : ""}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-neutral-700">Notes</span>
                <textarea name="notes" rows={3} defaultValue={contrat.notes ?? ""} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">
              Séjours des collaborateurs ({contrat.sejours.length})
            </h2>
            {contrat.sejours.length === 0 ? (
              <p className="text-sm text-neutral-400">Aucun séjour enregistré pour ce contrat.</p>
            ) : (
              <ul className="mb-5 divide-y divide-neutral-100">
                {contrat.sejours.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{s.collaborateurNom}</p>
                      <p className="text-xs text-neutral-400">
                        <Link href={`/biens/${s.propertyId}`} className="hover:underline">
                          {s.property.nom}
                        </Link>{" "}
                        · {fmtDate(s.dateArrivee)} → {fmtDate(s.dateDepart)}
                      </p>
                    </div>
                    <SejourStatutSelect sejourId={s.id} contratId={contrat.id} statut={s.statut} />
                  </li>
                ))}
              </ul>
            )}

            <form action={sejourAction} className="space-y-3 rounded-lg border border-neutral-100 bg-neutral-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Enregistrer un séjour
              </p>
              <input name="collaborateurNom" required placeholder="Nom du collaborateur *" className={inputClass} />
              <select name="propertyId" required defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Choisir un bien *
                </option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <span className="mb-1 block text-xs text-neutral-500">Date d&apos;arrivée *</span>
                  <input type="date" name="dateArrivee" required className={inputClass} />
                </div>
                <div>
                  <span className="mb-1 block text-xs text-neutral-500">Date de départ</span>
                  <input type="date" name="dateDepart" className={inputClass} />
                </div>
              </div>
              <textarea name="notes" placeholder="Notes" rows={2} className={inputClass} />
              <button
                type="submit"
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Enregistrer le séjour
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">Résumé</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Tarif nuitée</dt>
              <dd className="font-medium text-neutral-900">
                {contrat.tarifNuitee ? `${new Intl.NumberFormat("fr-FR").format(contrat.tarifNuitee)} FCFA` : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Début</dt>
              <dd className="font-medium text-neutral-900">{fmtDate(contrat.dateDebut)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Fin</dt>
              <dd className="font-medium text-neutral-900">{fmtDate(contrat.dateFin)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Séjours en cours</dt>
              <dd className="font-medium text-neutral-900">
                {contrat.sejours.filter((s) => s.statut === "EN_COURS").length}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
