import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MandatAssetStatutBadge } from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AssetServicesPage() {
  await requireRole(CRM_ROLES);
  const mandats = await prisma.mandatAssetServices.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { actifs: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">PHANY Asset Services</h1>
          <p className="text-sm text-neutral-500">
            Mandats de gestion et de valorisation de portefeuilles pour banques et institutions.
          </p>
        </div>
        <Link
          href="/asset-services/new"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
        >
          + Nouveau mandat
        </Link>
      </div>

      {mandats.length === 0 ? (
        <p className="text-sm text-neutral-400">Aucun mandat Asset Services pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {mandats.map((m) => (
            <Link
              key={m.id}
              href={`/asset-services/${m.id}`}
              className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm hover:border-amber-300"
            >
              <div>
                <p className="font-medium text-neutral-900">{m.institution}</p>
                <p className="text-sm text-neutral-500">
                  {m.contactNom ?? "—"} {m.contactTelephone ? `· ${m.contactTelephone}` : ""}
                </p>
                <p className="text-xs text-neutral-400">{m._count.actifs} actif(s) dans le portefeuille</p>
              </div>
              <MandatAssetStatutBadge statut={m.statut} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
