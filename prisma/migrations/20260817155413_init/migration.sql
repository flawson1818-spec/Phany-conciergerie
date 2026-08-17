-- CreateEnum
CREATE TYPE "ProspectType" AS ENUM ('PROPRIETAIRE_MEUBLE', 'PROPRIETAIRE_DIASPORA', 'AGENCE', 'INVESTISSEUR', 'ENTREPRISE', 'INSTITUTION_BANQUE');

-- CreateEnum
CREATE TYPE "ProspectStatut" AS ENUM ('NOUVEAU', 'CONTACTE', 'REPONDU', 'RENDEZ_VOUS', 'VISITE', 'PROPOSITION', 'NEGOCIATION', 'MANDAT_SIGNE', 'BIEN_ACTIF', 'PERDU');

-- CreateEnum
CREATE TYPE "Potentiel" AS ENUM ('FAIBLE', 'MOYEN', 'ELEVE', 'PRIORITAIRE');

-- CreateEnum
CREATE TYPE "BienStatut" AS ENUM ('EN_PREPARATION', 'PRET', 'ACTIF', 'INACTIF');

-- CreateEnum
CREATE TYPE "ChecklistStatut" AS ENUM ('EN_COURS', 'TERMINE');

-- CreateEnum
CREATE TYPE "Metier" AS ENUM ('PLOMBIER', 'ELECTRICIEN', 'CLIMATISATION', 'SERRURIER', 'MENUISIER', 'PEINTRE', 'ELECTROMENAGER', 'AUTRE');

-- CreateEnum
CREATE TYPE "IncidentStatut" AS ENUM ('SIGNALE', 'ASSIGNE', 'EN_COURS', 'RESOLU');

-- CreateEnum
CREATE TYPE "ContratStatut" AS ENUM ('ACTIF', 'INACTIF', 'EXPIRE');

-- CreateEnum
CREATE TYPE "SejourStatut" AS ENUM ('PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE');

-- CreateEnum
CREATE TYPE "MandatAssetStatut" AS ENUM ('ACTIF', 'INACTIF', 'TERMINE');

-- CreateEnum
CREATE TYPE "ActifStatut" AS ENUM ('A_EVALUER', 'EN_REMISE_EN_ETAT', 'PRET', 'EN_EXPLOITATION', 'CEDE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FONDATEUR', 'RESPONSABLE_OPERATIONS', 'MENAGE', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'RESPONSABLE_OPERATIONS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apporteur" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "structure" TEXT,
    "commissionPct" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Apporteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT,
    "type" "ProspectType" NOT NULL DEFAULT 'PROPRIETAIRE_MEUBLE',
    "source" TEXT,
    "quartier" TEXT,
    "typeBien" TEXT,
    "nbChambres" INTEGER,
    "meuble" BOOLEAN NOT NULL DEFAULT false,
    "disponible" BOOLEAN NOT NULL DEFAULT false,
    "statut" "ProspectStatut" NOT NULL DEFAULT 'NOUVEAU',
    "potentiel" "Potentiel" NOT NULL DEFAULT 'MOYEN',
    "notes" TEXT,
    "dernierContact" TIMESTAMP(3),
    "prochaineRelance" TIMESTAMP(3),
    "apporteurId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "note" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prochaineRelance" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT,
    "quartier" TEXT,
    "typeBien" TEXT,
    "nbChambres" INTEGER,
    "statut" "BienStatut" NOT NULL DEFAULT 'EN_PREPARATION',
    "loyerEstime" DOUBLE PRECISION,
    "chargesMensuelles" DOUBLE PRECISION,
    "commissionPct" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "mandatDateSignature" TIMESTAMP(3),
    "prospectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistMenage" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "statut" "ChecklistStatut" NOT NULL DEFAULT 'EN_COURS',
    "completedBy" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChecklistMenage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestataire" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "metier" "Metier" NOT NULL DEFAULT 'AUTRE',
    "telephone" TEXT,
    "zone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prestataire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "statut" "IncidentStatut" NOT NULL DEFAULT 'SIGNALE',
    "prestataireId" TEXT,
    "photoUrl" TEXT,
    "noteResolution" TEXT,
    "signaleLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resoluLe" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContratCorporate" (
    "id" TEXT NOT NULL,
    "entreprise" TEXT NOT NULL,
    "contactNom" TEXT,
    "contactTelephone" TEXT,
    "contactEmail" TEXT,
    "statut" "ContratStatut" NOT NULL DEFAULT 'ACTIF',
    "tarifNuitee" DOUBLE PRECISION,
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" TIMESTAMP(3),
    "notes" TEXT,
    "prospectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContratCorporate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SejourCorporate" (
    "id" TEXT NOT NULL,
    "contratId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "collaborateurNom" TEXT NOT NULL,
    "dateArrivee" TIMESTAMP(3) NOT NULL,
    "dateDepart" TIMESTAMP(3),
    "statut" "SejourStatut" NOT NULL DEFAULT 'PLANIFIE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SejourCorporate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MandatAssetServices" (
    "id" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "contactNom" TEXT,
    "contactTelephone" TEXT,
    "contactEmail" TEXT,
    "statut" "MandatAssetStatut" NOT NULL DEFAULT 'ACTIF',
    "honorairesPct" DOUBLE PRECISION,
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" TIMESTAMP(3),
    "notes" TEXT,
    "prospectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MandatAssetServices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActifBancaire" (
    "id" TEXT NOT NULL,
    "mandatId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT,
    "quartier" TEXT,
    "typeBien" TEXT,
    "nbChambres" INTEGER,
    "statut" "ActifStatut" NOT NULL DEFAULT 'A_EVALUER',
    "valeurEstimee" DOUBLE PRECISION,
    "budgetRemiseEnEtat" DOUBLE PRECISION,
    "coutRemiseEnEtatReel" DOUBLE PRECISION,
    "notes" TEXT,
    "propertyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActifBancaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ActifBancaire_propertyId_key" ON "ActifBancaire"("propertyId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_apporteurId_fkey" FOREIGN KEY ("apporteurId") REFERENCES "Apporteur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistMenage" ADD CONSTRAINT "ChecklistMenage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_prestataireId_fkey" FOREIGN KEY ("prestataireId") REFERENCES "Prestataire"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContratCorporate" ADD CONSTRAINT "ContratCorporate_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SejourCorporate" ADD CONSTRAINT "SejourCorporate_contratId_fkey" FOREIGN KEY ("contratId") REFERENCES "ContratCorporate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SejourCorporate" ADD CONSTRAINT "SejourCorporate_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MandatAssetServices" ADD CONSTRAINT "MandatAssetServices_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActifBancaire" ADD CONSTRAINT "ActifBancaire_mandatId_fkey" FOREIGN KEY ("mandatId") REFERENCES "MandatAssetServices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActifBancaire" ADD CONSTRAINT "ActifBancaire_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
