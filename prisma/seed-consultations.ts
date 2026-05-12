import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL manquante');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seed consultations...');

  const patients = await prisma.patient.findMany({ take: 3 });

  const motifs = await prisma.motifConsultation.findMany({
    where: {
      libelle: {
        in: ['FIÈVRE', 'CÉPHALÉES', 'PALUDISME SUSPECTÉ'],
      },
    },
  });

  const antecedents = await prisma.antecedentMedical.findMany({
    where: {
      libelle: {
        in: ['PALUDISME', 'HYPERTENSION ARTÉRIELLE'],
      },
    },
  });

  const produits = await prisma.produitPharmacie.findMany({
    where: {
      nomProduit: {
        in: ['PARACÉTAMOL', 'ARTEMETHER LUMEFANTRINE'],
      },
    },
  });

  const medecin = await prisma.utilisateur.findFirst({
    where: {
      login: 'admin@clinique.fr',
    },
  });

  if (patients.length === 0) throw new Error('Aucun patient trouvé.');
  if (motifs.length === 0) throw new Error('Aucun motif trouvé.');
  if (produits.length === 0) throw new Error('Aucun produit pharmacie trouvé.');

  let index = 1;

  for (const patient of patients) {
    const constantes = {
      temperature: '38.5',
      tension: '12/8',
      poids: '70',
      taille: '175',
      pouls: '85',
      saturation: '98',
    };

    const consultation = await prisma.consultation.create({
      data: {
        patientId: patient.id_patient,
        medecinId: medecin?.idUser || null,
        constantes: JSON.stringify(constantes),
        diagnostic: index === 1 ? 'PALUDISME SIMPLE' : 'SYNDROME FÉBRILE',
        compteRendu:
          'Patient reçu en consultation. État général stable. Traitement instauré et contrôle conseillé.',

        motifs: {
          create: motifs.slice(0, 2).map((motif) => ({
            motifId: motif.idMotif,
          })),
        },

        antecedentsMedicaux: {
          create: antecedents.slice(0, 1).map((antecedent) => ({
            antecedentId: antecedent.idAntecedent,
          })),
        },

        prescriptions: {
          create: {
            statut: 'en_attente',
            lignes: {
              create: produits.map((produit) => ({
                produitId: produit.idProduit,
                quantite: 1,
                posologie:
                  produit.nomProduit === 'PARACÉTAMOL'
                    ? '1 comprimé matin et soir'
                    : 'Selon protocole médical',
                duree: '5 jours',
                statut: 'en_attente',
              })),
            },
          },
        },
      },
    });

    console.log(`✅ Consultation ${consultation.idConsultation}`);
    index++;
  }

  console.log('🎉 Seed consultations terminé');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed consultations:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });