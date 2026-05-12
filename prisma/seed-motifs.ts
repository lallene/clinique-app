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

const motifs = [
  // CONSULTATION GÉNÉRALE
  { libelle: 'CONSULTATION GÉNÉRALE', categorie: 'GENERAL' },
  { libelle: 'CONTRÔLE MÉDICAL', categorie: 'GENERAL' },
  { libelle: 'VISITE DE SUIVI', categorie: 'GENERAL' },
  { libelle: 'BILAN DE SANTÉ', categorie: 'GENERAL' },

  // FIÈVRE / INFECTIONS
  { libelle: 'FIÈVRE', categorie: 'GENERAL' },
  { libelle: 'PALUDISME SUSPECTÉ', categorie: 'GENERAL' },
  { libelle: 'FRISSONS', categorie: 'GENERAL' },
  { libelle: 'GRIPPE', categorie: 'GENERAL' },
  { libelle: 'INFECTION', categorie: 'GENERAL' },

  // RESPIRATOIRE
  { libelle: 'TOUX', categorie: 'RESPIRATOIRE' },
  { libelle: 'DIFFICULTÉ RESPIRATOIRE', categorie: 'RESPIRATOIRE' },
  { libelle: 'ASTHME', categorie: 'RESPIRATOIRE' },
  { libelle: 'RHUME', categorie: 'RESPIRATOIRE' },
  { libelle: 'MAL DE GORGE', categorie: 'RESPIRATOIRE' },

  // DIGESTIF
  { libelle: 'DOULEURS ABDOMINALES', categorie: 'DIGESTIF' },
  { libelle: 'DIARRHÉE', categorie: 'DIGESTIF' },
  { libelle: 'VOMISSEMENTS', categorie: 'DIGESTIF' },
  { libelle: 'CONSTIPATION', categorie: 'DIGESTIF' },
  { libelle: 'GASTRITE', categorie: 'DIGESTIF' },

  // CARDIO
  { libelle: 'HYPERTENSION', categorie: 'CARDIOLOGIE' },
  { libelle: 'DOULEUR THORACIQUE', categorie: 'CARDIOLOGIE' },
  { libelle: 'PALPITATIONS', categorie: 'CARDIOLOGIE' },
  { libelle: 'ESSOUFFLEMENT', categorie: 'CARDIOLOGIE' },

  // NEURO
  { libelle: 'CÉPHALÉES', categorie: 'NEUROLOGIE' },
  { libelle: 'VERTIGES', categorie: 'NEUROLOGIE' },
  { libelle: 'PERTE DE CONNAISSANCE', categorie: 'NEUROLOGIE' },
  { libelle: 'CRISE CONVULSIVE', categorie: 'NEUROLOGIE' },

  // GYNÉCO
  { libelle: 'SUIVI GROSSESSE', categorie: 'GYNECOLOGIE' },
  { libelle: 'DOULEURS PELVIENNES', categorie: 'GYNECOLOGIE' },
  { libelle: 'CONSULTATION PRÉNATALE', categorie: 'GYNECOLOGIE' },
  { libelle: 'TROUBLES MENSTRUELS', categorie: 'GYNECOLOGIE' },

  // PÉDIATRIE
  { libelle: 'CONSULTATION PÉDIATRIQUE', categorie: 'PEDIATRIE' },
  { libelle: 'FIÈVRE ENFANT', categorie: 'PEDIATRIE' },
  { libelle: 'VACCINATION', categorie: 'PEDIATRIE' },
  { libelle: 'SURVEILLANCE CROISSANCE', categorie: 'PEDIATRIE' },

  // TRAUMATO
  { libelle: 'TRAUMATISME', categorie: 'URGENCE' },
  { libelle: 'ACCIDENT', categorie: 'URGENCE' },
  { libelle: 'PLAIE', categorie: 'URGENCE' },
  { libelle: 'BRÛLURE', categorie: 'URGENCE' },
  { libelle: 'FRACTURE SUSPECTÉE', categorie: 'URGENCE' },

  // DERMATO
  { libelle: 'ALLERGIE', categorie: 'DERMATOLOGIE' },
  { libelle: 'ÉRUPTION CUTANÉE', categorie: 'DERMATOLOGIE' },
  { libelle: 'DÉMANGEAISONS', categorie: 'DERMATOLOGIE' },

  // UROLOGIE
  { libelle: 'DOULEURS URINAIRES', categorie: 'UROLOGIE' },
  { libelle: 'INFECTION URINAIRE', categorie: 'UROLOGIE' },
  { libelle: 'BRÛLURES URINAIRES', categorie: 'UROLOGIE' },

  // OPHTALMO
  { libelle: 'DOULEUR OCULAIRE', categorie: 'OPHTALMOLOGIE' },
  { libelle: 'VISION FLOUE', categorie: 'OPHTALMOLOGIE' },

  // ORL
  { libelle: 'DOULEUR OREILLE', categorie: 'ORL' },
  { libelle: 'OTITE', categorie: 'ORL' },

  // AUTRES
  { libelle: 'CERTIFICAT MÉDICAL', categorie: 'ADMINISTRATIF' },
  { libelle: 'APTITUDE MÉDICALE', categorie: 'ADMINISTRATIF' },
  { libelle: 'URGENCE MÉDICALE', categorie: 'URGENCE' },
  { libelle: 'AUTRE', categorie: 'AUTRE' },
];

async function main() {
  console.log('🌱 Seed motifs consultation...');

  for (const motif of motifs) {
    await prisma.motifConsultation.upsert({
      where: {
        libelle: motif.libelle,
      },

      update: {
        categorie: motif.categorie,
        actif: true,
      },

      create: {
        libelle: motif.libelle,
        categorie: motif.categorie,
        actif: true,
      },
    });

    console.log(`✅ ${motif.libelle}`);
  }

  console.log('🎉 Seed motifs terminé');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed motifs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });