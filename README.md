# PHANY — Application de prospection & gestion

Application interne pour piloter la prospection de propriétaires (méthode 10×5) et la préparation des biens sous mandat PHANY.

## Démarrage

```bash
npm install
npm run db:seed   # charge des données d'exemple (optionnel, écrase la base actuelle)
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) — vous serez redirigé vers `/login`.

### Comptes de test (créés par `npm run db:seed`)

Mot de passe identique pour les quatre : `phany2026`

| Email | Rôle |
| --- | --- |
| fondateur@phany.tg | Fondateur / Directeur |
| operations@phany.tg | Responsable opérations |
| menage@phany.tg | Équipe ménage |

Seul le Fondateur peut créer de nouveaux comptes, depuis la page **Équipe**. Changez ce mot de passe avant tout déploiement réel.

## Ce qui est couvert (MVP)

- **Tableau de bord** — objectif quotidien 10 nouveaux prospects / 5 relances / 1 RDV, relances en retard, prospects prioritaires, entonnoir de pipeline.
- **Prospects** — vue Kanban sur les 9 statuts du pipeline (Nouveau → Bien actif), fiche détaillée, historique des contacts, "règle d'or" (chaque contact loggé exige une prochaine relance).
- **Apporteurs d'affaires** — répertoire des agences/partenaires qui orientent des propriétaires vers PHANY.
- **Biens** — créés automatiquement à la signature d'un mandat ; calculateur de rentabilité (revenu, commission, charges, net propriétaire) et checklist de ménage standard PHANY (29 points, 5 sections).
- **Prestataires & maintenance** — répertoire des prestataires (plombier, électricien, climatisation, serrurier, menuisier, peintre, électroménager) ; signalement d'incident sur un bien, assignation, suivi de statut (Signalé → Assigné → En cours → Résolu), note de résolution, compteur d'incidents ouverts sur le tableau de bord.
- **PHANY Corporate** — contrats entreprises (contact, tarif nuitée négocié, statut), séjours de collaborateurs liés à un bien PHANY avec suivi de statut (Planifié → En cours → Terminé), conversion directe d'un prospect de type Entreprise en contrat à la signature du mandat.
- **PHANY Asset Services** — mandats banques/institutions sur un portefeuille d'actifs ; chaque actif suit un statut (À évaluer → En remise en état → Prêt à exploiter), avec valeur estimée et budget de travaux ; un actif Prêt se convertit en un clic en bien PHANY opérationnel (checklist ménage + maintenance incluses).
- **Authentification multi-utilisateur** — comptes nominatifs avec rôles calqués sur l'organigramme PHANY (Fondateur, Responsable opérations, Équipe ménage, Maintenance), sessions en base (cookie httpOnly, 30 jours), page **Équipe** pour créer des comptes (réservée au Fondateur). Toutes les pages et actions serveur vérifient la session ; aucune donnée n'est accessible sans être connecté.
- **Permissions par rôle** — Fondateur et Responsable opérations ont accès complet (Prospects, Apporteurs, Corporate, Asset Services, Prestataires, finances des biens). Équipe ménage et Maintenance n'ont accès qu'au tableau de bord (vue simplifiée : incidents + biens récents), à la liste des Biens (sans les montants) et à la fiche d'un bien pour la checklist de ménage et le signalement/suivi des incidents — pas de visibilité sur le CRM ni les revenus. Contrôle appliqué à la fois sur les pages et sur chaque action serveur.

## Non couvert pour l'instant

Volontairement hors du MVP initial pour rester livrable rapidement : channel manager / diffusion sur les plateformes de réservation (nécessiterait des accès partenaires Airbnb/Booking réels). Ce module peut être ajouté au-dessus de la même base (Prisma + Next.js).

## Stack technique

Next.js 16 (App Router, Server Actions), Prisma 7 + SQLite (fichier local `prisma/dev.db`, migrable vers PostgreSQL en changeant le provider et l'adapter), Tailwind CSS.

## Base de données

- `npx prisma studio` — interface visuelle pour explorer/modifier les données directement.
- `npx prisma migrate dev --name <nom>` — après toute modification de `prisma/schema.prisma`.
