import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type LignePrescriptionInput = {
  produitId: number | string;
  quantite?: number | string;
  posologie?: string | null;
  duree?: string | null;
  observations?: string | null;
};

function clean(value: unknown) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function GET() {
  try {
    const prescriptions = await prisma.prescription.findMany({
      orderBy: {
        datePrescription: 'desc',
      },
      include: {
        consultation: {
          include: {
            patient: true,
            medecin: true,
          },
        },
        lignes: {
          include: {
            produit: true,
          },
        },
      },
    });

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error('Erreur GET /api/prescriptions:', error);

    return NextResponse.json(
      {
        error: 'Erreur chargement prescriptions.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const consultationId = Number(body.consultationId);
    const lignes = Array.isArray(body.lignes)
      ? (body.lignes as LignePrescriptionInput[])
      : [];

    if (!consultationId || Number.isNaN(consultationId)) {
      return NextResponse.json(
        { error: 'Consultation invalide.' },
        { status: 400 },
      );
    }

    if (lignes.length === 0) {
      return NextResponse.json(
        { error: 'Aucune ligne de prescription.' },
        { status: 400 },
      );
    }

    const prescription = await prisma.prescription.create({
      data: {
        consultationId,
        statut: 'en_attente',
        lignes: {
          create: lignes.map((ligne) => ({
            produitId: Number(ligne.produitId),
            quantite: Number(ligne.quantite || 1),
            posologie: clean(ligne.posologie),
            duree: clean(ligne.duree),
            observations: clean(ligne.observations),
            statut: 'en_attente',
          })),
        },
      },
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

    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/prescriptions:', error);

    return NextResponse.json(
      {
        error: 'Erreur création prescription.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const prescriptionId = Number(body.prescriptionId);

    if (!prescriptionId || Number.isNaN(prescriptionId)) {
      return NextResponse.json(
        { error: 'Prescription invalide.' },
        { status: 400 },
      );
    }

    const prescription = await prisma.prescription.update({
      where: {
        idPrescription: prescriptionId,
      },
      data: {
        statut: clean(body.statut) || undefined,
      },
      include: {
        lignes: {
          include: {
            produit: true,
          },
        },
        consultation: {
          include: {
            patient: true,
          },
        },
      },
    });

    return NextResponse.json(prescription);
  } catch (error) {
    console.error('Erreur PUT /api/prescriptions:', error);

    return NextResponse.json(
      {
        error: 'Erreur modification prescription.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const prescriptionId = Number(body.prescriptionId);

    if (!prescriptionId || Number.isNaN(prescriptionId)) {
      return NextResponse.json(
        { error: 'Prescription invalide.' },
        { status: 400 },
      );
    }

    await prisma.lignePrescription.deleteMany({
      where: {
        prescriptionId,
      },
    });

    await prisma.prescription.delete({
      where: {
        idPrescription: prescriptionId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Erreur DELETE /api/prescriptions:', error);

    return NextResponse.json(
      {
        error: 'Erreur suppression prescription.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}