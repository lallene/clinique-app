import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

function canManageAssurance(role?: string | null) {
  return ['administrateur', 'direction', 'caisse', 'USER'].includes(role || '');
}

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  try {
    const assurances = await prisma.assurance.findMany({
      orderBy: {
        idAssurance: 'desc',
      },
      include: {
        compagnie: true,
        patients: {
          select: {
            id_patient: true,
            nom: true,
            prenoms: true,
          },
        },
        factures: {
          select: {
            idFacture: true,
            montantTotal: true,
            statut: true,
          },
        },
      },
    });

    return NextResponse.json(assurances);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des assurances.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !canManageAssurance(session.user?.role)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });
  }

  try {
    const body = await request.json();

    const assurance = await prisma.assurance.create({
      data: {
        compagnieId: Number(body.compagnieId),
        nomGarant: String(body.nomGarant).toUpperCase(),
        codeAssurance: body.codeAssurance || null,
        contact: body.contact || null,
        telephone: body.telephone || null,
        email: body.email || null,
        adresse: body.adresse || null,
        convention: body.convention || null,
        tauxCouverture: Number(body.tauxCouverture || 0),
        echeanceReglement: Number(body.echeanceReglement || 30),
        controleFacturation: Boolean(body.controleFacturation),
        numeroBonObligatoire: Boolean(body.numeroBonObligatoire),
        gestionBonsPharmacie: Boolean(body.gestionBonsPharmacie),
        tarifSpecial: Boolean(body.tarifSpecial),
        modeleFacture: body.modeleFacture || 'AUCUN',
        statut: body.statut || 'active',
        observation: body.observation || null,
      },
      include: {
        compagnie: true,
      },
    });

    return NextResponse.json(assurance, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'assurance." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session || !canManageAssurance(session.user?.role)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.idAssurance) {
      return NextResponse.json(
        { error: 'ID assurance manquant.' },
        { status: 400 },
      );
    }

    const assurance = await prisma.assurance.update({
      where: {
        idAssurance: Number(body.idAssurance),
      },
      data: {
        compagnieId: Number(body.compagnieId),
        nomGarant: String(body.nomGarant).toUpperCase(),
        codeAssurance: body.codeAssurance || null,
        contact: body.contact || null,
        telephone: body.telephone || null,
        email: body.email || null,
        adresse: body.adresse || null,
        convention: body.convention || null,
        tauxCouverture: Number(body.tauxCouverture || 0),
        echeanceReglement: Number(body.echeanceReglement || 30),
        controleFacturation: Boolean(body.controleFacturation),
        numeroBonObligatoire: Boolean(body.numeroBonObligatoire),
        gestionBonsPharmacie: Boolean(body.gestionBonsPharmacie),
        tarifSpecial: Boolean(body.tarifSpecial),
        modeleFacture: body.modeleFacture || 'AUCUN',
        statut: body.statut || 'active',
        observation: body.observation || null,
      },
      include: {
        compagnie: true,
      },
    });

    return NextResponse.json(assurance);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'assurance." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session || !canManageAssurance(session.user?.role)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.idAssurance) {
      return NextResponse.json(
        { error: 'ID assurance manquant.' },
        { status: 400 },
      );
    }

    const linkedPatients = await prisma.patient.count({
      where: {
        assuranceId: Number(body.idAssurance),
      },
    });

    if (linkedPatients > 0) {
      return NextResponse.json(
        {
          error:
            'Impossible de supprimer cette assurance : des patients y sont rattachés.',
        },
        { status: 400 },
      );
    }

    await prisma.assurance.delete({
      where: {
        idAssurance: Number(body.idAssurance),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'assurance." },
      { status: 500 },
    );
  }
}