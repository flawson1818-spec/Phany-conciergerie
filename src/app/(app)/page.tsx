import Link from "next/link";
import { getDashboardData } from "@/lib/queries";
import {
  DAILY_GOAL_NEW_PROSPECTS,
  DAILY_GOAL_RELANCES,
  PROSPECT_STATUT_LABELS,
  PROSPECT_STATUT_ORDER,
} from "@/lib/constants";
import { ActifStatutBadge, BienStatutBadge, IncidentStatutBadge, PotentielBadge, ProspectStatutBadge } from "@/components/StatusBadge";
import { requireUser } from "@/lib/auth";
import { CRM_ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

function GoalCard({
  label,
  value,
  goal,
  hint,
}: {
  label: string;
  value: number;
  goal: number;
  hint: string;
}) {
  const pct = Math.min(100, Math.round((value / goal) * 100));
  const reached = value >= goal;
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-neutral-900">
        {value}
        <span className="text-base font-normal text-neutral-400"> / {goal}</span>
      </p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full ${reached ? "bg-emerald-500" : "bg-amber-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-neutral-400">{hint}</p>
    </div>
  );
}

function fmtDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(d);
}

export default async function DashboardPage() {
  const user = await requireUser();
  const isCrm = CRM_ROLES.includes(user.role);
  const {
    newProspectsToday,
    interactionsToday,
    relancesDues,
    pipelineCounts,
    prioritaires,
    properties,
    incidentsOuverts,
    sejoursEnCours,
    actifsEnRemiseEnEtat,
  } = await getDashboardData();

  const totalActifs = Object.entries(pipelineCounts)
    .filter(([statut]) => statut !== "PERDU")
    .reduce((sum, [, count]) => sum + count, 0);

  if (!isCrm) {
    return (
      <div className="mx-auto max-w-4xl px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">Tableau de bord</h1>
          <p className="text-sm text-neutral-500">Vue opérationnelle — biens et maintenance.</p>
        </div>

        <div className="mb-8">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-neutral-500">Incidents ouverts</p>
            <p className={`mt-1 text-3xl font-semibold ${incidentsOuverts.length > 0 ? "text-red-600" : "text-neutral-900"}`}>
              {incidentsOuverts.length}
            </p>
            <p className="mt-3 text-xs text-neutral-400">Maintenance en attente ou en cours sur les biens</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">🔧 Maintenance en cours</h2>
            {incidentsOuverts.length === 0 ? (
              <p className="text-sm text-neutral-400">Aucun incident ouvert. Bon travail.</p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {incidentsOuverts.slice(0, 8).map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div>
                      <Link href={`/biens/${i.propertyId}`} className="text-sm font-medium text-neutral-900 hover:underline">
                        {i.property.nom}
                      </Link>
                      <p className="text-xs text-neutral-400">
                        {i.description.length > 40 ? `${i.description.slice(0, 40)}…` : i.description}
                        {i.prestataire ? ` · ${i.prestataire.nom}` : ""}
                      </p>
                    </div>
                    <IncidentStatutBadge statut={i.statut} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">🏠 Biens récents</h2>
            {properties.length === 0 ? (
              <p className="text-sm text-neutral-400">Aucun bien enregistré pour le moment.</p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {properties.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                    <Link href={`/biens/${p.id}`} className="text-sm font-medium text-neutral-900 hover:underline">
                      {p.nom}
                    </Link>
                    <BienStatutBadge statut={p.statut} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Tableau de bord</h1>
          <p className="text-sm text-neutral-500">Méthode 10×5 — objectif du jour : 10 nouveaux prospects, 5 relances, 1 rendez-vous.</p>
        </div>
        <Link
          href="/prospects/new"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
        >
          + Nouveau prospect
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <GoalCard
          label="Nouveaux prospects aujourd'hui"
          value={newProspectsToday}
          goal={DAILY_GOAL_NEW_PROSPECTS}
          hint="Propriétaires ou partenaires identifiés aujourd'hui"
        />
        <GoalCard
          label="Relances effectuées aujourd'hui"
          value={interactionsToday}
          goal={DAILY_GOAL_RELANCES}
          hint="Contacts loggés aujourd'hui (nouveaux + relances)"
        />
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Pipeline actif</p>
          <p className="mt-1 text-3xl font-semibold text-neutral-900">{totalActifs}</p>
          <p className="mt-3 text-xs text-neutral-400">
            {properties.length} bien(s) enregistré(s) au total
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Incidents ouverts</p>
          <p className={`mt-1 text-3xl font-semibold ${incidentsOuverts.length > 0 ? "text-red-600" : "text-neutral-900"}`}>
            {incidentsOuverts.length}
          </p>
          <p className="mt-3 text-xs text-neutral-400">Maintenance en attente ou en cours sur les biens actifs</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Séjours corporate</p>
          <p className="mt-1 text-3xl font-semibold text-neutral-900">{sejoursEnCours.length}</p>
          <p className="mt-3 text-xs text-neutral-400">Collaborateurs planifiés ou actuellement en séjour</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Actifs en remise en état</p>
          <p className="mt-1 text-3xl font-semibold text-neutral-900">{actifsEnRemiseEnEtat.length}</p>
          <p className="mt-3 text-xs text-neutral-400">Portefeuille banques/institutions à évaluer ou en travaux</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900">
            Relances à faire ({relancesDues.length})
          </h2>
          {relancesDues.length === 0 ? (
            <p className="text-sm text-neutral-400">Aucune relance en attente. Bon travail.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {relancesDues.slice(0, 8).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <Link href={`/prospects/${p.id}`} className="text-sm font-medium text-neutral-900 hover:underline">
                      {p.nom}
                    </Link>
                    <p className="text-xs text-neutral-400">
                      Relance prévue le {fmtDate(p.prochaineRelance)} · {p.quartier ?? "quartier ?"}
                    </p>
                  </div>
                  <ProspectStatutBadge statut={p.statut} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900">🔥 Prospects prioritaires</h2>
          {prioritaires.length === 0 ? (
            <p className="text-sm text-neutral-400">Aucun prospect prioritaire pour le moment.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {prioritaires.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <Link href={`/prospects/${p.id}`} className="text-sm font-medium text-neutral-900 hover:underline">
                      {p.nom}
                    </Link>
                    <p className="text-xs text-neutral-400">{p.quartier ?? "—"} · {p.typeBien ?? "—"}</p>
                  </div>
                  <PotentielBadge potentiel={p.potentiel} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900">🔧 Maintenance en cours</h2>
          {incidentsOuverts.length === 0 ? (
            <p className="text-sm text-neutral-400">Aucun incident ouvert. Bon travail.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {incidentsOuverts.slice(0, 8).map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <Link href={`/biens/${i.propertyId}`} className="text-sm font-medium text-neutral-900 hover:underline">
                      {i.property.nom}
                    </Link>
                    <p className="text-xs text-neutral-400">
                      {i.description.length > 40 ? `${i.description.slice(0, 40)}…` : i.description}
                      {i.prestataire ? ` · ${i.prestataire.nom}` : ""}
                    </p>
                  </div>
                  <IncidentStatutBadge statut={i.statut} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900">💼 Séjours corporate</h2>
          {sejoursEnCours.length === 0 ? (
            <p className="text-sm text-neutral-400">Aucun séjour corporate planifié.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {sejoursEnCours.slice(0, 8).map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <Link href={`/corporate/${s.contratId}`} className="text-sm font-medium text-neutral-900 hover:underline">
                      {s.collaborateurNom}
                    </Link>
                    <p className="text-xs text-neutral-400">
                      {s.contrat.entreprise} · {s.property.nom}
                    </p>
                  </div>
                  <span className="text-[11px] text-neutral-400">{fmtDate(s.dateArrivee)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900">🏦 Portefeuille Asset Services</h2>
          {actifsEnRemiseEnEtat.length === 0 ? (
            <p className="text-sm text-neutral-400">Aucun actif à évaluer ou en remise en état.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {actifsEnRemiseEnEtat.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <Link href={`/asset-services/${a.mandatId}`} className="text-sm font-medium text-neutral-900 hover:underline">
                      {a.nom}
                    </Link>
                    <p className="text-xs text-neutral-400">{a.mandat.institution}</p>
                  </div>
                  <ActifStatutBadge statut={a.statut} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-neutral-900">Entonnoir de prospection</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {PROSPECT_STATUT_ORDER.map((statut) => (
            <div key={statut} className="rounded-lg bg-neutral-50 p-3 text-center">
              <p className="text-xl font-semibold text-neutral-900">{pipelineCounts[statut] ?? 0}</p>
              <p className="mt-1 text-[11px] leading-tight text-neutral-500">{PROSPECT_STATUT_LABELS[statut]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
