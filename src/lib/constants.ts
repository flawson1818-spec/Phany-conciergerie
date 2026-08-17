import type {
  ActifStatut,
  BienStatut,
  ContratStatut,
  IncidentStatut,
  MandatAssetStatut,
  Metier,
  Potentiel,
  ProspectStatut,
  ProspectType,
  Role,
  SejourStatut,
} from "@/generated/prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  FONDATEUR: "Fondateur / Directeur",
  RESPONSABLE_OPERATIONS: "Responsable opérations",
  MENAGE: "Équipe ménage",
  MAINTENANCE: "Maintenance",
};

// Rôles qui pilotent la prospection, les contrats et les finances (CRM + argent).
export const CRM_ROLES: Role[] = ["FONDATEUR", "RESPONSABLE_OPERATIONS"];

// Rôles de terrain : ménage et maintenance, sans accès CRM/finances.
export const FIELD_ROLES: Role[] = ["MENAGE", "MAINTENANCE"];

export const PROSPECT_STATUT_ORDER: ProspectStatut[] = [
  "NOUVEAU",
  "CONTACTE",
  "REPONDU",
  "RENDEZ_VOUS",
  "VISITE",
  "PROPOSITION",
  "NEGOCIATION",
  "MANDAT_SIGNE",
  "BIEN_ACTIF",
];

export const PROSPECT_STATUT_LABELS: Record<ProspectStatut, string> = {
  NOUVEAU: "Nouveau",
  CONTACTE: "Contacté",
  REPONDU: "Répondu",
  RENDEZ_VOUS: "Rendez-vous",
  VISITE: "Visite",
  PROPOSITION: "Proposition",
  NEGOCIATION: "Négociation",
  MANDAT_SIGNE: "Mandat signé",
  BIEN_ACTIF: "Bien actif",
  PERDU: "Perdu",
};

export const PROSPECT_TYPE_LABELS: Record<ProspectType, string> = {
  PROPRIETAIRE_MEUBLE: "Propriétaire de meublé",
  PROPRIETAIRE_DIASPORA: "Propriétaire absent / diaspora",
  AGENCE: "Agence immobilière",
  INVESTISSEUR: "Investisseur / promoteur",
  ENTREPRISE: "Entreprise",
  INSTITUTION_BANQUE: "Institution / banque",
};

export const POTENTIEL_LABELS: Record<Potentiel, string> = {
  FAIBLE: "Faible",
  MOYEN: "Moyen",
  ELEVE: "Élevé",
  PRIORITAIRE: "🔥 Prioritaire",
};

export const POTENTIEL_ORDER: Potentiel[] = ["PRIORITAIRE", "ELEVE", "MOYEN", "FAIBLE"];

export const BIEN_STATUT_LABELS: Record<BienStatut, string> = {
  EN_PREPARATION: "En préparation",
  PRET: "Prêt",
  ACTIF: "Actif",
  INACTIF: "Inactif",
};

export const INTERACTION_TYPES = ["Appel", "Message", "Visite", "Rendez-vous", "Note"] as const;

export type ChecklistItem = {
  section: string;
  label: string;
  done: boolean;
};

export const CHECKLIST_TEMPLATE: ChecklistItem[] = [
  // Salon
  { section: "Salon", label: "Sol nettoyé", done: false },
  { section: "Salon", label: "Canapé contrôlé", done: false },
  { section: "Salon", label: "Télévision contrôlée", done: false },
  { section: "Salon", label: "Télécommande présente", done: false },
  { section: "Salon", label: "Vitres vérifiées", done: false },
  { section: "Salon", label: "Poussière éliminée", done: false },
  // Chambre
  { section: "Chambre", label: "Draps changés", done: false },
  { section: "Chambre", label: "Oreillers contrôlés", done: false },
  { section: "Chambre", label: "Matelas vérifié", done: false },
  { section: "Chambre", label: "Serviettes remplacées", done: false },
  { section: "Chambre", label: "Armoire contrôlée", done: false },
  { section: "Chambre", label: "Climatisation vérifiée", done: false },
  // Salle de bain
  { section: "Salle de bain", label: "WC nettoyé", done: false },
  { section: "Salle de bain", label: "Douche nettoyée", done: false },
  { section: "Salle de bain", label: "Lavabo nettoyé", done: false },
  { section: "Salle de bain", label: "Miroir nettoyé", done: false },
  { section: "Salle de bain", label: "Serviettes présentes", done: false },
  { section: "Salle de bain", label: "Produits d'accueil présents", done: false },
  // Cuisine
  { section: "Cuisine", label: "Vaisselle propre", done: false },
  { section: "Cuisine", label: "Réfrigérateur contrôlé", done: false },
  { section: "Cuisine", label: "Plaques nettoyées", done: false },
  { section: "Cuisine", label: "Évier nettoyé", done: false },
  { section: "Cuisine", label: "Ustensiles présents", done: false },
  // Final
  { section: "Final", label: "Odeur agréable", done: false },
  { section: "Final", label: "Climatisation fonctionnelle", done: false },
  { section: "Final", label: "Wi-Fi fonctionnel", done: false },
  { section: "Final", label: "Eau disponible", done: false },
  { section: "Final", label: "Clés / accès fonctionnels", done: false },
  { section: "Final", label: "Photos de contrôle prises", done: false },
];

export const CHECKLIST_SECTIONS = ["Salon", "Chambre", "Salle de bain", "Cuisine", "Final"] as const;

export const DAILY_GOAL_NEW_PROSPECTS = 10;
export const DAILY_GOAL_RELANCES = 5;

export const METIER_LABELS: Record<Metier, string> = {
  PLOMBIER: "Plombier",
  ELECTRICIEN: "Électricien",
  CLIMATISATION: "Climatisation",
  SERRURIER: "Serrurier",
  MENUISIER: "Menuisier",
  PEINTRE: "Peintre",
  ELECTROMENAGER: "Technicien électroménager",
  AUTRE: "Autre",
};

export const INCIDENT_STATUT_ORDER: IncidentStatut[] = ["SIGNALE", "ASSIGNE", "EN_COURS", "RESOLU"];

export const INCIDENT_STATUT_LABELS: Record<IncidentStatut, string> = {
  SIGNALE: "Signalé",
  ASSIGNE: "Assigné",
  EN_COURS: "En cours",
  RESOLU: "Résolu",
};

export const CONTRAT_STATUT_LABELS: Record<ContratStatut, string> = {
  ACTIF: "Actif",
  INACTIF: "Inactif",
  EXPIRE: "Expiré",
};

export const SEJOUR_STATUT_ORDER: SejourStatut[] = ["PLANIFIE", "EN_COURS", "TERMINE", "ANNULE"];

export const SEJOUR_STATUT_LABELS: Record<SejourStatut, string> = {
  PLANIFIE: "Planifié",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ANNULE: "Annulé",
};

export const MANDAT_ASSET_STATUT_LABELS: Record<MandatAssetStatut, string> = {
  ACTIF: "Actif",
  INACTIF: "Inactif",
  TERMINE: "Terminé",
};

export const ACTIF_STATUT_ORDER: ActifStatut[] = [
  "A_EVALUER",
  "EN_REMISE_EN_ETAT",
  "PRET",
  "EN_EXPLOITATION",
  "CEDE",
];

export const ACTIF_STATUT_LABELS: Record<ActifStatut, string> = {
  A_EVALUER: "À évaluer",
  EN_REMISE_EN_ETAT: "En remise en état",
  PRET: "Prêt à exploiter",
  EN_EXPLOITATION: "En exploitation",
  CEDE: "Cédé",
};
