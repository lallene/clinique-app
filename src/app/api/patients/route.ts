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
    const { assuranceData, ...data } = body;

    const isAssure = Boolean(data.isAssure && assuranceData);
    const prefix = isAssure ? 'AS' : 'NA';
    const count = await prisma.patient.count();
    const year = new Date().getFullYear();

    const numeroDossier = `${prefix}-${year}-${(count + 1).toString().padStart(4, '0')}`;

    const assurance = isAssure
      ? await prisma.assurance.create({
          data: {
            compagnieId: Number(assuranceData.compagnieId),
            nomGarant: assuranceData.nomGarant || 'PARTICULIER',
            contact: assuranceData.contact || null,
            convention: assuranceData.convention || null,
          },
        })
      : null;

    const patient = await prisma.patient.create({
      data: {
        nom: data.nom,
        prenoms: data.prenoms || null,
        sexe: data.sexe || null,
        telephone: data.telephone || null,
        quartier: data.quartier || null,
        personneContact: data.personneContact || null,

        dateNaissance: data.dateNaissance ? new Date(data.dateNaissance) : null,

        age: data.age ? Number(data.age) : null,

        numeroDossier,
        isAssure,
        tauxCouverture: isAssure ? Number(assuranceData.tauxCouverture) : 0,
        matriculeAssure: isAssure ? assuranceData.matriculeAssure || null : null,

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
    const { idPatient, assuranceData, ...data } = body;

    if (!idPatient) {
      return NextResponse.json({ error: 'ID patient manquant' }, { status: 400 });
    }

    const isAssure = Boolean(data.isAssure && assuranceData);

    const existingPatient = await prisma.patient.findUnique({
      where: { id_patient: Number(idPatient) },
      include: { assurance: true },
    });

    if (!existingPatient) {
      return NextResponse.json({ error: 'Patient introuvable' }, { status: 404 });
    }

    let assuranceId: number | null = existingPatient.assuranceId ?? null;

    if (isAssure) {
      if (assuranceId) {
        const updatedAssurance = await prisma.assurance.update({
          where: { idAssurance: assuranceId },
          data: {
            compagnieId: Number(assuranceData.compagnieId),
            nomGarant: assuranceData.nomGarant || 'PARTICULIER',
            contact: assuranceData.contact || null,
            convention: assuranceData.convention || null,
          },
        });

        assuranceId = updatedAssurance.idAssurance;
      } else {
        const newAssurance = await prisma.assurance.create({
          data: {
            compagnieId: Number(assuranceData.compagnieId),
            nomGarant: assuranceData.nomGarant || 'PARTICULIER',
            contact: assuranceData.contact || null,
            convention: assuranceData.convention || null,
          },
        });

        assuranceId = newAssurance.idAssurance;
      }
    } else {
      assuranceId = null;
    }

    const patient = await prisma.patient.update({
      where: { id_patient: Number(idPatient) },
      data: {
        nom: data.nom,
        prenoms: data.prenoms || null,
        sexe: data.sexe || null,
        telephone: data.telephone || null,
        quartier: data.quartier || null,
        personneContact: data.personneContact || null,
        dateNaissance: data.dateNaissance ? new Date(data.dateNaissance) : null,
        age: data.age ? Number(data.age) : null,

        isAssure,
        tauxCouverture: isAssure ? Number(assuranceData.tauxCouverture) : 0,
        matriculeAssure: isAssure ? assuranceData.matriculeAssure || null : null,
        assuranceId,
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
      where: { id_patient: Number(id) },
    });

    return NextResponse.json({ message: 'Patient supprimé' });
  } catch (error) {
    console.error('❌ DELETE /api/patients:', error);
    return NextResponse.json({ error: 'Erreur de suppression' }, { status: 500 });
  }
}
