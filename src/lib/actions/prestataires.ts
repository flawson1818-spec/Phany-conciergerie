"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Metier } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

export async function createPrestataire(formData: FormData) {
  await requireRole(CRM_ROLES);
  const nom = str(formData, "nom");
  if (!nom) throw new Error("Le nom est obligatoire.");

  await prisma.prestataire.create({
    data: {
      nom,
      metier: (str(formData, "metier") as Metier) ?? "AUTRE",
      telephone: str(formData, "telephone"),
      zone: str(formData, "zone"),
      notes: str(formData, "notes"),
    },
  });

  revalidatePath("/prestataires");
}
