import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL manquante');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const compagnies = [
  { nomCompagnie: 'MUGEF-CI', codeCompagnie: 'MUGEF' },
  { nomCompagnie: 'ASCOMA', codeCompagnie: 'ASCOMA' },
  { nomCompagnie: 'NSIA ASSURANCES', codeCompagnie: 'NSIA' },
  { nomCompagnie: 'SANLAM', codeCompagnie: 'SANLAM' },
];

const assurances = [
  {
    codeAssurance: 'ASS-MUGEF-001',
    compagnieCode: 'MUGEF',
    nomGarant: 'MUGEF-CI',
    tauxCouverture: 80,
    echeanceReglement: 30,
  },
  {
    codeAssurance: 'ASS-ASCOMA-001',
    compagnieCode: 'ASCOMA',
    nomGarant: 'ASCOMA SANTÉ',
    tauxCouverture: 70,
    echeanceReglement: 30,
  },
  {
    codeAssurance: 'ASS-NSIA-001',
    compagnieCode: 'NSIA',
    nomGarant: 'NSIA SANTÉ',
    tauxCouverture: 90,
    echeanceReglement: 45,
  },
];

async function main() {
  console.log('🌱 Seed assurances...');

  for (const compagnie of compagnies) {
    await prisma.compagnieAssurance.upsert({
      where: { nomCompagnie: compagnie.nomCompagnie },
      update: {
        codeCompagnie: compagnie.codeCompagnie,
      },
      create: compagnie,
    });
  }

  for (const item of assurances) {
    const compagnie = await prisma.compagnieAssurance.findUnique({
      where: { codeCompagnie: item.compagnieCode },
    });

    if (!compagnie) continue;

    await prisma.assurance.upsert({
      where: { codeAssurance: item.codeAssurance },
      update: {
        compagnieId: compagnie.idCompagnie,
        nomGarant: item.nomGarant,
        tauxCouverture: item.tauxCouverture,
        echeanceReglement: item.echeanceReglement,
        statut: 'active',
      },
      create: {
        compagnieId: compagnie.idCompagnie,
        codeAssurance: item.codeAssurance,
        nomGarant: item.nomGarant,
        tauxCouverture: item.tauxCouverture,
        echeanceReglement: item.echeanceReglement,
        statut: 'active',
        controleFacturation: true,
        numeroBonObligatoire: false,
        gestionBonsPharmacie: true,
      },
    });

    console.log(`✅ ${item.codeAssurance}`);
  }

  console.log('🎉 Seed assurances terminé');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed assurances:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });