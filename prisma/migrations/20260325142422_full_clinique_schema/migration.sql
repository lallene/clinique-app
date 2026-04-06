/*
  Warnings:

  - The primary key for the `Consultation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `Consultation` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Consultation` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Consultation` table. All the data in the column will be lost.
  - The primary key for the `Patient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code_patient]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patient_id` to the `Consultation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Consultation" DROP CONSTRAINT "Consultation_patientId_fkey";

-- AlterTable
ALTER TABLE "Consultation" DROP CONSTRAINT "Consultation_pkey",
DROP COLUMN "date",
DROP COLUMN "id",
DROP COLUMN "patientId",
ADD COLUMN     "antecedents" TEXT,
ADD COLUMN     "compte_rendu" TEXT,
ADD COLUMN     "constantes" TEXT,
ADD COLUMN     "date_consultation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id_consultation" SERIAL NOT NULL,
ADD COLUMN     "medecin_id" INTEGER,
ADD COLUMN     "patient_id" INTEGER NOT NULL,
ADD COLUMN     "prescription" TEXT,
ADD COLUMN     "service_id" INTEGER,
ADD CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id_consultation");

-- AlterTable
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_pkey",
DROP COLUMN "id",
ADD COLUMN     "adresse" TEXT,
ADD COLUMN     "assurance_id" INTEGER,
ADD COLUMN     "code_patient" TEXT,
ADD COLUMN     "dateNaissance" TIMESTAMP(3),
ADD COLUMN     "emploi" TEXT,
ADD COLUMN     "id_patient" SERIAL NOT NULL,
ADD COLUMN     "numero_dossier" TEXT,
ADD COLUMN     "personne_contact" TEXT,
ADD COLUMN     "sexe" TEXT,
ADD CONSTRAINT "Patient_pkey" PRIMARY KEY ("id_patient");

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id_user" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "nom" TEXT,
    "prenom" TEXT,
    "role" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Service" (
    "id_service" SERIAL NOT NULL,
    "nom_service" TEXT NOT NULL,
    "type_service" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id_service")
);

-- CreateTable
CREATE TABLE "Assurance" (
    "id_assurance" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "convention" TEXT,
    "taux_couverture" DOUBLE PRECISION DEFAULT 0,
    "contact" TEXT,

    CONSTRAINT "Assurance_pkey" PRIMARY KEY ("id_assurance")
);

-- CreateTable
CREATE TABLE "Hospitalisation" (
    "id_hospit" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "date_entree" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_sortie" TIMESTAMP(3),
    "diagnostic_entree" TEXT,
    "medecin_responsable" INTEGER,
    "chambre" TEXT,
    "lit" TEXT,
    "statut" TEXT DEFAULT 'en_cours',

    CONSTRAINT "Hospitalisation_pkey" PRIMARY KEY ("id_hospit")
);

-- CreateTable
CREATE TABLE "Examen" (
    "id_examen" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "consultation_id" INTEGER,
    "type_examen" TEXT NOT NULL,
    "resultat" TEXT,
    "statut" TEXT DEFAULT 'demande',
    "date_demande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_realisation" TIMESTAMP(3),
    "date_validation" TIMESTAMP(3),

    CONSTRAINT "Examen_pkey" PRIMARY KEY ("id_examen")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id_facture" SERIAL NOT NULL,
    "numero_facture" TEXT NOT NULL,
    "date_facture" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montant_total" DOUBLE PRECISION NOT NULL,
    "montant_patient" DOUBLE PRECISION,
    "montant_assurance" DOUBLE PRECISION,
    "statut" TEXT DEFAULT 'brouillon',
    "patient_id" INTEGER NOT NULL,
    "assurance_id" INTEGER,
    "cree_par" INTEGER,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id_facture")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id_paiement" SERIAL NOT NULL,
    "date_paiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montant" DOUBLE PRECISION NOT NULL,
    "mode_paiement" TEXT,
    "facture_id" INTEGER NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id_paiement")
);

-- CreateTable
CREATE TABLE "ProduitPharmacie" (
    "id_produit" SERIAL NOT NULL,
    "code_produit" TEXT,
    "nom_produit" TEXT NOT NULL,
    "forme" TEXT,
    "prix_achat" DOUBLE PRECISION NOT NULL,
    "prix_vente" DOUBLE PRECISION NOT NULL,
    "quantite_stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProduitPharmacie_pkey" PRIMARY KEY ("id_produit")
);

-- CreateTable
CREATE TABLE "MvtPharmacie" (
    "id_mvt" SERIAL NOT NULL,
    "produit_id" INTEGER NOT NULL,
    "patient_id" INTEGER,
    "hospit_id" INTEGER,
    "type_mvt" TEXT NOT NULL,
    "qte" DOUBLE PRECISION NOT NULL,
    "date_mvt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MvtPharmacie_pkey" PRIMARY KEY ("id_mvt")
);

-- CreateTable
CREATE TABLE "RendezVous" (
    "id_rdv" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "medecin_id" INTEGER,
    "service_id" INTEGER,
    "date_rdv" TIMESTAMP(3) NOT NULL,
    "statut" TEXT DEFAULT 'planifie',

    CONSTRAINT "RendezVous_pkey" PRIMARY KEY ("id_rdv")
);

-- CreateTable
CREATE TABLE "LogAudit" (
    "id_log" SERIAL NOT NULL,
    "date_action" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateur_id" INTEGER,
    "table_impactee" TEXT NOT NULL,
    "type_action" TEXT NOT NULL,
    "details" TEXT,

    CONSTRAINT "LogAudit_pkey" PRIMARY KEY ("id_log")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_login_key" ON "Utilisateur"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Assurance_nom_key" ON "Assurance"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Facture_numero_facture_key" ON "Facture"("numero_facture");

-- CreateIndex
CREATE UNIQUE INDEX "ProduitPharmacie_code_produit_key" ON "ProduitPharmacie"("code_produit");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_code_patient_key" ON "Patient"("code_patient");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_assurance_id_fkey" FOREIGN KEY ("assurance_id") REFERENCES "Assurance"("id_assurance") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id_patient") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_medecin_id_fkey" FOREIGN KEY ("medecin_id") REFERENCES "Utilisateur"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id_service") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospitalisation" ADD CONSTRAINT "Hospitalisation_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id_patient") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospitalisation" ADD CONSTRAINT "Hospitalisation_medecin_responsable_fkey" FOREIGN KEY ("medecin_responsable") REFERENCES "Utilisateur"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examen" ADD CONSTRAINT "Examen_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id_patient") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examen" ADD CONSTRAINT "Examen_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "Consultation"("id_consultation") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id_patient") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_assurance_id_fkey" FOREIGN KEY ("assurance_id") REFERENCES "Assurance"("id_assurance") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_cree_par_fkey" FOREIGN KEY ("cree_par") REFERENCES "Utilisateur"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_facture_id_fkey" FOREIGN KEY ("facture_id") REFERENCES "Facture"("id_facture") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MvtPharmacie" ADD CONSTRAINT "MvtPharmacie_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "ProduitPharmacie"("id_produit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MvtPharmacie" ADD CONSTRAINT "MvtPharmacie_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id_patient") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MvtPharmacie" ADD CONSTRAINT "MvtPharmacie_hospit_id_fkey" FOREIGN KEY ("hospit_id") REFERENCES "Hospitalisation"("id_hospit") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id_patient") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_medecin_id_fkey" FOREIGN KEY ("medecin_id") REFERENCES "Utilisateur"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id_service") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogAudit" ADD CONSTRAINT "LogAudit_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;
