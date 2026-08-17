import { prisma } from "@/lib/prisma";

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

export async function getDashboardData() {
  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  const [
    newProspectsToday,
    interactionsToday,
    relancesDues,
    pipelineCountsRaw,
    prioritaires,
    properties,
    incidentsOuverts,
    sejoursEnCours,
    actifsEnRemiseEnEtat,
  ] = await Promise.all([
    prisma.prospect.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.interaction.count({ where: { date: { gte: todayStart, lte: todayEnd } } }),
    prisma.prospect.findMany({
      where: {
        prochaineRelance: { lte: todayEnd },
        statut: { notIn: ["MANDAT_SIGNE", "BIEN_ACTIF", "PERDU"] },
      },
      orderBy: { prochaineRelance: "asc" },
    }),
    prisma.prospect.groupBy({ by: ["statut"], _count: { _all: true } }),
    prisma.prospect.findMany({
      where: { potentiel: "PRIORITAIRE", statut: { notIn: ["MANDAT_SIGNE", "BIEN_ACTIF", "PERDU"] } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.property.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.incident.findMany({
      where: { statut: { not: "RESOLU" } },
      include: { property: true, prestataire: true },
      orderBy: { signaleLe: "asc" },
    }),
    prisma.sejourCorporate.findMany({
      where: { statut: { in: ["PLANIFIE", "EN_COURS"] } },
      include: { property: true, contrat: true },
      orderBy: { dateArrivee: "asc" },
    }),
    prisma.actifBancaire.findMany({
      where: { statut: { in: ["A_EVALUER", "EN_REMISE_EN_ETAT"] } },
      include: { mandat: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const pipelineCounts = Object.fromEntries(
    pipelineCountsRaw.map((row) => [row.statut, row._count._all]),
  ) as Record<string, number>;

  return {
    newProspectsToday,
    interactionsToday,
    relancesDues,
    pipelineCounts,
    prioritaires,
    properties,
    incidentsOuverts,
    sejoursEnCours,
    actifsEnRemiseEnEtat,
  };
}
