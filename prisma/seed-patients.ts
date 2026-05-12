import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL manquante');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const patients = [
  {
    nom: 'KOUASSI',
    prenoms: 'Jean Marc',
    sexe: 'M',
    telephone: '+2250700000001',
    quartier: 'Cocody',
    numeroDossier: 'AS-2026-0001',
    assuranceCode: 'ASS-MUGEF-001',
    tauxCouverture: 80,
    matriculeAssure: 'MUG-001',
  },
  {
    nom: 'TRAORE',
    prenoms: 'Aminata',
    sexe: 'F',
    telephone: '+2250700000002',
    quartier: 'Yopougon',
    numeroDossier: 'AS-2026-0002',
    assuranceCode: 'ASS-NSIA-001',
    tauxCouverture: 90,
    matriculeAssure: 'NSIA-002',
  },
  {
    nom: 'KONE',
    prenoms: 'Moussa',
    sexe: 'M',
    telephone: '+2250700000003',
    quartier: 'Abobo',
    numeroDossier: 'NA-2026-0003',
    assuranceCode: null,
    tauxCouverture: 0,
    matriculeAssure: null,
  },
];

async function main() {
  console.log('🌱 Seed patients...');

  for (const item of patients) {
    const assurance = item.assuranceCode
      ? await prisma.assurance.findUnique({
          where: { codeAssurance: item.assuranceCode },
        })
      : null;

    await prisma.patient.upsert({
      where: { numeroDossier: item.numeroDossier },
      update: {
        nom: item.nom,
        prenoms: item.prenoms,
        sexe: item.sexe,
        telephone: item.telephone,
        quartier: item.quartier,
        isAssure: Boolean(assurance),
        assuranceId: assurance?.idAssurance || null,
        tauxCouverture: assurance ? item.tauxCouverture : 0,
        matriculeAssure: item.matriculeAssure,
      },
      create: {
        nom: item.nom,
        prenoms: item.prenoms,
        sexe: item.sexe,
        telephone: item.telephone,
        quartier: item.quartier,
        numeroDossier: item.numeroDossier,
        isAssure: Boolean(assurance),
        assuranceId: assurance?.idAssurance || null,
        tauxCouverture: assurance ? item.tauxCouverture : 0,
        matriculeAssure: item.matriculeAssure,
        age: 30,
        personneContact: '+2250100000000',
      },
    });

    console.log(`✅ ${item.numeroDossier} ${item.nom}`);
  }

  console.log('🎉 Seed patients terminé');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed patients:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });