"use client";

import { useTransition } from "react";
import { toggleChecklistItem } from "@/lib/actions/checklist";

export function ChecklistItemToggle({
  checklistId,
  propertyId,
  index,
  label,
  done,
}: {
  checklistId: string;
  propertyId: string;
  index: number;
  label: string;
  done: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 py-1 text-sm text-neutral-700">
      <input
        type="checkbox"
        checked={done}
        disabled={isPending}
        onChange={() => startTransition(() => toggleChecklistItem(checklistId, propertyId, index))}
        className="h-4 w-4 rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
      />
      <span className={done ? "text-neutral-400 line-through" : ""}>{label}</span>
    </label>
  );
}
