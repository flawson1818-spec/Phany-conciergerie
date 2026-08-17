import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProspect } from "@/lib/actions/prospects";
import { ProspectForm } from "@/components/ProspectForm";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

export default async function EditProspectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(CRM_ROLES);
  const { id } = await params;

  const [prospect, apporteurs] = await Promise.all([
    prisma.prospect.findUnique({ where: { id } }),
    prisma.apporteur.findMany({ orderBy: { nom: "asc" } }),
  ]);

  if (!prospect) notFound();

  const action = updateProspect.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <Link href={`/prospects/${id}`} className="text-sm text-neutral-500 hover:underline">
        ← Retour à la fiche
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold text-neutral-900">Modifier {prospect.nom}</h1>
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <ProspectForm
          action={action}
          prospect={prospect}
          apporteurs={apporteurs}
          includeStatut
          submitLabel="Enregistrer les modifications"
        />
      </div>
    </div>
  );
}
