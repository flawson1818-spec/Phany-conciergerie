"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { IncidentStatut } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

export async function createIncident(propertyId: string, formData: FormData) {
  await requireUser();
  const description = str(formData, "description");
  if (!description) throw new Error("La description est obligatoire.");

  await prisma.incident.create({
    data: {
      propertyId,
      description,
      photoUrl: str(formData, "photoUrl"),
      prestataireId: str(formData, "prestataireId"),
      statut: str(formData, "prestataireId") ? "ASSIGNE" : "SIGNALE",
    },
  });

  revalidatePath(`/biens/${propertyId}`);
  revalidatePath("/");
}

export async function updateIncident(incidentId: string, propertyId: string, formData: FormData) {
  await requireUser();
  const statut = (str(formData, "statut") as IncidentStatut) ?? "SIGNALE";
  const prestataireId = str(formData, "prestataireId");
  const noteResolution = str(formData, "noteResolution");
  const photoUrl = str(formData, "photoUrl");

  await prisma.incident.update({
    where: { id: incidentId },
    data: {
      statut,
      prestataireId,
      noteResolution,
      photoUrl,
      resoluLe: statut === "RESOLU" ? new Date() : null,
    },
  });

  revalidatePath(`/biens/${propertyId}`);
  revalidatePath("/");
}
