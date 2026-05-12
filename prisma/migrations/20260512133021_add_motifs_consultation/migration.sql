/*
  Warnings:

  - You are about to drop the column `motif` on the `consultation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "consultation" DROP COLUMN "motif",
ADD COLUMN     "motif_libre" TEXT;

-- CreateTable
CREATE TABLE "motif_consultation" (
    "id_motif" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "categorie" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motif_consultation_pkey" PRIMARY KEY ("id_motif")
);

-- CreateTable
CREATE TABLE "consultation_motif" (
    "consultation_id" INTEGER NOT NULL,
    "motif_id" INTEGER NOT NULL,

    CONSTRAINT "consultation_motif_pkey" PRIMARY KEY ("consultation_id","motif_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "motif_consultation_libelle_key" ON "motif_consultation"("libelle");

-- AddForeignKey
ALTER TABLE "consultation_motif" ADD CONSTRAINT "consultation_motif_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "consultation"("id_consultation") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultation_motif" ADD CONSTRAINT "consultation_motif_motif_id_fkey" FOREIGN KEY ("motif_id") REFERENCES "motif_consultation"("id_motif") ON DELETE RESTRICT ON UPDATE CASCADE;
