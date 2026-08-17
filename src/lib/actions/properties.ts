"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CHECKLIST_TEMPLATE, CRM_ROLES } from "@/lib/constants";
import type { BienStatut } from "@/generated/prisma/client";
import { requireRole, requireUser } from "@/lib/auth";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

function num(fd: FormData, key: string) {
  const v = str(fd, key);
  return v ? Number(v) : null;
}

export async function createProperty(formData: FormData) {
  await requireRole(CRM_ROLES);
  const nom = str(formData, "nom");
  if (!nom) throw new Error("Le nom du bien est obligatoire.");

  const prospectId = str(formData, "prospectId");

  const property = await prisma.property.create({
    data: {
      nom,
      adresse: str(formData, "adresse"),
      quartier: str(formData, "quartier"),
      typeBien: str(formData, "typeBien"),
      nbChambres: num(formData, "nbChambres"),
      loyerEstime: num(formData, "loyerEstime"),
      chargesMensuelles: num(formData, "chargesMensuelles"),
      commissionPct: num(formData, "commissionPct") ?? 20,
      mandatDateSignature: new Date(),
      prospectId,
    },
  });

  if (prospectId) {
    await prisma.prospect.update({
      where: { id: prospectId },
      data: { statut: "MANDAT_SIGNE" },
    });
  }

  await prisma.checklistMenage.create({
    data: {
      propertyId: property.id,
      items: JSON.stringify(CHECKLIST_TEMPLATE),
      statut: "EN_COURS",
    },
  });

  revalidatePath("/biens");
  revalidatePath("/prospects");
  revalidatePath("/");
  redirect(`/biens/${property.id}`);
}

export async function updatePropertyFinancials(propertyId: string, formData: FormData) {
  await requireRole(CRM_ROLES);
  await prisma.property.update({
    where: { id: propertyId },
    data: {
      nom: str(formData, "nom") ?? undefined,
      adresse: str(formData, "adresse"),
      quartier: str(formData, "quartier"),
      typeBien: str(formData, "typeBien"),
      nbChambres: num(formData, "nbChambres"),
      loyerEstime: num(formData, "loyerEstime"),
      chargesMensuelles: num(formData, "chargesMensuelles"),
      commissionPct: num(formData, "commissionPct") ?? 20,
    },
  });

  revalidatePath(`/biens/${propertyId}`);
  revalidatePath("/biens");
}

export async function updatePropertyStatut(propertyId: string, statut: BienStatut) {
  await requireUser();
  await prisma.property.update({
    where: { id: propertyId },
    data: { statut },
  });
  revalidatePath(`/biens/${propertyId}`);
  revalidatePath("/biens");
  revalidatePath("/");
}
