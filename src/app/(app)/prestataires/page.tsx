import { prisma } from "@/lib/prisma";
import { createPrestataire } from "@/lib/actions/prestataires";
import { METIER_LABELS } from "@/lib/constants";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export default async function PrestatairesPage() {
  await requireRole(CRM_ROLES);
  const prestataires = await prisma.prestataire.findMany({
    orderBy: { nom: "asc" },
    include: { _count: { select: { incidents: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Réseau de prestataires</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Plombier, électricien, climatisation, serrurier, menuisier, peintre, électroménager — sélectionnés et
        référencés par PHANY pour intervenir sur les biens.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {prestataires.length === 0 && (
            <p className="text-sm text-neutral-400">Aucun prestataire enregistré pour le moment.</p>
          )}
          {prestataires.map((p) => (
            <div key={p.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-900">{p.nom}</p>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                  {p._count.incidents} intervention(s)
                </span>
              </div>
              <p className="text-sm text-neutral-500">
                {METIER_LABELS[p.metier]} {p.zone ? `· ${p.zone}` : ""} {p.telephone ? `· ${p.telephone}` : ""}
              </p>
              {p.notes && <p className="mt-1 text-sm text-neutral-600">{p.notes}</p>}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">Nouveau prestataire</h2>
          <form action={createPrestataire} className="space-y-3">
            <input name="nom" placeholder="Nom *" required className={inputClass} />
            <select name="metier" defaultValue="AUTRE" className={inputClass}>
              {Object.entries(METIER_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input name="telephone" placeholder="Téléphone" className={inputClass} />
            <input name="zone" placeholder="Zone d'intervention" className={inputClass} />
            <textarea name="notes" placeholder="Notes" rows={3} className={inputClass} />
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
            >
              Ajouter le prestataire
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
