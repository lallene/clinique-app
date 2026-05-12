import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function generateNumeroFacture() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `FAC-${year}-${random}`;
}

export async function GET() {
  try {
    const factures = await prisma.facture.findMany({
      orderBy: { idFacture: 'desc' },
      include: {
        patient: true,
        assurance: {
          include: {
            compagnie: true,
          },
        },
        lignes: {
          include: {
            acte: true,
          },
        },
        paiements: true,
      },
    });

    return NextResponse.json(factures);
  } catch (error) {
    console.error('Erreur récupération factures:', error);

    return NextResponse.json(
      { error: 'Erreur récupération factures.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const patientId = Number(body.patientId);
    const lignes = Array.isArray(body.lignes) ? body.lignes : [];

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient obligatoire.' },
        { status: 400 },
      );
    }

    if (lignes.length === 0) {
      return NextResponse.json(
        { error: 'Ajoutez au moins un acte à la facture.' },
        { status: 400 },
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id_patient: patientId },
      include: {
        assurance: true,
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient introuvable.' },
        { status: 404 },
      );
    }
    
    const montantTotal = lignes.reduce(
      (
        total: number,
        ligne: {
          quantite: number;
          prixUnitaire: number;
        },
      ) => {
        const quantite = Number(ligne.quantite || 1);
        const prixUnitaire = Number(ligne.prixUnitaire || 0);

        return total + quantite * prixUnitaire;
      },
      0,
    );

    const tauxCouverture =
      patient.isAssure && patient.assuranceId
        ? Number(patient.tauxCouverture || patient.assurance?.tauxCouverture || 0)
        : 0;

    const montantAssurance = Math.round(montantTotal * (tauxCouverture / 100));
    const montantPatient = montantTotal - montantAssurance;

    const facture = await prisma.facture.create({
      data: {
        numeroFacture: generateNumeroFacture(),
        patientId,
        assuranceId: patient.assuranceId,
        montantTotal,
        montantAssurance,
        montantPatient,
        tauxCouverture,
        statut: 'brouillon',

        lignes: {
          create: lignes.map(
            (
              ligne: {
                acteId?: number | null;
                designation: string;
                quantite: number;
                prixUnitaire: number;
              },
            ) => {
              const quantite = Number(ligne.quantite || 1);
              const prixUnitaire = Number(ligne.prixUnitaire || 0);

              return {
                acteId: ligne.acteId ? Number(ligne.acteId) : null,
                designation: String(ligne.designation).trim().toUpperCase(),
                quantite,
                prixUnitaire,
                montant: quantite * prixUnitaire,
              };
            },
          ),
        },
      },
      include: {
        patient: true,
        assurance: {
          include: {
            compagnie: true,
          },
        },
        lignes: true,
        paiements: true,
      },
    });

    return NextResponse.json(facture, { status: 201 });
  } catch (error) {
    console.error('Erreur création facture:', error);

    return NextResponse.json(
      { error: 'Erreur création facture.' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const idFacture = Number(body.idFacture);

    if (!idFacture) {
      return NextResponse.json(
        { error: 'ID facture invalide.' },
        { status: 400 },
      );
    }

    await prisma.ligneFacture.deleteMany({
      where: { factureId: idFacture },
    });

    await prisma.paiement.deleteMany({
      where: { factureId: idFacture },
    });

    await prisma.facture.delete({
      where: { idFacture },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression facture:', error);

    return NextResponse.json(
      { error: 'Erreur suppression facture.' },
      { status: 500 },
    );
  }
}