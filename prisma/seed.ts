import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Tentative de connexion à Neon...');

  const compagnies = [
    { nomCompagnie: 'MUGEF-CI' },
    { nomCompagnie: 'ASCOMA' },
    { nomCompagnie: 'NSIA ASSURANCES' },
    { nomCompagnie: 'SANLAM' },
    { nomCompagnie: 'ALLIANZ' },
    { nomCompagnie: 'SUNU' },
    { nomCompagnie: 'GNA ASSURANCES' },
    { nomCompagnie: 'AXA' },
  ];

  for (const compagnie of compagnies) {
    await prisma.compagnieAssurance.upsert({
      where: { nomCompagnie: compagnie.nomCompagnie },
      update: {},
      create: compagnie,
    });
  }

  console.log('✅ Catalogue des compagnies créé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
