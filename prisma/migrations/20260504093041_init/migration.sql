/*
  Warnings:

  - A unique constraint covering the columns `[code_assurance]` on the table `assurance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code_compagnie]` on the table `compagnie_assurance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "assurance" ADD COLUMN     "adresse" TEXT,
ADD COLUMN     "bp" TEXT,
ADD COLUMN     "centre_impot" TEXT,
ADD COLUMN     "code_assurance" TEXT,
ADD COLUMN     "compte_contribuable" TEXT,
ADD COLUMN     "controle_facturation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "date_debut_convention" TIMESTAMP(3),
ADD COLUMN     "date_fin_convention" TIMESTAMP(3),
ADD COLUMN     "echeance_reglement" INTEGER DEFAULT 30,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "gestion_bons_pharmacie" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "modele_facture" TEXT DEFAULT 'AUCUN',
ADD COLUMN     "numero_bon_obligatoire" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "observation" TEXT,
ADD COLUMN     "rccm" TEXT,
ADD COLUMN     "regime_fiscal" TEXT,
ADD COLUMN     "statut" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "tarif_special" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taux_couverture" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "telephone" TEXT;

-- AlterTable
ALTER TABLE "compagnie_assurance" ADD COLUMN     "adresse" TEXT,
ADD COLUMN     "code_compagnie" TEXT,
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "telephone" TEXT;

-- AlterTable
ALTER TABLE "facture" ADD COLUMN     "bon_id" INTEGER,
ADD COLUMN     "taux_couverture" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "assurance_tarif" (
    "id_tarif" SERIAL NOT NULL,
    "assurance_id" INTEGER NOT NULL,
    "visite_generaliste" DOUBLE PRECISION DEFAULT 0,
    "visite_specialiste" DOUBLE PRECISION DEFAULT 0,
    "ami" DOUBLE PRECISION DEFAULT 0,
    "surveillance_particuliere" DOUBLE PRECISION DEFAULT 0,
    "soins_intensifs" DOUBLE PRECISION DEFAULT 0,
    "neonatalogie" DOUBLE PRECISION DEFAULT 0,
    "chambre_hospitalisation_mode" TEXT DEFAULT 'tiers_payant',
    "paiement_par_jour" BOOLEAN NOT NULL DEFAULT false,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assurance_tarif_pkey" PRIMARY KEY ("id_tarif")
);

-- CreateTable
CREATE TABLE "bon_prise_en_charge" (
    "id_bon" SERIAL NOT NULL,
    "numero_bon" TEXT NOT NULL,
    "date_emission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_expiration" TIMESTAMP(3),
    "patient_id" INTEGER NOT NULL,
    "assurance_id" INTEGER NOT NULL,
    "montant_autorise" DOUBLE PRECISION,
    "observation" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'valide',

    CONSTRAINT "bon_prise_en_charge_pkey" PRIMARY KEY ("id_bon")
);

-- CreateIndex
CREATE UNIQUE INDEX "bon_prise_en_charge_numero_bon_key" ON "bon_prise_en_charge"("numero_bon");

-- CreateIndex
CREATE UNIQUE INDEX "assurance_code_assurance_key" ON "assurance"("code_assurance");

-- CreateIndex
CREATE UNIQUE INDEX "compagnie_assurance_code_compagnie_key" ON "compagnie_assurance"("code_compagnie");

-- AddForeignKey
ALTER TABLE "assurance_tarif" ADD CONSTRAINT "assurance_tarif_assurance_id_fkey" FOREIGN KEY ("assurance_id") REFERENCES "assurance"("id_assurance") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bon_prise_en_charge" ADD CONSTRAINT "bon_prise_en_charge_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id_patient") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bon_prise_en_charge" ADD CONSTRAINT "bon_prise_en_charge_assurance_id_fkey" FOREIGN KEY ("assurance_id") REFERENCES "assurance"("id_assurance") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facture" ADD CONSTRAINT "facture_bon_id_fkey" FOREIGN KEY ("bon_id") REFERENCES "bon_prise_en_charge"("id_bon") ON DELETE SET NULL ON UPDATE CASCADE;
