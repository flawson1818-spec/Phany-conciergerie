"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

export async function createApporteur(formData: FormData) {
  await requireRole(CRM_ROLES);
  const nom = str(formData, "nom");
  if (!nom) throw new Error("Le nom est obligatoire.");

  await prisma.apporteur.create({
    data: {
      nom,
      telephone: str(formData, "telephone"),
      structure: str(formData, "structure"),
      commissionPct: str(formData, "commissionPct") ? Number(str(formData, "commissionPct")) : null,
      notes: str(formData, "notes"),
    },
  });

  revalidatePath("/apporteurs");
}
