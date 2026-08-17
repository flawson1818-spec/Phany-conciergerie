import {
  ACTIF_STATUT_LABELS,
  BIEN_STATUT_LABELS,
  CONTRAT_STATUT_LABELS,
  INCIDENT_STATUT_LABELS,
  MANDAT_ASSET_STATUT_LABELS,
  POTENTIEL_LABELS,
  PROSPECT_STATUT_LABELS,
  ROLE_LABELS,
  SEJOUR_STATUT_LABELS,
} from "@/lib/constants";
import type {
  ActifStatut,
  BienStatut,
  ContratStatut,
  IncidentStatut,
  MandatAssetStatut,
  Potentiel,
  ProspectStatut,
  Role,
  SejourStatut,
} from "@/generated/prisma/client";

const PROSPECT_STATUT_COLORS: Record<ProspectStatut, string> = {
  NOUVEAU: "bg-neutral-100 text-neutral-700",
  CONTACTE: "bg-blue-100 text-blue-700",
  REPONDU: "bg-sky-100 text-sky-700",
  RENDEZ_VOUS: "bg-indigo-100 text-indigo-700",
  VISITE: "bg-purple-100 text-purple-700",
  PROPOSITION: "bg-fuchsia-100 text-fuchsia-700",
  NEGOCIATION: "bg-orange-100 text-orange-700",
  MANDAT_SIGNE: "bg-emerald-100 text-emerald-700",
  BIEN_ACTIF: "bg-green-100 text-green-800",
  PERDU: "bg-red-100 text-red-700",
};

const POTENTIEL_COLORS: Record<Potentiel, string> = {
  FAIBLE: "bg-neutral-100 text-neutral-600",
  MOYEN: "bg-amber-100 text-amber-700",
  ELEVE: "bg-orange-100 text-orange-700",
  PRIORITAIRE: "bg-red-100 text-red-700",
};

const BIEN_STATUT_COLORS: Record<BienStatut, string> = {
  EN_PREPARATION: "bg-amber-100 text-amber-700",
  PRET: "bg-emerald-100 text-emerald-700",
  ACTIF: "bg-green-100 text-green-800",
  INACTIF: "bg-neutral-100 text-neutral-600",
};

const INCIDENT_STATUT_COLORS: Record<IncidentStatut, string> = {
  SIGNALE: "bg-red-100 text-red-700",
  ASSIGNE: "bg-amber-100 text-amber-700",
  EN_COURS: "bg-blue-100 text-blue-700",
  RESOLU: "bg-emerald-100 text-emerald-700",
};

const CONTRAT_STATUT_COLORS: Record<ContratStatut, string> = {
  ACTIF: "bg-emerald-100 text-emerald-700",
  INACTIF: "bg-neutral-100 text-neutral-600",
  EXPIRE: "bg-red-100 text-red-700",
};

const SEJOUR_STATUT_COLORS: Record<SejourStatut, string> = {
  PLANIFIE: "bg-amber-100 text-amber-700",
  EN_COURS: "bg-blue-100 text-blue-700",
  TERMINE: "bg-emerald-100 text-emerald-700",
  ANNULE: "bg-neutral-100 text-neutral-600",
};

const MANDAT_ASSET_STATUT_COLORS: Record<MandatAssetStatut, string> = {
  ACTIF: "bg-emerald-100 text-emerald-700",
  INACTIF: "bg-neutral-100 text-neutral-600",
  TERMINE: "bg-neutral-100 text-neutral-600",
};

const ACTIF_STATUT_COLORS: Record<ActifStatut, string> = {
  A_EVALUER: "bg-neutral-100 text-neutral-600",
  EN_REMISE_EN_ETAT: "bg-amber-100 text-amber-700",
  PRET: "bg-blue-100 text-blue-700",
  EN_EXPLOITATION: "bg-emerald-100 text-emerald-700",
  CEDE: "bg-neutral-100 text-neutral-500",
};

const ROLE_COLORS: Record<Role, string> = {
  FONDATEUR: "bg-amber-100 text-amber-800",
  RESPONSABLE_OPERATIONS: "bg-blue-100 text-blue-700",
  MENAGE: "bg-emerald-100 text-emerald-700",
  MAINTENANCE: "bg-orange-100 text-orange-700",
};

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

export function ProspectStatutBadge({ statut }: { statut: ProspectStatut }) {
  return <Badge className={PROSPECT_STATUT_COLORS[statut]}>{PROSPECT_STATUT_LABELS[statut]}</Badge>;
}

export function PotentielBadge({ potentiel }: { potentiel: Potentiel }) {
  return <Badge className={POTENTIEL_COLORS[potentiel]}>{POTENTIEL_LABELS[potentiel]}</Badge>;
}

export function BienStatutBadge({ statut }: { statut: BienStatut }) {
  return <Badge className={BIEN_STATUT_COLORS[statut]}>{BIEN_STATUT_LABELS[statut]}</Badge>;
}

export function IncidentStatutBadge({ statut }: { statut: IncidentStatut }) {
  return <Badge className={INCIDENT_STATUT_COLORS[statut]}>{INCIDENT_STATUT_LABELS[statut]}</Badge>;
}

export function ContratStatutBadge({ statut }: { statut: ContratStatut }) {
  return <Badge className={CONTRAT_STATUT_COLORS[statut]}>{CONTRAT_STATUT_LABELS[statut]}</Badge>;
}

export function SejourStatutBadge({ statut }: { statut: SejourStatut }) {
  return <Badge className={SEJOUR_STATUT_COLORS[statut]}>{SEJOUR_STATUT_LABELS[statut]}</Badge>;
}

export function MandatAssetStatutBadge({ statut }: { statut: MandatAssetStatut }) {
  return <Badge className={MANDAT_ASSET_STATUT_COLORS[statut]}>{MANDAT_ASSET_STATUT_LABELS[statut]}</Badge>;
}

export function ActifStatutBadge({ statut }: { statut: ActifStatut }) {
  return <Badge className={ACTIF_STATUT_COLORS[statut]}>{ACTIF_STATUT_LABELS[statut]}</Badge>;
}

export function RoleBadge({ role }: { role: Role }) {
  return <Badge className={ROLE_COLORS[role]}>{ROLE_LABELS[role]}</Badge>;
}
