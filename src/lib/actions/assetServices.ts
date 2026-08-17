"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CHECKLIST_TEMPLATE } from "@/lib/constants";
import type { ActifStatut, MandatAssetStatut } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

function num(fd: FormData, key: string) {
  const v = str(fd, key);
  return v ? Number(v) : null;
}

function dateOrNull(fd: FormData, key: string) {
  const v = str(fd, key);
  return v ? new Date(v) : null;
}

export async function createMandat(formData: FormData) {
  await requireRole(CRM_ROLES);
  const institution = str(formData, "institution");
  if (!institution) throw new Error("Le nom de l'institution est obligatoire.");

  const prospectId = str(formData, "prospectId");

  const mandat = await prisma.mandatAssetServices.create({
    data: {
      institution,
      contactNom: str(formData, "contactNom"),
      contactTelephone: str(formData, "contactTelephone"),
      contactEmail: str(formData, "contactEmail"),
      honorairesPct: num(formData, "honorairesPct"),
      dateFin: dateOrNull(formData, "dateFin"),
      notes: str(formData, "notes"),
      prospectId,
    },
  });

  if (prospectId) {
    await prisma.prospect.update({
      where: { id: prospectId },
      data: { statut: "MANDAT_SIGNE" },
    });
  }

  revalidatePath("/asset-services");
  revalidatePath("/prospects");
  revalidatePath("/");
  redirect(`/asset-services/${mandat.id}`);
}

export async function updateMandat(mandatId: string, formData: FormData) {
  await requireRole(CRM_ROLES);
  await prisma.mandatAssetServices.update({
    where: { id: mandatId },
    data: {
      institution: str(formData, "institution") ?? undefined,
      contactNom: str(formData, "contactNom"),
      contactTelephone: str(formData, "contactTelephone"),
      contactEmail: str(formData, "contactEmail"),
      statut: (str(formData, "statut") as MandatAssetStatut) ?? "ACTIF",
      honorairesPct: num(formData, "honorairesPct"),
      dateFin: dateOrNull(formData, "dateFin"),
      notes: str(formData, "notes"),
    },
  });

  revalidatePath(`/asset-services/${mandatId}`);
  revalidatePath("/asset-services");
}

export async function createActif(mandatId: string, formData: FormData) {
  await requireRole(CRM_ROLES);
  const nom = str(formData, "nom");
  if (!nom) throw new Error("Le nom de l'actif est obligatoire.");

  await prisma.actifBancaire.create({
    data: {
      mandatId,
      nom,
      adresse: str(formData, "adresse"),
      quartier: str(formData, "quartier"),
      typeBien: str(formData, "typeBien"),
      nbChambres: num(formData, "nbChambres"),
      valeurEstimee: num(formData, "valeurEstimee"),
      budgetRemiseEnEtat: num(formData, "budgetRemiseEnEtat"),
      notes: str(formData, "notes"),
    },
  });

  revalidatePath(`/asset-services/${mandatId}`);
  revalidatePath("/");
}

export async function updateActif(actifId: string, mandatId: string, formData: FormData) {
  await requireRole(CRM_ROLES);
  await prisma.actifBancaire.update({
    where: { id: actifId },
    data: {
      statut: (str(formData, "statut") as ActifStatut) ?? "A_EVALUER",
      valeurEstimee: num(formData, "valeurEstimee"),
      budgetRemiseEnEtat: num(formData, "budgetRemiseEnEtat"),
      coutRemiseEnEtatReel: num(formData, "coutRemiseEnEtatReel"),
      notes: str(formData, "notes"),
    },
  });

  revalidatePath(`/asset-services/${mandatId}`);
  revalidatePath("/");
}

export async function convertActifToProperty(actifId: string, mandatId: string, formData: FormData) {
  await requireRole(CRM_ROLES);
  const actif = await prisma.actifBancaire.findUniqueOrThrow({ where: { id: actifId } });

  const property = await prisma.property.create({
    data: {
      nom: actif.nom,
      adresse: actif.adresse,
      quartier: actif.quartier,
      typeBien: actif.typeBien,
      nbChambres: actif.nbChambres,
      loyerEstime: num(formData, "loyerEstime"),
      chargesMensuelles: num(formData, "chargesMensuelles"),
      commissionPct: num(formData, "commissionPct") ?? 20,
      mandatDateSignature: new Date(),
    },
  });

  await prisma.checklistMenage.create({
    data: {
      propertyId: property.id,
      items: JSON.stringify(CHECKLIST_TEMPLATE),
      statut: "EN_COURS",
    },
  });

  await prisma.actifBancaire.update({
    where: { id: actifId },
    data: { statut: "EN_EXPLOITATION", propertyId: property.id },
  });

  revalidatePath(`/asset-services/${mandatId}`);
  revalidatePath("/biens");
  revalidatePath("/");
  redirect(`/biens/${property.id}`);
}
