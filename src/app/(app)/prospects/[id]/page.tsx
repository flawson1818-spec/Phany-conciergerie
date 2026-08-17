import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PROSPECT_TYPE_LABELS } from "@/lib/constants";
import { PotentielBadge, ProspectStatutBadge } from "@/components/StatusBadge";
import { LogInteractionForm } from "@/components/LogInteractionForm";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

function fmtDateTime(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(d);
}

export default async function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(CRM_ROLES);
  const { id } = await params;

  const prospect = await prisma.prospect.findUnique({
    where: { id },
    include: {
      apporteur: true,
      interactions: { orderBy: { date: "desc" } },
      properties: true,
      contratsCorporate: true,
      mandatsAsset: true,
    },
  });

  if (!prospect) notFound();

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <Link href="/prospects" className="text-sm text-neutral-500 hover:underline">
        ← Retour aux prospects
      </Link>

      <div className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{prospect.nom}</h1>
          <p className="text-sm text-neutral-500">
            {PROSPECT_TYPE_LABELS[prospect.type]} {prospect.quartier ? `· ${prospect.quartier}` : ""}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <ProspectStatutBadge statut={prospect.statut} />
            <PotentielBadge potentiel={prospect.potentiel} />
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/prospects/${prospect.id}/edit`}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Modifier la fiche
          </Link>
          {prospect.statut === "MANDAT_SIGNE" &&
            prospect.type === "ENTREPRISE" &&
            prospect.contratsCorporate.length === 0 && (
              <Link
                href={`/corporate/new?prospectId=${prospect.id}`}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Créer le contrat corporate
              </Link>
            )}
          {prospect.statut === "MANDAT_SIGNE" &&
            prospect.type === "INSTITUTION_BANQUE" &&
            prospect.mandatsAsset.length === 0 && (
              <Link
                href={`/asset-services/new?prospectId=${prospect.id}`}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Créer le mandat Asset Services
              </Link>
            )}
          {prospect.statut === "MANDAT_SIGNE" &&
            prospect.type !== "ENTREPRISE" &&
            prospect.type !== "INSTITUTION_BANQUE" &&
            prospect.properties.length === 0 && (
              <Link
                href={`/biens/new?prospectId=${prospect.id}`}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Créer le bien
              </Link>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">Fiche prospect</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-neutral-400">Téléphone</dt>
                <dd className="text-neutral-900">{prospect.telephone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-neutral-400">Source</dt>
                <dd className="text-neutral-900">{prospect.source ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-neutral-400">Type de bien</dt>
                <dd className="text-neutral-900">
                  {prospect.typeBien ?? "—"} {prospect.nbChambres ? `· ${prospect.nbChambres} ch.` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-400">Meublé / Disponible</dt>
                <dd className="text-neutral-900">
                  {prospect.meuble ? "Meublé" : "Non meublé"} · {prospect.disponible ? "Disponible" : "Non disponible"}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-400">Dernier contact</dt>
                <dd className="text-neutral-900">{fmtDateTime(prospect.dernierContact)}</dd>
              </div>
              <div>
                <dt className="text-neutral-400">Prochaine relance</dt>
                <dd className="text-neutral-900">{fmtDateTime(prospect.prochaineRelance)}</dd>
              </div>
              {prospect.apporteur && (
                <div className="col-span-2">
                  <dt className="text-neutral-400">Apporteur d&apos;affaires</dt>
                  <dd className="text-neutral-900">
                    <Link href="/apporteurs" className="hover:underline">
                      {prospect.apporteur.nom}
                    </Link>
                  </dd>
                </div>
              )}
              {prospect.notes && (
                <div className="col-span-2">
                  <dt className="text-neutral-400">Notes</dt>
                  <dd className="whitespace-pre-wrap text-neutral-900">{prospect.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">
              Historique des contacts ({prospect.interactions.length})
            </h2>
            {prospect.interactions.length === 0 ? (
              <p className="text-sm text-neutral-400">Aucun contact enregistré pour le moment.</p>
            ) : (
              <ul className="space-y-4">
                {prospect.interactions.map((i) => (
                  <li key={i.id} className="border-l-2 border-amber-400 pl-3">
                    <p className="text-sm font-medium text-neutral-900">
                      {i.type} — {fmtDateTime(i.date)}
                    </p>
                    {i.note && <p className="text-sm text-neutral-600">{i.note}</p>}
                    {i.prochaineRelance && (
                      <p className="text-xs text-neutral-400">
                        Prochaine relance fixée au {fmtDateTime(i.prochaineRelance)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">Enregistrer un contact</h2>
          <LogInteractionForm prospectId={prospect.id} statut={prospect.statut} />
        </div>
      </div>
    </div>
  );
}
