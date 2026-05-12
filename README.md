# Clinique App - Saint Raphaël

Application web complète de gestion de clinique médicale.

## Fonctionnalités

- Authentification sécurisée
- Gestion des patients
- Gestion des assurances et conventions
- Gestion des actes médicaux
- Facturation patient / assurance
- Gestion des motifs de consultation
- Gestion pharmacie
- Gestion stock pharmacie
- Mouvements de stock : entrée, sortie, ajustement
- Déploiement Render
- Base de données PostgreSQL avec Prisma

## Stack technique

- Next.js 16
- React 19
- TypeScript
- Prisma 7
- PostgreSQL / Neon
- NextAuth / Auth.js
- Tailwind CSS
- Lucide React
- Render

## Installation

```bash
git clone https://github.com/ton-compte/clinique-app.git
cd clinique-app
npm install


Commandes Git

Voir les fichiers modifiés : git status
Ajouter les fichiers : git add .
Créer un commit : git commit -m "feat: ajout modules clinique"
Envoyer sur GitHub : git push origin main



Déploiement Render

Build Command : npm install && npx prisma generate && npm run build
Start Command : npm start
Variables Render
    DATABASE_URL="postgresql://..."
    AUTH_SECRET="votre_secret"
    NEXTAUTH_SECRET="votre_secret"
    AUTH_URL="https://cmsaint-raphael.onrender.com"
    NEXTAUTH_URL="https://cmsaint-raphael.onrender.com"
    AUTH_TRUST_HOST=true

Déploiement production Prisma
Après déploiement :  npx prisma migrate deploy
ou si utilisation directe sans migrations : npx prisma db push


Seeds

Seed admin :  npm run seed
Seed motifs : npx tsx prisma/seed-motifs.ts
Seed pharmacie : npx tsx prisma/seed-pharmacie.ts

