import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateMandat } from "@/lib/actions/assetServices";
import { MandatAssetStatutBadge } from "@/components/StatusBadge";
import { ActifsPanel } from "@/components/ActifsPanel";
import { MANDAT_ASSET_STATUT_LABELS } from "@/lib/constants";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

export default async function MandatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(CRM_ROLES);
  const { id } = await params;

  const mandat = await prisma.mandatAssetServices.findUnique({
    where: { id },
    include: { actifs: { orderBy: { createdAt: "desc" } } },
  });

  if (!mandat) notFound();

  const updateAction = updateMandat.bind(null, mandat.id);
  const enExploitation = mandat.actifs.filter((a) => a.statut === "EN_EXPLOITATION").length;
  const enRemiseEnEtat = mandat.actifs.filter((a) => a.statut === "EN_REMISE_EN_ETAT").length;

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <Link href="/asset-services" className="text-sm text-neutral-500 hover:underline">
        ← Retour à Asset Services
      </Link>

      <div className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{mandat.institution}</h1>
          <p className="text-sm text-neutral-500">
            {mandat.contactNom ?? "—"} {mandat.contactTelephone ? `· ${mandat.contactTelephone}` : ""}
          </p>
          <div className="mt-2">
            <MandatAssetStatutBadge statut={mandat.statut} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">Informations du mandat</h2>
            <form action={updateAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-neutral-700">Institution</span>
                <input name="institution" defaultValue={mandat.institution} className={inputClass} />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-neutral-700">Contact (nom)</span>
                <input name="contactNom" defaultValue={mandat.contactNom ?? ""} className={inputClass} />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-neutral-700">Contact (téléphone)</span>
                <input name="contactTelephone" defaultValue={mandat.contactTelephone ?? ""} className={inputClass} />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-neutral-700">Contact (email)</span>
                <input type="email" name="contactEmail" defaultValue={mandat.contactEmail ?? ""} className={inputClass} />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-neutral-700">Honoraires PHANY (%)</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  name="honorairesPct"
                  defaultValue={mandat.honorairesPct ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <span className="mb-1 block text-sm font-medium text-neutral-700">Statut</span>
                <select name="statut" defaultValue={mandat.statut} className={inputClass}>
                  {Object.entries(MANDAT_ASSET_STATUT_LABELS).map(([value, label]) => (
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
                  defaultValue={mandat.dateFin ? mandat.dateFin.toISOString().slice(0, 10) : ""}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-neutral-700">Notes</span>
                <textarea name="notes" rows={3} defaultValue={mandat.notes ?? ""} className={inputClass} />
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
            <ActifsPanel mandatId={mandat.id} actifs={mandat.actifs} />
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">Résumé du portefeuille</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Actifs au total</dt>
              <dd className="font-medium text-neutral-900">{mandat.actifs.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">En remise en état</dt>
              <dd className="font-medium text-neutral-900">{enRemiseEnEtat}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">En exploitation PHANY</dt>
              <dd className="font-medium text-emerald-600">{enExploitation}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Début du mandat</dt>
              <dd className="font-medium text-neutral-900">{fmtDate(mandat.dateDebut)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Fin du mandat</dt>
              <dd className="font-medium text-neutral-900">{fmtDate(mandat.dateFin)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
