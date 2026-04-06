import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
  log: ["query", "warn", "error"],
});

async function main() {
  const hashedPassword = await bcrypt.hash("Password", 10);

  const admin = await prisma.utilisateur.upsert({
    where: { login: "admin@clinique.fr" },
    update: {
      mot_de_passe: hashedPassword,
      nom: "Lallène",
      prenom: "Cédric ACHI",
      role: "administrateur",
      actif: true,
    },
    create: {
      login: "admin@clinique.fr",
      mot_de_passe: hashedPassword,
      nom: "Lallène",
      prenom: "Cédric ACHI",
      role: "administrateur",
      actif: true,
    },
  });

  console.log("✅ Utilisateur admin créé :", admin.login);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });