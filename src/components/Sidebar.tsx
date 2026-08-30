"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import { CRM_ROLES, ROLE_LABELS } from "@/lib/constants";
import type { Role } from "@/generated/prisma/client";

const links = [
  { href: "/", label: "Tableau de bord", icon: "📊", crmOnly: false },
  { href: "/studio", label: "Studio IA", icon: "🎵", crmOnly: false },
  { href: "/prospects", label: "Prospects", icon: "🎯", crmOnly: true },
  { href: "/recherche", label: "Recherche", icon: "🔍", crmOnly: true },
  { href: "/biens", label: "Biens", icon: "🏠", crmOnly: false },
  { href: "/prestataires", label: "Prestataires", icon: "🔧", crmOnly: true },
  { href: "/corporate", label: "Corporate", icon: "💼", crmOnly: true },
  { href: "/asset-services", label: "Asset Services", icon: "🏦", crmOnly: true },
  { href: "/apporteurs", label: "Apporteurs", icon: "🤝", crmOnly: true },
  { href: "/equipe", label: "Équipe", icon: "👥", crmOnly: false },
];

export function Sidebar({ user }: { user: { name: string; role: Role } }) {
  const pathname = usePathname();
  const isCrm = CRM_ROLES.includes(user.role);
  const visibleLinks = links.filter((link) => !link.crmOnly || isCrm);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950 text-neutral-200">
      <div className="flex items-center gap-2 border-b border-neutral-800 px-6 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-lg font-bold text-neutral-950">
          P
        </span>
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">PHANY</p>
          <p className="text-xs text-neutral-400">Conciergerie · Lomé</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {visibleLinks.map((link) => {
          const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-800 px-6 py-3 text-xs text-neutral-500">
        Méthode 10×5 — un prospect sans prochaine action n&apos;existe pas.
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-neutral-800 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>
          <p className="truncate text-xs text-neutral-400">{ROLE_LABELS[user.role]}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="shrink-0 rounded-md border border-neutral-700 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-900"
          >
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
