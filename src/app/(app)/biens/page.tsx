import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BienStatutBadge } from "@/components/StatusBadge";
import { requireUser } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

function fmtFCFA(n: number | null) {
  if (n === null) return "—";
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
}

export default async function BiensPage() {
  const user = await requireUser();
  const isCrm = CRM_ROLES.includes(user.role);
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: { checklists: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Biens</h1>
          <p className="text-sm text-neutral-500">{properties.length} bien(s) sous mandat PHANY</p>
        </div>
        {isCrm && (
          <Link
            href="/biens/new"
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
          >
            + Nouveau bien
          </Link>
        )}
      </div>

      {properties.length === 0 ? (
        <p className="text-sm text-neutral-400">
          Aucun bien pour le moment. Un bien est créé lorsqu&apos;un mandat est signé avec un prospect.
        </p>
      ) : (
        <div className="space-y-3">
          {properties.map((p) => {
            const latestChecklist = p.checklists[0];
            return (
              <Link
                key={p.id}
                href={`/biens/${p.id}`}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm hover:border-amber-300"
              >
                <div>
                  <p className="font-medium text-neutral-900">{p.nom}</p>
                  <p className="text-sm text-neutral-500">
                    {p.quartier ?? "—"} · {p.typeBien ?? "—"} {p.nbChambres ? `· ${p.nbChambres} ch.` : ""}
                  </p>
                  {isCrm && (
                    <p className="text-xs text-neutral-400">
                      {fmtFCFA(p.loyerEstime)} / mois estimé · commission {p.commissionPct}%
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <BienStatutBadge statut={p.statut} />
                  {latestChecklist && (
                    <span className="text-xs text-neutral-400">
                      Ménage : {latestChecklist.statut === "TERMINE" ? "terminé" : "en cours"}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
