import 'dotenv/config';
import { defineConfig } from '@prisma/config'; // Vérifie bien l'import @prisma/config

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Utilise directement process.env pour être certain de la lecture
    url: process.env.DATABASE_URL,
  },
  // Le seed se place généralement ici en Prisma 7
  seed: 'ts-node prisma/seed.ts',
});
