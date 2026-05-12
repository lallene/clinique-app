-- AlterTable
ALTER TABLE "mouvement_pharmacie" ADD COLUMN     "motif" TEXT,
ADD COLUMN     "reference" TEXT;

-- AlterTable
ALTER TABLE "produit_pharmacie" ADD COLUMN     "actif" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "categorie" TEXT,
ADD COLUMN     "date_expiration" TIMESTAMP(3),
ADD COLUMN     "dosage" TEXT,
ADD COLUMN     "fournisseur" TEXT,
ADD COLUMN     "seuil_alerte" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "unite" TEXT,
ALTER COLUMN "prix_achat" SET DEFAULT 0,
ALTER COLUMN "prix_vente" SET DEFAULT 0;
