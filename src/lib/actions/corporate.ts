"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { ContratStatut, SejourStatut } from "@/generated/prisma/client";
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

export async function createContrat(formData: FormData) {
  await requireRole(CRM_ROLES);
  const entreprise = str(formData, "entreprise");
  if (!entreprise) throw new Error("Le nom de l'entreprise est obligatoire.");

  const prospectId = str(formData, "prospectId");

  const contrat = await prisma.contratCorporate.create({
    data: {
      entreprise,
      contactNom: str(formData, "contactNom"),
      contactTelephone: str(formData, "contactTelephone"),
      contactEmail: str(formData, "contactEmail"),
      tarifNuitee: num(formData, "tarifNuitee"),
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

  revalidatePath("/corporate");
  revalidatePath("/prospects");
  revalidatePath("/");
  redirect(`/corporate/${contrat.id}`);
}

export async function updateContrat(contratId: string, formData: FormData) {
  await requireRole(CRM_ROLES);
  await prisma.contratCorporate.update({
    where: { id: contratId },
    data: {
      entreprise: str(formData, "entreprise") ?? undefined,
      contactNom: str(formData, "contactNom"),
      contactTelephone: str(formData, "contactTelephone"),
      contactEmail: str(formData, "contactEmail"),
      statut: (str(formData, "statut") as ContratStatut) ?? "ACTIF",
      tarifNuitee: num(formData, "tarifNuitee"),
      dateFin: dateOrNull(formData, "dateFin"),
      notes: str(formData, "notes"),
    },
  });

  revalidatePath(`/corporate/${contratId}`);
  revalidatePath("/corporate");
}

export async function createSejour(contratId: string, formData: FormData) {
  await requireRole(CRM_ROLES);
  const propertyId = str(formData, "propertyId");
  const collaborateurNom = str(formData, "collaborateurNom");
  const dateArrivee = dateOrNull(formData, "dateArrivee");
  if (!propertyId || !collaborateurNom || !dateArrivee) {
    throw new Error("Bien, collaborateur et date d'arrivée sont obligatoires.");
  }

  await prisma.sejourCorporate.create({
    data: {
      contratId,
      propertyId,
      collaborateurNom,
      dateArrivee,
      dateDepart: dateOrNull(formData, "dateDepart"),
      notes: str(formData, "notes"),
    },
  });

  revalidatePath(`/corporate/${contratId}`);
  revalidatePath("/");
}

export async function updateSejourStatut(sejourId: string, contratId: string, statut: SejourStatut) {
  await requireRole(CRM_ROLES);
  await prisma.sejourCorporate.update({
    where: { id: sejourId },
    data: { statut },
  });

  revalidatePath(`/corporate/${contratId}`);
  revalidatePath("/");
}
