import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { CHECKLIST_TEMPLATE } from "../src/lib/constants";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.actifBancaire.deleteMany();
  await prisma.mandatAssetServices.deleteMany();
  await prisma.sejourCorporate.deleteMany();
  await prisma.contratCorporate.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.checklistMenage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.prospect.deleteMany();
  await prisma.apporteur.deleteMany();
  await prisma.prestataire.deleteMany();

  await prisma.user.create({
    data: {
      name: "Fondateur PHANY",
      email: "fondateur@phany.tg",
      passwordHash: await bcrypt.hash("phany2026", 10),
      role: "FONDATEUR",
    },
  });

  await prisma.user.create({
    data: {
      name: "Ama Responsable Opérations",
      email: "operations@phany.tg",
      passwordHash: await bcrypt.hash("phany2026", 10),
      role: "RESPONSABLE_OPERATIONS",
    },
  });

  await prisma.user.create({
    data: {
      name: "Koffi Ménage",
      email: "menage@phany.tg",
      passwordHash: await bcrypt.hash("phany2026", 10),
      role: "MENAGE",
    },
  });

  const apporteur = await prisma.apporteur.create({
    data: {
      nom: "Agence Immo Bè",
      telephone: "+228 90 11 22 33",
      structure: "Agence Immo Bè",
      commissionPct: 5,
      notes: "Apporteur d'affaires régulier, continue à gérer ses propres clients en parallèle.",
    },
  });

  const p1 = await prisma.prospect.create({
    data: {
      nom: "M. Kokou Adjovi",
      telephone: "+228 91 22 33 44",
      type: "PROPRIETAIRE_DIASPORA",
      source: "Réseau",
      quartier: "Agoè",
      typeBien: "Appartement",
      nbChambres: 2,
      meuble: true,
      disponible: true,
      statut: "RENDEZ_VOUS",
      potentiel: "PRIORITAIRE",
      notes: "Appartement 2 chambres meublé, bon emplacement, vacant. Propriétaire rarement à Lomé — prospect prioritaire.",
      dernierContact: daysFromNow(-1),
      prochaineRelance: daysFromNow(0),
    },
  });

  await prisma.interaction.create({
    data: {
      prospectId: p1.id,
      type: "Appel",
      note: "Premier contact téléphonique, très intéressé, RDV fixé.",
      date: daysFromNow(-1),
      prochaineRelance: daysFromNow(0),
    },
  });

  const p2 = await prisma.prospect.create({
    data: {
      nom: "Mme Ama Kponvi",
      telephone: "+228 92 33 44 55",
      type: "PROPRIETAIRE_MEUBLE",
      source: "Facebook",
      quartier: "Adidogomé",
      typeBien: "Villa",
      nbChambres: 3,
      meuble: true,
      disponible: true,
      statut: "CONTACTE",
      potentiel: "ELEVE",
      notes: "Villa 3 chambres, cherche à mieux exploiter le bien.",
      dernierContact: daysFromNow(-2),
      prochaineRelance: daysFromNow(1),
    },
  });

  const p3 = await prisma.prospect.create({
    data: {
      nom: "Agence Immo Bè",
      telephone: "+228 90 11 22 33",
      type: "AGENCE",
      source: "Terrain",
      quartier: "Bè",
      statut: "NEGOCIATION",
      potentiel: "ELEVE",
      notes: "Discussion en cours pour un partenariat apporteur d'affaires.",
      dernierContact: daysFromNow(-3),
      prochaineRelance: daysFromNow(2),
      apporteurId: apporteur.id,
    },
  });

  const p4 = await prisma.prospect.create({
    data: {
      nom: "M. Yao Mensah",
      telephone: "+228 93 44 55 66",
      type: "PROPRIETAIRE_MEUBLE",
      source: "LinkedIn",
      quartier: "Agbalépédogan",
      typeBien: "Studio",
      nbChambres: 1,
      meuble: true,
      disponible: true,
      statut: "MANDAT_SIGNE",
      potentiel: "ELEVE",
      notes: "Mandat signé le mois dernier, bien en préparation.",
      dernierContact: daysFromNow(-5),
    },
  });

  const property = await prisma.property.create({
    data: {
      nom: "Studio Agbalépédogan - M. Mensah",
      adresse: "Rue des Palmiers, Agbalépédogan",
      quartier: "Agbalépédogan",
      typeBien: "Studio",
      nbChambres: 1,
      statut: "EN_PREPARATION",
      loyerEstime: 350000,
      chargesMensuelles: 40000,
      commissionPct: 20,
      mandatDateSignature: daysFromNow(-20),
      prospectId: p4.id,
    },
  });

  await prisma.checklistMenage.create({
    data: {
      propertyId: property.id,
      items: JSON.stringify(CHECKLIST_TEMPLATE),
      statut: "EN_COURS",
    },
  });

  const plombier = await prisma.prestataire.create({
    data: {
      nom: "Kossi Réparations",
      metier: "PLOMBIER",
      telephone: "+228 96 77 88 99",
      zone: "Agbalépédogan, Bè",
      notes: "Intervient rapidement, référencé par deux autres propriétaires.",
    },
  });

  await prisma.prestataire.create({
    data: {
      nom: "Cool Tech Climatisation",
      metier: "CLIMATISATION",
      telephone: "+228 97 88 99 00",
      zone: "Lomé",
    },
  });

  await prisma.incident.create({
    data: {
      propertyId: property.id,
      description: "Fuite d'eau sous l'évier de la cuisine",
      statut: "ASSIGNE",
      prestataireId: plombier.id,
    },
  });

  const p5 = await prisma.prospect.create({
    data: {
      nom: "Togo Négoce SARL",
      telephone: "+228 94 55 66 77",
      type: "ENTREPRISE",
      source: "Réseau",
      quartier: "Centre-ville",
      statut: "MANDAT_SIGNE",
      potentiel: "MOYEN",
      notes: "DRH cherchant hébergement pour collaborateurs en mission à Lomé.",
      dernierContact: daysFromNow(-8),
    },
  });

  const contrat = await prisma.contratCorporate.create({
    data: {
      entreprise: "Togo Négoce SARL",
      contactNom: "Mme Akossiwa Dogbe (DRH)",
      contactTelephone: "+228 94 55 66 77",
      tarifNuitee: 30000,
      notes: "Hébergement des équipes commerciales en déplacement à Lomé, environ 2 séjours par mois.",
      prospectId: p5.id,
    },
  });

  await prisma.sejourCorporate.create({
    data: {
      contratId: contrat.id,
      propertyId: property.id,
      collaborateurNom: "M. Edem Agbeko",
      dateArrivee: daysFromNow(1),
      dateDepart: daysFromNow(4),
      statut: "PLANIFIE",
    },
  });

  const p6 = await prisma.prospect.create({
    data: {
      nom: "Banque Régionale du Golfe",
      telephone: "+228 22 21 00 00",
      type: "INSTITUTION_BANQUE",
      source: "Réseau",
      quartier: "Centre-ville",
      statut: "MANDAT_SIGNE",
      potentiel: "ELEVE",
      notes: "Portefeuille de biens saisis à valoriser, plusieurs nécessitent des travaux.",
      dernierContact: daysFromNow(-15),
    },
  });

  const mandatAsset = await prisma.mandatAssetServices.create({
    data: {
      institution: "Banque Régionale du Golfe",
      contactNom: "M. Ayité Kudjo (Direction du contentieux)",
      contactTelephone: "+228 22 21 00 00",
      honorairesPct: 15,
      notes: "Mandat de gestion et valorisation d'un premier lot de 3 biens saisis.",
      prospectId: p6.id,
    },
  });

  await prisma.actifBancaire.create({
    data: {
      mandatId: mandatAsset.id,
      nom: "Villa Kodjoviakopé (ex-saisie)",
      adresse: "Boulevard du 13 janvier, Kodjoviakopé",
      quartier: "Kodjoviakopé",
      typeBien: "Villa",
      nbChambres: 4,
      statut: "EN_REMISE_EN_ETAT",
      valeurEstimee: 45000000,
      budgetRemiseEnEtat: 3500000,
      notes: "Peinture, plomberie et climatisation à refaire avant remise en exploitation.",
    },
  });

  await prisma.actifBancaire.create({
    data: {
      mandatId: mandatAsset.id,
      nom: "Appartement Nyékonakpoè (ex-saisie)",
      adresse: "Rue 234, Nyékonakpoè",
      quartier: "Nyékonakpoè",
      typeBien: "Appartement",
      nbChambres: 2,
      statut: "A_EVALUER",
      valeurEstimee: 22000000,
      notes: "Visite d'évaluation à programmer.",
    },
  });

  await prisma.prospect.create({
    data: {
      nom: "M. Koffi Amewou",
      telephone: "+228 95 66 77 88",
      type: "PROPRIETAIRE_DIASPORA",
      source: "Annonce en ligne",
      quartier: "Baguida",
      typeBien: "Villa",
      nbChambres: 4,
      meuble: false,
      disponible: true,
      statut: "PERDU",
      potentiel: "FAIBLE",
      notes: "Ne souhaite pas déléguer la gestion pour le moment.",
      dernierContact: daysFromNow(-10),
    },
  });

  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
