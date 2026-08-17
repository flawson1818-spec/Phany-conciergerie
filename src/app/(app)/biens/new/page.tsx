import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProperty } from "@/lib/actions/properties";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export default async function NewPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ prospectId?: string }>;
}) {
  await requireRole(CRM_ROLES);
  const { prospectId } = await searchParams;
  const prospect = prospectId ? await prisma.prospect.findUnique({ where: { id: prospectId } }) : null;

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <Link href="/biens" className="text-sm text-neutral-500 hover:underline">
        ← Retour aux biens
      </Link>
      <h1 className="mb-1 mt-2 text-2xl font-semibold text-neutral-900">Nouveau bien</h1>
      {prospect && (
        <p className="mb-6 text-sm text-neutral-500">
          Créé à partir du mandat signé avec <strong>{prospect.nom}</strong>.
        </p>
      )}
      {!prospect && <div className="mb-6" />}

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <form action={createProperty} className="space-y-4">
          {prospectId && <input type="hidden" name="prospectId" value={prospectId} />}
          <div>
            <span className="mb-1 block text-sm font-medium text-neutral-700">Nom du bien *</span>
            <input
              name="nom"
              required
              defaultValue={prospect ? `${prospect.typeBien ?? "Bien"} ${prospect.quartier ?? ""} - ${prospect.nom}` : ""}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Adresse</span>
              <input name="adresse" className={inputClass} />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Quartier</span>
              <input name="quartier" defaultValue={prospect?.quartier ?? ""} className={inputClass} />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Type de bien</span>
              <input name="typeBien" defaultValue={prospect?.typeBien ?? ""} className={inputClass} />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Nombre de chambres</span>
              <input type="number" min={0} name="nbChambres" defaultValue={prospect?.nbChambres ?? ""} className={inputClass} />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Loyer mensuel estimé (FCFA)</span>
              <input type="number" min={0} name="loyerEstime" className={inputClass} />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Charges mensuelles (FCFA)</span>
              <input type="number" min={0} name="chargesMensuelles" className={inputClass} />
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-neutral-700">Commission PHANY (%)</span>
              <input type="number" min={0} max={100} step="0.1" name="commissionPct" defaultValue={20} className={inputClass} />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
          >
            Créer le bien et démarrer la préparation
          </button>
        </form>
      </div>
    </div>
  );
}
