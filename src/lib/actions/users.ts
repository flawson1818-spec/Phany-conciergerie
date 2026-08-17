"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword, requireFondateur } from "@/lib/auth";
import type { Role } from "@/generated/prisma/client";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

export async function createTeamMember(formData: FormData) {
  await requireFondateur();

  const name = str(formData, "name");
  const email = str(formData, "email")?.toLowerCase() ?? null;
  const password = str(formData, "password");
  const role = (str(formData, "role") as Role) ?? "RESPONSABLE_OPERATIONS";

  if (!name || !email || !password) {
    throw new Error("Nom, email et mot de passe sont obligatoires.");
  }
  if (password.length < 8) {
    throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Un compte existe déjà avec cet email.");
  }

  await prisma.user.create({
    data: {
      name,
      email,
      role,
      passwordHash: await hashPassword(password),
    },
  });

  revalidatePath("/equipe");
}
