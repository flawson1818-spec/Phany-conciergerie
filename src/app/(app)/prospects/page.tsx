import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PROSPECT_STATUT_LABELS, PROSPECT_STATUT_ORDER, PROSPECT_TYPE_LABELS } from "@/lib/constants";
import { PotentielBadge } from "@/components/StatusBadge";
import { ProspectStatutSelect } from "@/components/ProspectStatutSelect";
import type { ProspectStatut } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(d);
}

export default async function ProspectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireRole(CRM_ROLES);
  const { q } = await searchParams;

  const prospects = await prisma.prospect.findMany({
    where: q
      ? {
          OR: [
            { nom: { contains: q } },
            { quartier: { contains: q } },
            { typeBien: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { updatedAt: "desc" },
  });

  const columns = [...PROSPECT_STATUT_ORDER, "PERDU" as ProspectStatut];
  const grouped = Object.fromEntries(columns.map((s) => [s, prospects.filter((p) => p.statut === s)]));

  return (
    <div className="mx-auto max-w-[1600px] px-8 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Prospects</h1>
          <p className="text-sm text-neutral-500">{prospects.length} prospect(s) au total</p>
        </div>
        <div className="flex items-center gap-3">
          <form className="flex items-center">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Rechercher un nom, quartier..."
              className="w-64 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </form>
          <Link
            href="/prospects/new"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
          >
            + Nouveau prospect
          </Link>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((statut) => (
          <div key={statut} className="w-72 shrink-0">
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {PROSPECT_STATUT_LABELS[statut]}
              </h2>
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600">
                {grouped[statut].length}
              </span>
            </div>
            <div className="space-y-2 rounded-xl bg-neutral-50 p-2 min-h-[80px]">
              {grouped[statut].map((p) => (
                <div key={p.id} className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
                  <Link href={`/prospects/${p.id}`} className="text-sm font-medium text-neutral-900 hover:underline">
                    {p.nom}
                  </Link>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {PROSPECT_TYPE_LABELS[p.type]} · {p.quartier ?? "—"}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <PotentielBadge potentiel={p.potentiel} />
                    <span className="text-[11px] text-neutral-400">
                      Relance : {fmtDate(p.prochaineRelance)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <ProspectStatutSelect prospectId={p.id} statut={p.statut} />
                  </div>
                </div>
              ))}
              {grouped[statut].length === 0 && (
                <p className="px-2 py-4 text-center text-xs text-neutral-400">Vide</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
