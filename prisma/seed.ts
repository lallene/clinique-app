import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL manquante dans .env');
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seed admin...');

  const hashedPassword = await bcrypt.hash('Password', 10);

  const admin = await prisma.utilisateur.upsert({
    where: { login: 'admin@clinique.fr' },
    update: {
      motDePasse: hashedPassword,
      role: 'administrateur',
      actif: true,
    },
    create: {
      login: 'admin@clinique.fr',
      motDePasse: hashedPassword,
      nom: 'ADMIN',
      prenom: 'SYSTEM',
      role: 'administrateur',
      actif: true,
    },
  });

  console.log('✅ Admin prêt :', admin.login);
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });