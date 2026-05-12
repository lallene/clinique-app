/*
  Warnings:

  - You are about to drop the column `antecedents` on the `consultation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "consultation" DROP COLUMN "antecedents",
ADD COLUMN     "antecedent_libre" TEXT;

-- CreateTable
CREATE TABLE "antecedent_medical" (
    "id_antecedent" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "categorie" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "antecedent_medical_pkey" PRIMARY KEY ("id_antecedent")
);

-- CreateTable
CREATE TABLE "consultation_antecedent" (
    "consultation_id" INTEGER NOT NULL,
    "antecedent_id" INTEGER NOT NULL,

    CONSTRAINT "consultation_antecedent_pkey" PRIMARY KEY ("consultation_id","antecedent_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "antecedent_medical_libelle_key" ON "antecedent_medical"("libelle");

-- AddForeignKey
ALTER TABLE "consultation_antecedent" ADD CONSTRAINT "consultation_antecedent_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "consultation"("id_consultation") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_antecedent" ADD CONSTRAINT "consultation_antecedent_antecedent_id_fkey" FOREIGN KEY ("antecedent_id") REFERENCES "antecedent_medical"("id_antecedent") ON DELETE RESTRICT ON UPDATE CASCADE;
