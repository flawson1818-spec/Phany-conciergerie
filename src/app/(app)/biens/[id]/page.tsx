import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePropertyFinancials } from "@/lib/actions/properties";
import { BienStatutSelect } from "@/components/BienStatutSelect";
import { Calculateur } from "@/components/Calculateur";
import { Checklist } from "@/components/Checklist";
import { IncidentsPanel } from "@/components/IncidentsPanel";
import { requireUser } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const isCrm = CRM_ROLES.includes(user.role);
  const { id } = await params;

  const [property, prestataires] = await Promise.all([
    prisma.property.findUnique({
      where: { id },
      include: {
        prospect: true,
        checklists: { orderBy: { createdAt: "desc" }, take: 1 },
        incidents: { orderBy: { signaleLe: "desc" }, include: { prestataire: true } },
      },
    }),
    prisma.prestataire.findMany({ orderBy: { nom: "asc" } }),
  ]);

  if (!property) notFound();

  const latestChecklist = property.checklists[0];
  const action = updatePropertyFinancials.bind(null, property.id);

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <Link href="/biens" className="text-sm text-neutral-500 hover:underline">
        ← Retour aux biens
      </Link>

      <div className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{property.nom}</h1>
          <p className="text-sm text-neutral-500">
            {property.adresse ?? property.quartier ?? "—"}
            {property.prospect ? (
              <>
                {" "}
                · Propriétaire :{" "}
                <Link href={`/prospects/${property.prospect.id}`} className="hover:underline">
                  {property.prospect.nom}
                </Link>
              </>
            ) : null}
          </p>
        </div>
        <BienStatutSelect propertyId={property.id} statut={property.statut} />
      </div>

      <div className={`grid grid-cols-1 gap-6 ${isCrm ? "lg:grid-cols-3" : ""}`}>
        <div className={`space-y-6 ${isCrm ? "lg:col-span-2" : ""}`}>
          {isCrm && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-neutral-900">Informations & finances</h2>
              <form action={action} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium text-neutral-700">Nom du bien</span>
                  <input name="nom" defaultValue={property.nom} className={inputClass} />
                </div>
                <div>
                  <span className="mb-1 block text-sm font-medium text-neutral-700">Adresse</span>
                  <input name="adresse" defaultValue={property.adresse ?? ""} className={inputClass} />
                </div>
                <div>
                  <span className="mb-1 block text-sm font-medium text-neutral-700">Quartier</span>
                  <input name="quartier" defaultValue={property.quartier ?? ""} className={inputClass} />
                </div>
                <div>
                  <span className="mb-1 block text-sm font-medium text-neutral-700">Type de bien</span>
                  <input name="typeBien" defaultValue={property.typeBien ?? ""} className={inputClass} />
                </div>
                <div>
                  <span className="mb-1 block text-sm font-medium text-neutral-700">Chambres</span>
                  <input type="number" min={0} name="nbChambres" defaultValue={property.nbChambres ?? ""} className={inputClass} />
                </div>
                <div>
                  <span className="mb-1 block text-sm font-medium text-neutral-700">Loyer mensuel estimé (FCFA)</span>
                  <input type="number" min={0} name="loyerEstime" defaultValue={property.loyerEstime ?? ""} className={inputClass} />
                </div>
                <div>
                  <span className="mb-1 block text-sm font-medium text-neutral-700">Charges mensuelles (FCFA)</span>
                  <input
                    type="number"
                    min={0}
                    name="chargesMensuelles"
                    defaultValue={property.chargesMensuelles ?? ""}
                    className={inputClass}
                  />
                </div>
                <div>
                  <span className="mb-1 block text-sm font-medium text-neutral-700">Commission PHANY (%)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    name="commissionPct"
                    defaultValue={property.commissionPct}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            {latestChecklist ? (
              <Checklist checklist={latestChecklist} propertyId={property.id} />
            ) : (
              <p className="text-sm text-neutral-400">Aucune checklist de ménage pour ce bien.</p>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <IncidentsPanel propertyId={property.id} incidents={property.incidents} prestataires={prestataires} />
          </div>
        </div>

        {isCrm && (
          <div className="space-y-6">
            <Calculateur
              loyerEstime={property.loyerEstime}
              chargesMensuelles={property.chargesMensuelles}
              commissionPct={property.commissionPct}
            />
          </div>
        )}
      </div>
    </div>
  );
}
