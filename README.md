# PHANY — Application de prospection & gestion

Application interne pour piloter la prospection de propriétaires (méthode 10×5) et la préparation des biens sous mandat PHANY.

## Démarrage

```bash
npm install
cp .env.example .env        # puis renseigner DATABASE_URL avec une vraie base PostgreSQL
npx prisma migrate dev --name init   # crée les tables (première fois uniquement)
npm run db:seed              # charge des données d'exemple (optionnel)
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
- **Recherche de logement** — demandes clients (location ou achat : appartement, villa, boutique, terrain, maison, entrepôt, bureau...) avec budget et critères ; répertoire d'**annonces repérées** par l'équipe (Facebook, WhatsApp, sites web, terrain) ; mise en relation demande ↔ bien PHANY ou annonce externe sous forme de **proposition**, avec frais de visite et suivi de paiement (En attente → Payé), date et résultat de visite.

## Non couvert pour l'instant

- **Channel manager** / diffusion sur les plateformes de réservation — nécessiterait des accès partenaires Airbnb/Booking réels.
- **Veille automatique de Facebook/WhatsApp par IA** — ce qui a été construit à la place : un répertoire où l'équipe **enregistre manuellement** les annonces qu'elle repère, et qui alimente directement les propositions aux clients. Un vrai robot scrutant Facebook et WhatsApp en continu n'est pas quelque chose qui peut être branché ici : Facebook et WhatsApp interdisent le scraping dans leurs conditions d'utilisation et ne fournissent pas d'API publique pour parcourir des annonces ou des groupes de tiers, et une veille de ce type nécessiterait un service tournant en permanence (infrastructure, coûts récurrents, risque de blocage des comptes utilisés). Si un service de veille légal existe un jour (API officielle, prestataire spécialisé), il peut alimenter cette même table `AnnonceExterne` sans rien changer au reste de l'application.

Ces modules peuvent être ajoutés au-dessus de la même base (Prisma + Next.js).

## Stack technique

Next.js 16 (App Router, Server Actions), Prisma 7 + PostgreSQL (adaptateur `@prisma/adapter-pg`, compatible avec n'importe quel Postgres standard : Neon, Supabase, Railway, RDS...), Tailwind CSS.

## Base de données

- `npx prisma studio` — interface visuelle pour explorer/modifier les données directement.
- `npx prisma migrate dev --name <nom>` — après toute modification de `prisma/schema.prisma`, en local.
- `npx prisma migrate deploy` — applique les migrations en attente sans les recréer (utilisé automatiquement au déploiement, voir ci-dessous).

## Déploiement (Vercel)

1. **Créer le dépôt GitHub** : sur github.com, créer un dépôt vide, puis depuis `phany-app/` :
   ```bash
   git remote add origin <url-de-votre-depot>
   git branch -M main
   git push -u origin main
   ```
2. **Importer sur Vercel** : sur vercel.com/new, importer le dépôt GitHub. Vercel détecte Next.js automatiquement.
3. **Variable d'environnement** : dans les réglages du projet Vercel, ajouter `DATABASE_URL` avec la chaîne de connexion PostgreSQL de production.
4. **Build** : le script `vercel-build` (`prisma migrate deploy && next build`) s'exécute automatiquement à chaque déploiement — les migrations en attente sont appliquées avant le build, sans jamais réinitialiser les données.
5. **Premier déploiement** : le tout premier déploiement nécessite qu'un dossier `prisma/migrations` existe dans le dépôt (créé localement via `npx prisma migrate dev --name init` avant le premier `git push`).

Après déploiement, changez le mot de passe des comptes de test avant tout usage réel.
