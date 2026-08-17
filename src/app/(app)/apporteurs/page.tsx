import { prisma } from "@/lib/prisma";
import { createApporteur } from "@/lib/actions/apporteurs";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export default async function ApporteursPage() {
  await requireRole(CRM_ROLES);
  const apporteurs = await prisma.apporteur.findMany({
    orderBy: { nom: "asc" },
    include: { _count: { select: { prospects: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Apporteurs d&apos;affaires</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Agents et partenaires qui orientent des propriétaires vers PHANY sans perdre leur propre client.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {apporteurs.length === 0 && (
            <p className="text-sm text-neutral-400">Aucun apporteur enregistré pour le moment.</p>
          )}
          {apporteurs.map((a) => (
            <div key={a.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-900">{a.nom}</p>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                  {a._count.prospects} prospect(s)
                </span>
              </div>
              <p className="text-sm text-neutral-500">
                {a.structure ?? "—"} {a.telephone ? `· ${a.telephone}` : ""}{" "}
                {a.commissionPct ? `· Commission ${a.commissionPct}%` : ""}
              </p>
              {a.notes && <p className="mt-1 text-sm text-neutral-600">{a.notes}</p>}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">Nouvel apporteur</h2>
          <form action={createApporteur} className="space-y-3">
            <input name="nom" placeholder="Nom *" required className={inputClass} />
            <input name="structure" placeholder="Structure / Agence" className={inputClass} />
            <input name="telephone" placeholder="Téléphone" className={inputClass} />
            <input
              name="commissionPct"
              type="number"
              step="0.1"
              placeholder="Commission apporteur (%)"
              className={inputClass}
            />
            <textarea name="notes" placeholder="Notes" rows={3} className={inputClass} />
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
            >
              Ajouter l&apos;apporteur
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
