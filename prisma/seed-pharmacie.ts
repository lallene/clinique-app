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

const produits = [
  {
    codeProduit: 'MED-0001',
    nomProduit: 'PARACÉTAMOL',
    categorie: 'ANTALGIQUE',
    forme: 'COMPRIME',
    dosage: '500mg',
    unite: 'BOITE',
    prixAchat: 500,
    prixVente: 1000,
    quantiteStock: 120,
    seuilAlerte: 10,
    fournisseur: 'PHARMIVOIRE',
  },

  {
    codeProduit: 'MED-0002',
    nomProduit: 'AMOXICILLINE',
    categorie: 'ANTIBIOTIQUE',
    forme: 'GELULE',
    dosage: '500mg',
    unite: 'BOITE',
    prixAchat: 1500,
    prixVente: 2500,
    quantiteStock: 80,
    seuilAlerte: 10,
    fournisseur: 'COPHARMED',
  },

  {
    codeProduit: 'MED-0003',
    nomProduit: 'ARTEMETHER LUMEFANTRINE',
    categorie: 'ANTIPALUDIQUE',
    forme: 'COMPRIME',
    dosage: '80/480mg',
    unite: 'BOITE',
    prixAchat: 1800,
    prixVente: 3500,
    quantiteStock: 45,
    seuilAlerte: 10,
    fournisseur: 'LABOREX',
  },

  {
    codeProduit: 'MED-0004',
    nomProduit: 'CEFTRIAXONE',
    categorie: 'ANTIBIOTIQUE',
    forme: 'INJECTABLE',
    dosage: '1g',
    unite: 'FLACON',
    prixAchat: 2000,
    prixVente: 4000,
    quantiteStock: 30,
    seuilAlerte: 5,
    fournisseur: 'PHARMIVOIRE',
  },

  {
    codeProduit: 'MED-0005',
    nomProduit: 'DICLOFENAC',
    categorie: 'ANTI-INFLAMMATOIRE',
    forme: 'INJECTABLE',
    dosage: '75mg',
    unite: 'AMPOULE',
    prixAchat: 350,
    prixVente: 1000,
    quantiteStock: 60,
    seuilAlerte: 10,
    fournisseur: 'COPHARMED',
  },

  {
    codeProduit: 'MED-0006',
    nomProduit: 'METRONIDAZOLE',
    categorie: 'ANTIBIOTIQUE',
    forme: 'SOLUTION',
    dosage: '500ml',
    unite: 'FLACON',
    prixAchat: 1000,
    prixVente: 2000,
    quantiteStock: 25,
    seuilAlerte: 5,
    fournisseur: 'LABOREX',
  },

  {
    codeProduit: 'MED-0007',
    nomProduit: 'GLUCOSE',
    categorie: 'PERFUSION',
    forme: 'PERFUSION',
    dosage: '500ml',
    unite: 'FLACON',
    prixAchat: 1200,
    prixVente: 2500,
    quantiteStock: 40,
    seuilAlerte: 10,
    fournisseur: 'PHARMIVOIRE',
  },

  {
    codeProduit: 'MED-0008',
    nomProduit: 'SERUM PHYSIOLOGIQUE',
    categorie: 'PERFUSION',
    forme: 'PERFUSION',
    dosage: '500ml',
    unite: 'FLACON',
    prixAchat: 800,
    prixVente: 1800,
    quantiteStock: 75,
    seuilAlerte: 15,
    fournisseur: 'COPHARMED',
  },

  {
    codeProduit: 'MED-0009',
    nomProduit: 'OMEPRAZOLE',
    categorie: 'DIGESTIF',
    forme: 'GELULE',
    dosage: '20mg',
    unite: 'BOITE',
    prixAchat: 1000,
    prixVente: 2200,
    quantiteStock: 50,
    seuilAlerte: 8,
    fournisseur: 'LABOREX',
  },

  {
    codeProduit: 'MED-0010',
    nomProduit: 'SALBUTAMOL',
    categorie: 'RESPIRATOIRE',
    forme: 'SPRAY',
    dosage: '100mcg',
    unite: 'UNITE',
    prixAchat: 2500,
    prixVente: 5000,
    quantiteStock: 18,
    seuilAlerte: 5,
    fournisseur: 'PHARMIVOIRE',
  },

  {
    codeProduit: 'MED-0011',
    nomProduit: 'INSULINE',
    categorie: 'DIABETOLOGIE',
    forme: 'INJECTABLE',
    dosage: '100UI',
    unite: 'FLACON',
    prixAchat: 4500,
    prixVente: 7000,
    quantiteStock: 12,
    seuilAlerte: 5,
    fournisseur: 'NOVOCARE',
  },

  {
    codeProduit: 'MED-0012',
    nomProduit: 'VITAMINE C',
    categorie: 'VITAMINE',
    forme: 'COMPRIME',
    dosage: '500mg',
    unite: 'BOITE',
    prixAchat: 400,
    prixVente: 1000,
    quantiteStock: 90,
    seuilAlerte: 15,
    fournisseur: 'COPHARMED',
  },

  {
    codeProduit: 'MED-0013',
    nomProduit: 'BÉTADINE',
    categorie: 'ANTISEPTIQUE',
    forme: 'SOLUTION',
    dosage: '125ml',
    unite: 'FLACON',
    prixAchat: 700,
    prixVente: 1500,
    quantiteStock: 35,
    seuilAlerte: 5,
    fournisseur: 'LABOREX',
  },

  {
    codeProduit: 'MED-0014',
    nomProduit: 'GANTS MÉDICAUX',
    categorie: 'MATERIEL_MEDICAL',
    forme: 'AUTRE',
    dosage: 'TAILLE M',
    unite: 'BOITE',
    prixAchat: 2500,
    prixVente: 4500,
    quantiteStock: 100,
    seuilAlerte: 20,
    fournisseur: 'MEDICALPRO',
  },

  {
    codeProduit: 'MED-0015',
    nomProduit: 'SERINGUE 10ML',
    categorie: 'MATERIEL_MEDICAL',
    forme: 'AUTRE',
    dosage: '10ML',
    unite: 'BOITE',
    prixAchat: 3000,
    prixVente: 5000,
    quantiteStock: 150,
    seuilAlerte: 20,
    fournisseur: 'MEDICALPRO',
  },
];

async function main() {
  console.log('🌱 Seed pharmacie...');

  for (const produit of produits) {
    await prisma.produitPharmacie.upsert({
      where: {
        codeProduit: produit.codeProduit,
      },

      update: {
        nomProduit: produit.nomProduit,
        categorie: produit.categorie,
        forme: produit.forme,
        dosage: produit.dosage,
        unite: produit.unite,
        prixAchat: produit.prixAchat,
        prixVente: produit.prixVente,
        quantiteStock: produit.quantiteStock,
        seuilAlerte: produit.seuilAlerte,
        fournisseur: produit.fournisseur,
        actif: true,
      },

      create: {
        ...produit,
        actif: true,
      },
    });

    console.log(`✅ ${produit.nomProduit}`);
  }

  console.log('🎉 Seed pharmacie terminé');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed pharmacie:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });