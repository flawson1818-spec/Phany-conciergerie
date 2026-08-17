"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CHECKLIST_TEMPLATE, type ChecklistItem } from "@/lib/constants";
import { requireUser } from "@/lib/auth";

export async function toggleChecklistItem(
  checklistId: string,
  propertyId: string,
  itemIndex: number,
) {
  await requireUser();
  const checklist = await prisma.checklistMenage.findUniqueOrThrow({
    where: { id: checklistId },
  });

  const items = JSON.parse(checklist.items) as ChecklistItem[];
  if (!items[itemIndex]) return;
  items[itemIndex] = { ...items[itemIndex], done: !items[itemIndex].done };

  const allDone = items.every((item) => item.done);

  await prisma.checklistMenage.update({
    where: { id: checklistId },
    data: {
      items: JSON.stringify(items),
      statut: allDone ? "TERMINE" : "EN_COURS",
    },
  });

  if (allDone) {
    await prisma.property.update({
      where: { id: propertyId },
      data: { statut: "PRET" },
    });
  }

  revalidatePath(`/biens/${propertyId}`);
}

export async function startNewChecklist(propertyId: string) {
  await requireUser();
  await prisma.checklistMenage.create({
    data: {
      propertyId,
      items: JSON.stringify(CHECKLIST_TEMPLATE),
      statut: "EN_COURS",
    },
  });

  await prisma.property.update({
    where: { id: propertyId },
    data: { statut: "EN_PREPARATION" },
  });

  revalidatePath(`/biens/${propertyId}`);
}

export async function setChecklistAssignee(checklistId: string, propertyId: string, formData: FormData) {
  await requireUser();
  const completedBy = formData.get("completedBy");
  await prisma.checklistMenage.update({
    where: { id: checklistId },
    data: { completedBy: typeof completedBy === "string" ? completedBy : null },
  });
  revalidatePath(`/biens/${propertyId}`);
}
