import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { createTeamMember } from "@/lib/actions/users";
import { RoleBadge } from "@/components/StatusBadge";
import { ROLE_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

export default async function EquipePage() {
  const currentUser = await requireUser();
  const members = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Équipe PHANY</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Comptes de l&apos;équipe. Chaque membre se connecte avec son propre email et mot de passe.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div>
                <p className="font-medium text-neutral-900">
                  {m.name} {m.id === currentUser.id && <span className="text-xs text-neutral-400">(vous)</span>}
                </p>
                <p className="text-sm text-neutral-500">{m.email}</p>
                <p className="text-xs text-neutral-400">Membre depuis le {fmtDate(m.createdAt)}</p>
              </div>
              <RoleBadge role={m.role} />
            </div>
          ))}
        </div>

        {currentUser.role === "FONDATEUR" ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">Ajouter un membre</h2>
            <form action={createTeamMember} className="space-y-3">
              <input name="name" placeholder="Nom complet *" required className={inputClass} />
              <input type="email" name="email" placeholder="Email *" required className={inputClass} />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe (8 caractères min.) *"
                required
                minLength={8}
                className={inputClass}
              />
              <select name="role" defaultValue="RESPONSABLE_OPERATIONS" className={inputClass}>
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
              >
                Créer le compte
              </button>
            </form>
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-500">
            Seul le fondateur peut ajouter de nouveaux membres à l&apos;équipe.
          </div>
        )}
      </div>
    </div>
  );
}
