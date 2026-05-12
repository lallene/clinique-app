import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


//test
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prescriptionId = Number(body.prescriptionId);

    if (!prescriptionId) {
      return NextResponse.json(
        { error: 'ID prescription manquant.' },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const prescription = await tx.prescription.findUnique({
        where: { idPrescription: prescriptionId },
        include: {
          consultation: {
            include: {
              patient: true,
            },
          },
          lignes: {
            include: {
              produit: true,
            },
          },
        },
      });

      if (!prescription) {
        throw new Error('Prescription introuvable.');
      }

      let servedCount = 0;
      let ruptureCount = 0;

      for (const ligne of prescription.lignes) {
        if (ligne.statut === 'servi') continue;

        if (!ligne.produitId || !ligne.produit) {
          await tx.lignePrescription.update({
            where: { idLignePrescription: ligne.idLignePrescription },
            data: { statut: 'rupture' },
          });
          ruptureCount++;
          continue;
        }

        const quantiteDemandee = Math.ceil(Number(ligne.quantite || 1));

        const produit = await tx.produitPharmacie.findUnique({
          where: { idProduit: ligne.produitId },
        });

        if (!produit) {
          await tx.lignePrescription.update({
            where: { idLignePrescription: ligne.idLignePrescription },
            data: { statut: 'rupture' },
          });
          ruptureCount++;
          continue;
        }

        if (produit.quantiteStock < quantiteDemandee) {
          await tx.lignePrescription.update({
            where: { idLignePrescription: ligne.idLignePrescription },
            data: { statut: 'rupture' },
          });
          ruptureCount++;
          continue;
        }

        await tx.produitPharmacie.update({
          where: { idProduit: produit.idProduit },
          data: {
            quantiteStock: {
              decrement: quantiteDemandee,
            },
          },
        });

        await tx.mvtPharmacie.create({
          data: {
            produitId: produit.idProduit,
            patientId: prescription.consultation.patientId,
            typeMvt: 'SORTIE',
            qte: quantiteDemandee,
            motif: 'Délivrance prescription médicale',
            reference: `PRESC-${prescription.idPrescription}`,
          },
        });

        await tx.lignePrescription.update({
          where: { idLignePrescription: ligne.idLignePrescription },
          data: { statut: 'servi' },
        });

        servedCount++;
      }

      const total = prescription.lignes.length;

      const statut =
        servedCount === total
          ? 'servie'
          : servedCount > 0
            ? 'partielle'
            : 'en_attente';

      const updatedPrescription = await tx.prescription.update({
        where: { idPrescription: prescriptionId },
        data: { statut },
        include: {
          lignes: {
            include: {
              produit: true,
            },
          },
        },
      });

      return {
        prescription: updatedPrescription,
        servedCount,
        ruptureCount,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erreur dispense prescription:', error);

    return NextResponse.json(
      {
        error: 'Erreur délivrance prescription.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}