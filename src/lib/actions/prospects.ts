"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Potentiel, ProspectStatut, ProspectType } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

function dateOrNull(fd: FormData, key: string) {
  const v = str(fd, key);
  return v ? new Date(v) : null;
}

export async function createProspect(formData: FormData) {
  await requireRole(CRM_ROLES);
  const nom = str(formData, "nom");
  if (!nom) throw new Error("Le nom est obligatoire.");

  const prospect = await prisma.prospect.create({
    data: {
      nom,
      telephone: str(formData, "telephone"),
      type: (str(formData, "type") as ProspectType) ?? "PROPRIETAIRE_MEUBLE",
      source: str(formData, "source"),
      quartier: str(formData, "quartier"),
      typeBien: str(formData, "typeBien"),
      nbChambres: str(formData, "nbChambres") ? Number(str(formData, "nbChambres")) : null,
      meuble: formData.get("meuble") === "on",
      disponible: formData.get("disponible") === "on",
      potentiel: (str(formData, "potentiel") as Potentiel) ?? "MOYEN",
      notes: str(formData, "notes"),
      apporteurId: str(formData, "apporteurId"),
      prochaineRelance: dateOrNull(formData, "prochaineRelance"),
    },
  });

  revalidatePath("/prospects");
  revalidatePath("/");
  redirect(`/prospects/${prospect.id}`);
}

export async function updateProspectStatut(prospectId: string, statut: ProspectStatut) {
  await requireRole(CRM_ROLES);
  await prisma.prospect.update({
    where: { id: prospectId },
    data: { statut },
  });
  revalidatePath("/prospects");
  revalidatePath(`/prospects/${prospectId}`);
  revalidatePath("/");
}

export async function updateProspect(prospectId: string, formData: FormData) {
  await requireRole(CRM_ROLES);
  const nom = str(formData, "nom");
  if (!nom) throw new Error("Le nom est obligatoire.");

  await prisma.prospect.update({
    where: { id: prospectId },
    data: {
      nom,
      telephone: str(formData, "telephone"),
      type: (str(formData, "type") as ProspectType) ?? "PROPRIETAIRE_MEUBLE",
      source: str(formData, "source"),
      quartier: str(formData, "quartier"),
      typeBien: str(formData, "typeBien"),
      nbChambres: str(formData, "nbChambres") ? Number(str(formData, "nbChambres")) : null,
      meuble: formData.get("meuble") === "on",
      disponible: formData.get("disponible") === "on",
      statut: (str(formData, "statut") as ProspectStatut) ?? "NOUVEAU",
      potentiel: (str(formData, "potentiel") as Potentiel) ?? "MOYEN",
      notes: str(formData, "notes"),
    },
  });

  revalidatePath("/prospects");
  revalidatePath(`/prospects/${prospectId}`);
  revalidatePath("/");
  redirect(`/prospects/${prospectId}`);
}

export async function logInteraction(prospectId: string, formData: FormData) {
  await requireRole(CRM_ROLES);
  const type = str(formData, "type") ?? "Note";
  const note = str(formData, "note");
  const prochaineRelance = dateOrNull(formData, "prochaineRelance");
  const nextStatut = str(formData, "statut") as ProspectStatut | null;

  await prisma.interaction.create({
    data: {
      prospectId,
      type,
      note,
      prochaineRelance,
    },
  });

  await prisma.prospect.update({
    where: { id: prospectId },
    data: {
      dernierContact: new Date(),
      prochaineRelance,
      ...(nextStatut ? { statut: nextStatut } : {}),
    },
  });

  revalidatePath(`/prospects/${prospectId}`);
  revalidatePath("/prospects");
  revalidatePath("/");
}
