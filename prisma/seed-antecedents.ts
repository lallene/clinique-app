import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL manquante');
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const antecedents = [
  { libelle: 'PALUDISME', categorie: 'INFECTIEUX' },
  { libelle: 'HYPERTENSION ARTÉRIELLE', categorie: 'CARDIOLOGIE' },
  { libelle: 'DIABÈTE', categorie: 'ENDOCRINOLOGIE' },
  { libelle: 'ASTHME', categorie: 'RESPIRATOIRE' },
  { libelle: 'ALLERGIE MÉDICAMENTEUSE', categorie: 'ALLERGIE' },
  { libelle: 'ALLERGIE ALIMENTAIRE', categorie: 'ALLERGIE' },
  { libelle: 'ULCÈRE GASTRIQUE', categorie: 'DIGESTIF' },
  { libelle: 'DRÉPANOCYTOSE', categorie: 'HEMATOLOGIE' },
  { libelle: 'TUBERCULOSE', categorie: 'INFECTIEUX' },
  { libelle: 'VIH', categorie: 'INFECTIEUX' },
  { libelle: 'HÉPATITE B', categorie: 'INFECTIEUX' },
  { libelle: 'HÉPATITE C', categorie: 'INFECTIEUX' },
  { libelle: 'AVC', categorie: 'NEUROLOGIE' },
  { libelle: 'ÉPILEPSIE', categorie: 'NEUROLOGIE' },
  { libelle: 'MIGRAINE CHRONIQUE', categorie: 'NEUROLOGIE' },
  { libelle: 'CHIRURGIE ANTÉRIEURE', categorie: 'CHIRURGIE' },
  { libelle: 'CÉSARIENNE ANTÉRIEURE', categorie: 'GYNECOLOGIE' },
  { libelle: 'GROSSESSE À RISQUE', categorie: 'GYNECOLOGIE' },
  { libelle: 'FAUSSE COUCHE ANTÉRIEURE', categorie: 'GYNECOLOGIE' },
  { libelle: 'MALADIE CARDIAQUE', categorie: 'CARDIOLOGIE' },
  { libelle: 'INSUFFISANCE RÉNALE', categorie: 'AUTRE' },
  { libelle: 'ANÉMIE', categorie: 'HEMATOLOGIE' },
  { libelle: 'OBÉSITÉ', categorie: 'ENDOCRINOLOGIE' },
  { libelle: 'COVID-19', categorie: 'INFECTIEUX' },
  { libelle: 'ANTÉCÉDENT FAMILIAL DIABÈTE', categorie: 'FAMILIAL' },
  { libelle: 'ANTÉCÉDENT FAMILIAL HTA', categorie: 'FAMILIAL' },
  { libelle: 'AUTRE', categorie: 'AUTRE' },
];

async function main() {
  console.log('🌱 Seed antécédents médicaux...');

  for (const antecedent of antecedents) {
    await prisma.antecedentMedical.upsert({
      where: {
        libelle: antecedent.libelle,
      },
      update: {
        categorie: antecedent.categorie,
        actif: true,
      },
      create: {
        libelle: antecedent.libelle,
        categorie: antecedent.categorie,
        actif: true,
      },
    });

    console.log(`✅ ${antecedent.libelle}`);
  }

  console.log('🎉 Seed antécédents terminé');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed antécédents:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });