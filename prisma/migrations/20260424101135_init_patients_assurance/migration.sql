/*
  Warnings:

  - You are about to drop the column `nom` on the `Assurance` table. All the data in the column will be lost.
  - You are about to drop the column `taux_couverture` on the `Assurance` table. All the data in the column will be lost.
  - You are about to drop the column `adresse` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nom_garant]` on the table `Assurance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numero_dossier]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nom_garant` to the `Assurance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Assurance_nom_key";

-- AlterTable
ALTER TABLE "Assurance" DROP COLUMN "nom",
DROP COLUMN "taux_couverture",
ADD COLUMN     "nom_garant" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "adresse",
DROP COLUMN "prenom",
ADD COLUMN     "adresse_complete" TEXT,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "is_assure" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "matricule_assure" TEXT,
ADD COLUMN     "prenoms" TEXT,
ADD COLUMN     "quartier" TEXT,
ADD COLUMN     "taux_couverture" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Assurance_nom_garant_key" ON "Assurance"("nom_garant");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_numero_dossier_key" ON "Patient"("numero_dossier");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
