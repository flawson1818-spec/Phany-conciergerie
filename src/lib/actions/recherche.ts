"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";
import type {
  AnnonceStatut,
  DemandeStatut,
  SourceAnnonce,
  StatutPaiementVisite,
  TypeDemande,
} from "@/generated/prisma/client";

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

export async function createDemande(formData: FormData) {
  await requireRole(CRM_ROLES);
  const nomClient = str(formData, "nomClient");
  if (!nomClient) throw new Error("Le nom du client est obligatoire.");

  const demande = await prisma.demandeRecherche.create({
    data: {
      nomClient,
      telephoneClient: str(formData, "telephoneClient"),
      typeDemande: (str(formData, "typeDemande") as TypeDemande) ?? "LOCATION",
      typeBien: str(formData, "typeBien"),
      quartierSouhaite: str(formData, "quartierSouhaite"),
      budgetMin: num(formData, "budgetMin"),
      budgetMax: num(formData, "budgetMax"),
      nbChambres: num(formData, "nbChambres"),
      notes: str(formData, "notes"),
    },
  });

  revalidatePath("/recherche");
  revalidatePath("/");
  redirect(`/recherche/${demande.id}`);
}

export async function updateDemandeStatut(demandeId: string, statut: DemandeStatut) {
  await requireRole(CRM_ROLES);
  await prisma.demandeRecherche.update({
    where: { id: demandeId },
    data: { statut },
  });
  revalidatePath("/recherche");
  revalidatePath(`/recherche/${demandeId}`);
  revalidatePath("/");
}

export async function createAnnonce(formData: FormData) {
  await requireRole(CRM_ROLES);
  const titre = str(formData, "titre");
  if (!titre) throw new Error("Le titre de l'annonce est obligatoire.");

  await prisma.annonceExterne.create({
    data: {
      titre,
      source: (str(formData, "source") as SourceAnnonce) ?? "AUTRE",
      lienOuContact: str(formData, "lienOuContact"),
      typeBien: str(formData, "typeBien"),
      quartier: str(formData, "quartier"),
      prix: num(formData, "prix"),
      description: str(formData, "description"),
      notes: str(formData, "notes"),
    },
  });

  revalidatePath("/recherche/annonces");
}

export async function updateAnnonceStatut(annonceId: string, statut: AnnonceStatut) {
  await requireRole(CRM_ROLES);
  await prisma.annonceExterne.update({
    where: { id: annonceId },
    data: { statut },
  });
  revalidatePath("/recherche/annonces");
}

export async function createProposition(demandeId: string, formData: FormData) {
  await requireRole(CRM_ROLES);
  const propertyId = str(formData, "propertyId");
  const annonceExterneId = str(formData, "annonceExterneId");

  if (!propertyId && !annonceExterneId) {
    throw new Error("Choisissez un bien PHANY ou une annonce externe à proposer.");
  }

  await prisma.proposition.create({
    data: {
      demandeId,
      propertyId,
      annonceExterneId,
      fraisVisite: num(formData, "fraisVisite"),
    },
  });

  if (annonceExterneId) {
    await prisma.annonceExterne.update({
      where: { id: annonceExterneId },
      data: { statut: "PROPOSEE" },
    });
  }

  await prisma.demandeRecherche.update({
    where: { id: demandeId },
    data: { statut: "PROPOSITION_ENVOYEE" },
  });

  revalidatePath(`/recherche/${demandeId}`);
  revalidatePath("/recherche");
  revalidatePath("/recherche/annonces");
}

export async function updateProposition(propositionId: string, demandeId: string, formData: FormData) {
  await requireRole(CRM_ROLES);
  await prisma.proposition.update({
    where: { id: propositionId },
    data: {
      fraisVisite: num(formData, "fraisVisite"),
      statutPaiement: (str(formData, "statutPaiement") as StatutPaiementVisite) ?? "EN_ATTENTE",
      dateVisite: dateOrNull(formData, "dateVisite"),
      resultatVisite: str(formData, "resultatVisite"),
    },
  });

  revalidatePath(`/recherche/${demandeId}`);
}
