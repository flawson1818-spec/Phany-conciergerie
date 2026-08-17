import { CHECKLIST_SECTIONS, type ChecklistItem } from "@/lib/constants";
import { ChecklistItemToggle } from "@/components/ChecklistItemToggle";
import { startNewChecklist } from "@/lib/actions/checklist";
import type { ChecklistMenage } from "@/generated/prisma/client";

export function Checklist({ checklist, propertyId }: { checklist: ChecklistMenage; propertyId: string }) {
  const items = JSON.parse(checklist.items) as ChecklistItem[];
  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);
  const action = startNewChecklist.bind(null, propertyId);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-900">Standard de nettoyage PHANY</p>
          <p className="text-xs text-neutral-400">
            {doneCount} / {items.length} points contrôlés
            {checklist.statut === "TERMINE" ? " · Logement PRÊT ✅" : ""}
          </p>
        </div>
        {checklist.statut === "TERMINE" && (
          <form action={action}>
            <button
              type="submit"
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Démarrer un nouveau ménage
            </button>
          </form>
        )}
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full ${checklist.statut === "TERMINE" ? "bg-emerald-500" : "bg-amber-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CHECKLIST_SECTIONS.map((section) => (
          <div key={section} className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">{section}</p>
            {items
              .map((item, index) => ({ item, index }))
              .filter(({ item }) => item.section === section)
              .map(({ item, index }) => (
                <ChecklistItemToggle
                  key={index}
                  checklistId={checklist.id}
                  propertyId={propertyId}
                  index={index}
                  label={item.label}
                  done={item.done}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
