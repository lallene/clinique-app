/*
  Warnings:

  - You are about to drop the `Assurance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Consultation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Examen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Facture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hospitalisation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LogAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MvtPharmacie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Paiement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProduitPharmacie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RendezVous` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Utilisateur` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Consultation" DROP CONSTRAINT "Consultation_medecin_id_fkey";

-- DropForeignKey
ALTER TABLE "Consultation" DROP CONSTRAINT "Consultation_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "Consultation" DROP CONSTRAINT "Consultation_service_id_fkey";

-- DropForeignKey
ALTER TABLE "Examen" DROP CONSTRAINT "Examen_consultation_id_fkey";

-- DropForeignKey
ALTER TABLE "Examen" DROP CONSTRAINT "Examen_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "Facture" DROP CONSTRAINT "Facture_assurance_id_fkey";

-- DropForeignKey
ALTER TABLE "Facture" DROP CONSTRAINT "Facture_cree_par_fkey";

-- DropForeignKey
ALTER TABLE "Facture" DROP CONSTRAINT "Facture_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "Hospitalisation" DROP CONSTRAINT "Hospitalisation_medecin_responsable_fkey";

-- DropForeignKey
ALTER TABLE "Hospitalisation" DROP CONSTRAINT "Hospitalisation_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "LogAudit" DROP CONSTRAINT "LogAudit_utilisateur_id_fkey";

-- DropForeignKey
ALTER TABLE "MvtPharmacie" DROP CONSTRAINT "MvtPharmacie_hospit_id_fkey";

-- DropForeignKey
ALTER TABLE "MvtPharmacie" DROP CONSTRAINT "MvtPharmacie_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "MvtPharmacie" DROP CONSTRAINT "MvtPharmacie_produit_id_fkey";

-- DropForeignKey
ALTER TABLE "Paiement" DROP CONSTRAINT "Paiement_facture_id_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_assurance_id_fkey";

-- DropForeignKey
ALTER TABLE "RendezVous" DROP CONSTRAINT "RendezVous_medecin_id_fkey";

-- DropForeignKey
ALTER TABLE "RendezVous" DROP CONSTRAINT "RendezVous_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "RendezVous" DROP CONSTRAINT "RendezVous_service_id_fkey";

-- DropTable
DROP TABLE "Assurance";

-- DropTable
DROP TABLE "Consultation";

-- DropTable
DROP TABLE "Examen";

-- DropTable
DROP TABLE "Facture";

-- DropTable
DROP TABLE "Hospitalisation";

-- DropTable
DROP TABLE "LogAudit";

-- DropTable
DROP TABLE "MvtPharmacie";

-- DropTable
DROP TABLE "Paiement";

-- DropTable
DROP TABLE "Patient";

-- DropTable
DROP TABLE "ProduitPharmacie";

-- DropTable
DROP TABLE "RendezVous";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "Utilisateur";

-- CreateTable
CREATE TABLE "utilisateur" (
    "id_user" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "nom" TEXT,
    "prenom" TEXT,
    "role" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "compagnie_assurance" (
    "id_compagnie" SERIAL NOT NULL,
    "nom_compagnie" TEXT NOT NULL,

    CONSTRAINT "compagnie_assurance_pkey" PRIMARY KEY ("id_compagnie")
);

-- CreateTable
CREATE TABLE "assurance" (
    "id_assurance" SERIAL NOT NULL,
    "compagnie_id" INTEGER NOT NULL,
    "nom_garant" TEXT NOT NULL,
    "contact" TEXT,
    "convention" TEXT,

    CONSTRAINT "assurance_pkey" PRIMARY KEY ("id_assurance")
);

-- CreateTable
CREATE TABLE "patient" (
    "id_patient" SERIAL NOT NULL,
    "code_patient" TEXT,
    "nom" TEXT NOT NULL,
    "prenoms" TEXT,
    "sexe" TEXT,
    "date_naissance" TIMESTAMP(3),
    "age" INTEGER,
    "telephone" TEXT,
    "quartier" TEXT,
    "personne_contact" TEXT,
    "numero_dossier" TEXT,
    "is_assure" BOOLEAN NOT NULL DEFAULT false,
    "taux_couverture" DOUBLE PRECISION DEFAULT 0,
    "matricule_assure" TEXT,
    "assurance_id" INTEGER,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id_patient")
);

-- CreateTable
CREATE TABLE "consultation" (
    "id_consultation" SERIAL NOT NULL,
    "date_consultation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motif" TEXT,
    "antecedents" TEXT,
    "constantes" TEXT,
    "diagnostic" TEXT,
    "prescription" TEXT,
    "compte_rendu" TEXT,
    "patient_id" INTEGER NOT NULL,
    "medecin_id" INTEGER,
    "service_id" INTEGER,

    CONSTRAINT "consultation_pkey" PRIMARY KEY ("id_consultation")
);

-- CreateTable
CREATE TABLE "service" (
    "id_service" SERIAL NOT NULL,
    "nom_service" TEXT NOT NULL,
    "type_service" TEXT,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id_service")
);

-- CreateTable
CREATE TABLE "hospitalisation" (
    "id_hospit" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "date_entree" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_sortie" TIMESTAMP(3),
    "diagnostic_entree" TEXT,
    "medecin_responsable" INTEGER,
    "chambre" TEXT,
    "lit" TEXT,
    "statut" TEXT DEFAULT 'en_cours',

    CONSTRAINT "hospitalisation_pkey" PRIMARY KEY ("id_hospit")
);

-- CreateTable
CREATE TABLE "examen" (
    "id_examen" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "consultation_id" INTEGER,
    "type_examen" TEXT NOT NULL,
    "resultat" TEXT,
    "statut" TEXT DEFAULT 'demande',
    "date_demande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_realisation" TIMESTAMP(3),
    "date_validation" TIMESTAMP(3),

    CONSTRAINT "examen_pkey" PRIMARY KEY ("id_examen")
);

-- CreateTable
CREATE TABLE "facture" (
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

    CONSTRAINT "facture_pkey" PRIMARY KEY ("id_facture")
);

-- CreateTable
CREATE TABLE "paiement" (
    "id_paiement" SERIAL NOT NULL,
    "date_paiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montant" DOUBLE PRECISION NOT NULL,
    "mode_paiement" TEXT,
    "facture_id" INTEGER NOT NULL,

    CONSTRAINT "paiement_pkey" PRIMARY KEY ("id_paiement")
);

-- CreateTable
CREATE TABLE "produit_pharmacie" (
    "id_produit" SERIAL NOT NULL,
    "code_produit" TEXT,
    "nom_produit" TEXT NOT NULL,
    "forme" TEXT,
    "prix_achat" DOUBLE PRECISION NOT NULL,
    "prix_vente" DOUBLE PRECISION NOT NULL,
    "quantite_stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "produit_pharmacie_pkey" PRIMARY KEY ("id_produit")
);

-- CreateTable
CREATE TABLE "mouvement_pharmacie" (
    "id_mvt" SERIAL NOT NULL,
    "produit_id" INTEGER NOT NULL,
    "patient_id" INTEGER,
    "hospit_id" INTEGER,
    "type_mvt" TEXT NOT NULL,
    "qte" DOUBLE PRECISION NOT NULL,
    "date_mvt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mouvement_pharmacie_pkey" PRIMARY KEY ("id_mvt")
);

-- CreateTable
CREATE TABLE "rendez_vous" (
    "id_rdv" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "medecin_id" INTEGER,
    "service_id" INTEGER,
    "date_rdv" TIMESTAMP(3) NOT NULL,
    "statut" TEXT DEFAULT 'planifie',

    CONSTRAINT "rendez_vous_pkey" PRIMARY KEY ("id_rdv")
);

-- CreateTable
CREATE TABLE "log_audit" (
    "id_log" SERIAL NOT NULL,
    "date_action" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateur_id" INTEGER,
    "table_impactee" TEXT NOT NULL,
    "type_action" TEXT NOT NULL,
    "details" TEXT,

    CONSTRAINT "log_audit_pkey" PRIMARY KEY ("id_log")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_login_key" ON "utilisateur"("login");

-- CreateIndex
CREATE UNIQUE INDEX "compagnie_assurance_nom_compagnie_key" ON "compagnie_assurance"("nom_compagnie");

-- CreateIndex
CREATE UNIQUE INDEX "patient_code_patient_key" ON "patient"("code_patient");

-- CreateIndex
CREATE UNIQUE INDEX "patient_numero_dossier_key" ON "patient"("numero_dossier");

-- CreateIndex
CREATE UNIQUE INDEX "facture_numero_facture_key" ON "facture"("numero_facture");

-- CreateIndex
CREATE UNIQUE INDEX "produit_pharmacie_code_produit_key" ON "produit_pharmacie"("code_produit");

-- AddForeignKey
ALTER TABLE "assurance" ADD CONSTRAINT "assurance_compagnie_id_fkey" FOREIGN KEY ("compagnie_id") REFERENCES "compagnie_assurance"("id_compagnie") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_assurance_id_fkey" FOREIGN KEY ("assurance_id") REFERENCES "assurance"("id_assurance") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation" ADD CONSTRAINT "consultation_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id_patient") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation" ADD CONSTRAINT "consultation_medecin_id_fkey" FOREIGN KEY ("medecin_id") REFERENCES "utilisateur"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation" ADD CONSTRAINT "consultation_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id_service") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitalisation" ADD CONSTRAINT "hospitalisation_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id_patient") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitalisation" ADD CONSTRAINT "hospitalisation_medecin_responsable_fkey" FOREIGN KEY ("medecin_responsable") REFERENCES "utilisateur"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examen" ADD CONSTRAINT "examen_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id_patient") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examen" ADD CONSTRAINT "examen_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "consultation"("id_consultation") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facture" ADD CONSTRAINT "facture_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id_patient") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facture" ADD CONSTRAINT "facture_assurance_id_fkey" FOREIGN KEY ("assurance_id") REFERENCES "assurance"("id_assurance") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facture" ADD CONSTRAINT "facture_cree_par_fkey" FOREIGN KEY ("cree_par") REFERENCES "utilisateur"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiement" ADD CONSTRAINT "paiement_facture_id_fkey" FOREIGN KEY ("facture_id") REFERENCES "facture"("id_facture") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mouvement_pharmacie" ADD CONSTRAINT "mouvement_pharmacie_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "produit_pharmacie"("id_produit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mouvement_pharmacie" ADD CONSTRAINT "mouvement_pharmacie_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id_patient") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mouvement_pharmacie" ADD CONSTRAINT "mouvement_pharmacie_hospit_id_fkey" FOREIGN KEY ("hospit_id") REFERENCES "hospitalisation"("id_hospit") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rendez_vous" ADD CONSTRAINT "rendez_vous_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id_patient") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rendez_vous" ADD CONSTRAINT "rendez_vous_medecin_id_fkey" FOREIGN KEY ("medecin_id") REFERENCES "utilisateur"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rendez_vous" ADD CONSTRAINT "rendez_vous_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id_service") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_audit" ADD CONSTRAINT "log_audit_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateur"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;
