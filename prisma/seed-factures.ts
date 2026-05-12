import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL manquante');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const actes = [
  {
    libelle: 'CONSULTATION GÉNÉRALE',
    categorie: 'ACTES_MEDICAUX',
    prixUnitaire: 10000,
  },
  {
    libelle: 'TEST PALUDISME',
    categorie: 'ANALYSES_BIOLOGIQUES',
    prixUnitaire: 5000,
  },
];

async function main() {
  console.log('🌱 Seed factures...');

  for (const acte of actes) {
  const existing = await prisma.acteMedical.findFirst({
    where: { libelle: acte.libelle },
  });

  if (existing) {
    await prisma.acteMedical.update({
      where: { idActe: existing.idActe },
      data: {
        categorie: acte.categorie,
        prixUnitaire: acte.prixUnitaire,
        valeur: acte.prixUnitaire,
        etat: 'actif',
      },
    });
  } else {
    await prisma.acteMedical.create({
      data: {
        libelle: acte.libelle,
        categorie: acte.categorie,
        prixUnitaire: acte.prixUnitaire,
        valeur: acte.prixUnitaire,
        forfait: false,
        etat: 'actif',
      },
    });
  }
}

  const patients = await prisma.patient.findMany({
    include: { assurance: true },
    take: 3,
  });

    const acteConsultation = await prisma.acteMedical.findFirst({
    where: { libelle: 'CONSULTATION GÉNÉRALE' },
    });

    const acteTestPalu = await prisma.acteMedical.findFirst({
    where: { libelle: 'TEST PALUDISME' },
    });

  if (!acteConsultation || !acteTestPalu) {
    throw new Error('Actes médicaux manquants.');
  }

  let index = 1;

  for (const patient of patients) {
    const numeroFacture = `FAC-2026-${String(index).padStart(4, '0')}`;

    const existing = await prisma.facture.findUnique({
      where: { numeroFacture },
    });

    if (existing) {
      console.log(`⚠️ ${numeroFacture} existe déjà`);
      index++;
      continue;
    }

    const lignes = [
      {
        acteId: acteConsultation.idActe,
        designation: acteConsultation.libelle,
        quantite: 1,
        prixUnitaire: acteConsultation.prixUnitaire,
        montant: acteConsultation.prixUnitaire,
      },
      {
        acteId: acteTestPalu.idActe,
        designation: acteTestPalu.libelle,
        quantite: 1,
        prixUnitaire: acteTestPalu.prixUnitaire,
        montant: acteTestPalu.prixUnitaire,
      },
    ];

    const montantTotal = lignes.reduce((sum, ligne) => sum + ligne.montant, 0);
    const taux = Number(patient.tauxCouverture || 0);
    const montantAssurance = patient.isAssure
      ? Math.round(montantTotal * (taux / 100))
      : 0;
    const montantPatient = montantTotal - montantAssurance;

    await prisma.facture.create({
      data: {
        numeroFacture,
        patientId: patient.id_patient,
        assuranceId: patient.assuranceId || null,
        tauxCouverture: taux,
        montantTotal,
        montantAssurance,
        montantPatient,
        statut: 'brouillon',

        lignes: {
          create: lignes,
        },
      },
    });

    console.log(`✅ ${numeroFacture}`);
    index++;
  }

  console.log('🎉 Seed factures terminé');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed factures:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });