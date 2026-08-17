-- CreateEnum
CREATE TYPE "TypeDemande" AS ENUM ('LOCATION', 'ACHAT');

-- CreateEnum
CREATE TYPE "DemandeStatut" AS ENUM ('NOUVELLE', 'EN_RECHERCHE', 'PROPOSITION_ENVOYEE', 'VISITE_PLANIFIEE', 'CONCLUE', 'ABANDONNEE');

-- CreateEnum
CREATE TYPE "SourceAnnonce" AS ENUM ('FACEBOOK', 'WHATSAPP', 'SITE_WEB', 'TERRAIN', 'AUTRE');

-- CreateEnum
CREATE TYPE "AnnonceStatut" AS ENUM ('DISPONIBLE', 'PROPOSEE', 'INDISPONIBLE');

-- CreateEnum
CREATE TYPE "StatutPaiementVisite" AS ENUM ('EN_ATTENTE', 'PAYE', 'ANNULE');

-- CreateTable
CREATE TABLE "DemandeRecherche" (
    "id" TEXT NOT NULL,
    "nomClient" TEXT NOT NULL,
    "telephoneClient" TEXT,
    "typeDemande" "TypeDemande" NOT NULL DEFAULT 'LOCATION',
    "typeBien" TEXT,
    "quartierSouhaite" TEXT,
    "budgetMin" DOUBLE PRECISION,
    "budgetMax" DOUBLE PRECISION,
    "nbChambres" INTEGER,
    "notes" TEXT,
    "statut" "DemandeStatut" NOT NULL DEFAULT 'NOUVELLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemandeRecherche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnonceExterne" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "source" "SourceAnnonce" NOT NULL DEFAULT 'AUTRE',
    "lienOuContact" TEXT,
    "typeBien" TEXT,
    "quartier" TEXT,
    "prix" DOUBLE PRECISION,
    "description" TEXT,
    "statut" "AnnonceStatut" NOT NULL DEFAULT 'DISPONIBLE',
    "dateRepere" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnnonceExterne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposition" (
    "id" TEXT NOT NULL,
    "demandeId" TEXT NOT NULL,
    "propertyId" TEXT,
    "annonceExterneId" TEXT,
    "fraisVisite" DOUBLE PRECISION,
    "statutPaiement" "StatutPaiementVisite" NOT NULL DEFAULT 'EN_ATTENTE',
    "dateVisite" TIMESTAMP(3),
    "resultatVisite" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Proposition" ADD CONSTRAINT "Proposition_demandeId_fkey" FOREIGN KEY ("demandeId") REFERENCES "DemandeRecherche"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposition" ADD CONSTRAINT "Proposition_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposition" ADD CONSTRAINT "Proposition_annonceExterneId_fkey" FOREIGN KEY ("annonceExterneId") REFERENCES "AnnonceExterne"("id") ON DELETE SET NULL ON UPDATE CASCADE;
