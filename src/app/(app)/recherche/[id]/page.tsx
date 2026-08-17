import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES, TYPE_DEMANDE_LABELS } from "@/lib/constants";
import { DemandeStatutBadge } from "@/components/StatusBadge";
import { DemandeStatutSelect } from "@/components/DemandeStatutSelect";
import { PropositionsPanel } from "@/components/PropositionsPanel";

export const dynamic = "force-dynamic";

function fmtFCFA(n: number | null) {
  if (n === null) return "—";
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
}

export default async function DemandeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(CRM_ROLES);
  const { id } = await params;

  const [demande, properties, annonces] = await Promise.all([
    prisma.demandeRecherche.findUnique({
      where: { id },
      include: {
        propositions: {
          orderBy: { createdAt: "desc" },
          include: { property: true, annonceExterne: true },
        },
      },
    }),
    prisma.property.findMany({ orderBy: { nom: "asc" } }),
    prisma.annonceExterne.findMany({ where: { statut: "DISPONIBLE" }, orderBy: { dateRepere: "desc" } }),
  ]);

  if (!demande) notFound();

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <Link href="/recherche" className="text-sm text-neutral-500 hover:underline">
        ← Retour aux demandes
      </Link>

      <div className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{demande.nomClient}</h1>
          <p className="text-sm text-neutral-500">
            {demande.telephoneClient ?? "—"} · {TYPE_DEMANDE_LABELS[demande.typeDemande]}
          </p>
          <div className="mt-2">
            <DemandeStatutBadge statut={demande.statut} />
          </div>
        </div>
        <DemandeStatutSelect demandeId={demande.id} statut={demande.statut} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <PropositionsPanel
            demandeId={demande.id}
            propositions={demande.propositions}
            properties={properties}
            annonces={annonces}
          />
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900">Critères de recherche</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Type de bien</dt>
              <dd className="font-medium text-neutral-900">{demande.typeBien ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Quartier souhaité</dt>
              <dd className="font-medium text-neutral-900">{demande.quartierSouhaite ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Budget</dt>
              <dd className="font-medium text-neutral-900">
                {fmtFCFA(demande.budgetMin)} – {fmtFCFA(demande.budgetMax)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Chambres</dt>
              <dd className="font-medium text-neutral-900">{demande.nbChambres ?? "—"}</dd>
            </div>
            {demande.notes && (
              <div>
                <dt className="text-neutral-500">Notes</dt>
                <dd className="whitespace-pre-wrap text-neutral-900">{demande.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
