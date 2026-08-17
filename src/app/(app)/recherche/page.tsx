import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES, TYPES_BIEN_RECHERCHE, TYPE_DEMANDE_LABELS } from "@/lib/constants";
import { createDemande } from "@/lib/actions/recherche";
import { DemandeStatutBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

function fmtFCFA(n: number | null) {
  if (n === null) return "—";
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
}

export default async function RecherchePage() {
  await requireRole(CRM_ROLES);

  const demandes = await prisma.demandeRecherche.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { propositions: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Recherche de logement</h1>
          <p className="text-sm text-neutral-500">
            Demandes de location, achat, boutique, terrain, entrepôt et autres biens pour des clients.
          </p>
        </div>
        <Link
          href="/recherche/annonces"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Annonces repérées →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {demandes.length === 0 && <p className="text-sm text-neutral-400">Aucune demande pour le moment.</p>}
          {demandes.map((d) => (
            <Link
              key={d.id}
              href={`/recherche/${d.id}`}
              className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm hover:border-amber-300"
            >
              <div>
                <p className="font-medium text-neutral-900">{d.nomClient}</p>
                <p className="text-sm text-neutral-500">
                  {TYPE_DEMANDE_LABELS[d.typeDemande]} · {d.typeBien ?? "—"} {d.quartierSouhaite ? `· ${d.quartierSouhaite}` : ""}
                </p>
                <p className="text-xs text-neutral-400">
                  Budget {fmtFCFA(d.budgetMin)} – {fmtFCFA(d.budgetMax)} · {d._count.propositions} proposition(s)
                </p>
              </div>
              <DemandeStatutBadge statut={d.statut} />
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">Nouvelle demande</h2>
          <form action={createDemande} className="space-y-3">
            <input name="nomClient" placeholder="Nom du client *" required className={inputClass} />
            <input name="telephoneClient" placeholder="Téléphone" className={inputClass} />
            <select name="typeDemande" defaultValue="LOCATION" className={inputClass}>
              {Object.entries(TYPE_DEMANDE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select name="typeBien" defaultValue="" className={inputClass}>
              <option value="">Type de bien recherché</option>
              {TYPES_BIEN_RECHERCHE.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input name="quartierSouhaite" placeholder="Quartier souhaité" className={inputClass} />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" min={0} name="budgetMin" placeholder="Budget min" className={inputClass} />
              <input type="number" min={0} name="budgetMax" placeholder="Budget max" className={inputClass} />
            </div>
            <input type="number" min={0} name="nbChambres" placeholder="Nombre de chambres" className={inputClass} />
            <textarea name="notes" placeholder="Notes" rows={3} className={inputClass} />
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
            >
              Créer la demande
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
