/*
  Warnings:

  - You are about to drop the column `prescription` on the `consultation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "consultation" DROP COLUMN "prescription";

-- CreateTable
CREATE TABLE "prescription" (
    "id_prescription" SERIAL NOT NULL,
    "consultation_id" INTEGER NOT NULL,
    "date_prescription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',

    CONSTRAINT "prescription_pkey" PRIMARY KEY ("id_prescription")
);

-- CreateTable
CREATE TABLE "ligne_prescription" (
    "id_ligne_prescription" SERIAL NOT NULL,
    "prescription_id" INTEGER NOT NULL,
    "produit_id" INTEGER,
    "medicament_libre" TEXT,
    "posologie" TEXT,
    "quantite" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "duree" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ligne_prescription_pkey" PRIMARY KEY ("id_ligne_prescription")
);

-- AddForeignKey
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "consultation"("id_consultation") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ligne_prescription" ADD CONSTRAINT "ligne_prescription_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescription"("id_prescription") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ligne_prescription" ADD CONSTRAINT "ligne_prescription_produit_id_fkey" FOREIGN KEY ("produit_id") REFERENCES "produit_pharmacie"("id_produit") ON DELETE SET NULL ON UPDATE CASCADE;
