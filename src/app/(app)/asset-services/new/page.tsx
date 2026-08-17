import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMandat } from "@/lib/actions/assetServices";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export default async function NewMandatPage({
  searchParams,
}: {
  searchParams: Promise<{ prospectId?: string }>;
}) {
  await requireRole(CRM_ROLES);
  const { prospectId } = await searchParams;
  const prospect = prospectId ? await prisma.prospect.findUnique({ where: { id: prospectId } }) : null;

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <Link href="/asset-services" className="text-sm text-neutral-500 hover:underline">
        ← Retour à Asset Services
      </Link>
      <h1 className="mb-1 mt-2 text-2xl font-semibold text-neutral-900">Nouveau mandat Asset Services</h1>
      {prospect && (
        <p className="mb-6 text-sm text-neutral-500">
          Créé à partir du prospect <strong>{prospect.nom}</strong>.
        </p>
      )}
      {!prospect && <div className="mb-6" />}

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <form action={createMandat} className="space-y-4">
          {prospectId && <input type="hidden" name="prospectId" value={prospectId} />}
          <div>
            <span className="mb-1 block text-sm font-medium text-neutral-700">Institution / banque *</span>
            <input name="institution" required defaultValue={prospect?.nom ?? ""} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Contact (nom)</span>
              <input name="contactNom" className={inputClass} />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Contact (téléphone)</span>
              <input name="contactTelephone" defaultValue={prospect?.telephone ?? ""} className={inputClass} />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Contact (email)</span>
              <input type="email" name="contactEmail" className={inputClass} />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Honoraires PHANY (%)</span>
              <input type="number" min={0} max={100} step="0.1" name="honorairesPct" className={inputClass} />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Date de fin (optionnel)</span>
              <input type="date" name="dateFin" className={inputClass} />
            </div>
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium text-neutral-700">Notes</span>
            <textarea name="notes" rows={3} defaultValue={prospect?.notes ?? ""} className={inputClass} />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
          >
            Créer le mandat
          </button>
        </form>
      </div>
    </div>
  );
}
