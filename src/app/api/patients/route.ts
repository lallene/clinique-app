import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        assurance: {
          include: {
            compagnie: true,
          },
        },
      },

      orderBy: {
        id_patient: 'desc',
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Erreur GET /api/patients:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors du chargement des patients',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const isAssure = Boolean(body.isAssure && body.assuranceId);

    const prefix = isAssure ? 'AS' : 'NA';

    const count = await prisma.patient.count();

    const year = new Date().getFullYear();

    const numeroDossier = `${prefix}-${year}-${(count + 1)
      .toString()
      .padStart(4, '0')}`;

    const assurance = isAssure
      ? await prisma.assurance.findUnique({
          where: {
            idAssurance: Number(body.assuranceId),
          },
        })
      : null;

    if (isAssure && !assurance) {
      return NextResponse.json(
        {
          error: 'Convention assurance introuvable',
        },
        { status: 404 },
      );
    }

    const patient = await prisma.patient.create({
      data: {
        nom: body.nom,
        prenoms: body.prenoms || null,
        sexe: body.sexe || null,

        telephone: body.telephone || null,
        quartier: body.quartier || null,
        personneContact: body.personneContact || null,

        dateNaissance: body.dateNaissance
          ? new Date(body.dateNaissance)
          : null,

        age: body.age ? Number(body.age) : null,

        numeroDossier,

        isAssure,

        tauxCouverture: isAssure
          ? Number(body.tauxCouverture || assurance?.tauxCouverture || 0)
          : 0,

        matriculeAssure: isAssure
          ? body.matriculeAssure || null
          : null,

        assuranceId: assurance?.idAssurance || null,
      },

      include: {
        assurance: {
          include: {
            compagnie: true,
          },
        },
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('❌ POST /api/patients:', error);

    return NextResponse.json(
      {
        error: 'Erreur de création',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.idPatient) {
      return NextResponse.json(
        {
          error: 'ID patient manquant',
        },
        { status: 400 },
      );
    }

    const isAssure = Boolean(body.isAssure && body.assuranceId);

    const assurance = isAssure
      ? await prisma.assurance.findUnique({
          where: {
            idAssurance: Number(body.assuranceId),
          },
        })
      : null;

    const patient = await prisma.patient.update({
      where: {
        id_patient: Number(body.idPatient),
      },

      data: {
        nom: body.nom,
        prenoms: body.prenoms || null,
        sexe: body.sexe || null,

        telephone: body.telephone || null,
        quartier: body.quartier || null,
        personneContact: body.personneContact || null,

        dateNaissance: body.dateNaissance
          ? new Date(body.dateNaissance)
          : null,

        age: body.age ? Number(body.age) : null,

        isAssure,

        tauxCouverture: isAssure
          ? Number(body.tauxCouverture || assurance?.tauxCouverture || 0)
          : 0,

        matriculeAssure: isAssure
          ? body.matriculeAssure || null
          : null,

        assuranceId: assurance?.idAssurance || null,
      },

      include: {
        assurance: {
          include: {
            compagnie: true,
          },
        },
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error('❌ PUT /api/patients:', error);

    return NextResponse.json(
      {
        error: 'Erreur de mise à jour',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.patient.delete({
      where: {
        id_patient: Number(id),
      },
    });

    return NextResponse.json({
      message: 'Patient supprimé',
    });
  } catch (error) {
    console.error('❌ DELETE /api/patients:', error);

    return NextResponse.json(
      {
        error: 'Erreur suppression patient',
      },
      { status: 500 },
    );
  }
}