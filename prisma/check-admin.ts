import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL manquante');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  console.log('🔍 Vérification admin...\n');

  const user = await prisma.utilisateur.findUnique({
    where: { login: 'admin@clinique.fr' },
  });

  if (!user) {
    console.log('❌ Admin introuvable en base');
    return;
  }

  console.log('✅ Utilisateur trouvé :');
  console.log({
    login: user.login,
    role: user.role,
    actif: user.actif,
  });

  console.log('\n🔐 Vérification mot de passe...');

  const isValid = await bcrypt.compare('Password', user.motDePasse);

  if (!isValid) {
    console.log('❌ Mot de passe INCORRECT');
  } else {
    console.log('✅ Mot de passe CORRECT');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });