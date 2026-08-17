import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProspect } from "@/lib/actions/prospects";
import { ProspectForm } from "@/components/ProspectForm";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function NewProspectPage() {
  await requireRole(CRM_ROLES);
  const apporteurs = await prisma.apporteur.findMany({ orderBy: { nom: "asc" } });

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <Link href="/prospects" className="text-sm text-neutral-500 hover:underline">
        ← Retour aux prospects
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold text-neutral-900">Nouveau prospect</h1>
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <ProspectForm action={createProspect} apporteurs={apporteurs} submitLabel="Créer le prospect" />
      </div>
    </div>
  );
}
