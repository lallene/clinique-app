-- CreateTable
CREATE TABLE "acte_medical" (
    "id_acte" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "cotation" TEXT,
    "quantite_base" DOUBLE PRECISION DEFAULT 1,
    "prix_unitaire" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valeur" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "categorie" TEXT NOT NULL,
    "forfait" BOOLEAN NOT NULL DEFAULT false,
    "etat" TEXT NOT NULL DEFAULT 'actif',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acte_medical_pkey" PRIMARY KEY ("id_acte")
);

-- CreateTable
CREATE TABLE "ligne_facture" (
    "id_ligne" SERIAL NOT NULL,
    "facture_id" INTEGER NOT NULL,
    "acte_id" INTEGER,
    "designation" TEXT NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "prix_unitaire" DOUBLE PRECISION NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ligne_facture_pkey" PRIMARY KEY ("id_ligne")
);

-- AddForeignKey
ALTER TABLE "ligne_facture" ADD CONSTRAINT "ligne_facture_facture_id_fkey" FOREIGN KEY ("facture_id") REFERENCES "facture"("id_facture") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ligne_facture" ADD CONSTRAINT "ligne_facture_acte_id_fkey" FOREIGN KEY ("acte_id") REFERENCES "acte_medical"("id_acte") ON DELETE SET NULL ON UPDATE CASCADE;
