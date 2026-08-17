import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES, SOURCE_ANNONCE_LABELS, TYPES_BIEN_RECHERCHE } from "@/lib/constants";
import { createAnnonce } from "@/lib/actions/recherche";
import { AnnonceStatutBadge } from "@/components/StatusBadge";
import { AnnonceStatutSelect } from "@/components/AnnonceStatutSelect";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

function fmtFCFA(n: number | null) {
  if (n === null) return "—";
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
}

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(d);
}

export default async function AnnoncesPage() {
  await requireRole(CRM_ROLES);

  const annonces = await prisma.annonceExterne.findMany({ orderBy: { dateRepere: "desc" } });

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <Link href="/recherche" className="text-sm text-neutral-500 hover:underline">
        ← Retour aux demandes
      </Link>
      <div className="mt-2 mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Annonces repérées</h1>
        <p className="text-sm text-neutral-500">
          Répertoire des biens trouvés sur Facebook, WhatsApp, des sites d&apos;annonces ou sur le terrain, à
          proposer aux clients en recherche.
        </p>
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Saisie manuelle par l&apos;équipe : PHANY ne scrute pas automatiquement Facebook ou WhatsApp
          (ni les API publiques ni les conditions d&apos;utilisation de ces plateformes ne le permettent). Chaque
          membre de l&apos;équipe qui repère une annonce l&apos;ajoute ici.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {annonces.length === 0 && <p className="text-sm text-neutral-400">Aucune annonce enregistrée.</p>}
          {annonces.map((a) => (
            <div key={a.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-neutral-900">{a.titre}</p>
                  <p className="text-sm text-neutral-500">
                    {SOURCE_ANNONCE_LABELS[a.source]} · {a.typeBien ?? "—"} {a.quartier ? `· ${a.quartier}` : ""}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {fmtFCFA(a.prix)} · repérée le {fmtDate(a.dateRepere)}
                    {a.lienOuContact ? ` · ${a.lienOuContact}` : ""}
                  </p>
                  {a.description && <p className="mt-1 text-sm text-neutral-600">{a.description}</p>}
                </div>
                <AnnonceStatutBadge statut={a.statut} />
              </div>
              <div className="mt-2">
                <AnnonceStatutSelect annonceId={a.id} statut={a.statut} />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">Ajouter une annonce repérée</h2>
          <form action={createAnnonce} className="space-y-3">
            <input name="titre" placeholder="Titre / description courte *" required className={inputClass} />
            <select name="source" defaultValue="FACEBOOK" className={inputClass}>
              {Object.entries(SOURCE_ANNONCE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input name="lienOuContact" placeholder="Lien ou contact" className={inputClass} />
            <select name="typeBien" defaultValue="" className={inputClass}>
              <option value="">Type de bien</option>
              {TYPES_BIEN_RECHERCHE.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input name="quartier" placeholder="Quartier" className={inputClass} />
            <input type="number" min={0} name="prix" placeholder="Prix (FCFA)" className={inputClass} />
            <textarea name="description" placeholder="Description" rows={2} className={inputClass} />
            <textarea name="notes" placeholder="Notes internes" rows={2} className={inputClass} />
            <button
              type="submit"
              className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
            >
              Ajouter l&apos;annonce
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
