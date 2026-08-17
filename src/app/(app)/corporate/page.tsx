import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ContratStatutBadge } from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function CorporatePage() {
  await requireRole(CRM_ROLES);
  const contrats = await prisma.contratCorporate.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { sejours: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">PHANY Corporate</h1>
          <p className="text-sm text-neutral-500">
            Contrats entreprises et hébergement de collaborateurs en mission.
          </p>
        </div>
        <Link
          href="/corporate/new"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
        >
          + Nouveau contrat
        </Link>
      </div>

      {contrats.length === 0 ? (
        <p className="text-sm text-neutral-400">Aucun contrat corporate pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {contrats.map((c) => (
            <Link
              key={c.id}
              href={`/corporate/${c.id}`}
              className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm hover:border-amber-300"
            >
              <div>
                <p className="font-medium text-neutral-900">{c.entreprise}</p>
                <p className="text-sm text-neutral-500">
                  {c.contactNom ?? "—"} {c.contactTelephone ? `· ${c.contactTelephone}` : ""}
                </p>
                <p className="text-xs text-neutral-400">{c._count.sejours} séjour(s) enregistré(s)</p>
              </div>
              <ContratStatutBadge statut={c.statut} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
