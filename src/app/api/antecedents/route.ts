import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function clean(value: unknown) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function GET() {
  try {
    const antecedents = await prisma.antecedentMedical.findMany({
      orderBy: {
        libelle: 'asc',
      },
      include: {
        _count: {
          select: {
            consultations: true,
          },
        },
      },
    });

    return NextResponse.json(antecedents);
  } catch (error) {
    console.error('Erreur GET /api/antecedents:', error);

    return NextResponse.json(
      { error: 'Erreur chargement antécédents.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const libelle = clean(body.libelle);
    const categorie = clean(body.categorie);

    

    if (!libelle) {
      return NextResponse.json(
        { error: 'Le libellé est obligatoire.' },
        { status: 400 },
      );
    }

      const existingAntecedent = await prisma.antecedentMedical.findFirst({
        where: {
          libelle: libelle.toUpperCase(),
        },
      });

      if (existingAntecedent) {
        return NextResponse.json(
          { error: 'Cet antécédent existe déjà dans la base.' },
          { status: 400 },
        );
      }

    const antecedent = await prisma.antecedentMedical.create({
      data: {
        libelle: libelle.toUpperCase(),
        categorie: categorie ? categorie.toUpperCase() : null,
        actif: body.actif !== false,
      },
    });

    return NextResponse.json(antecedent, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/antecedents:', error);

    return NextResponse.json(
      { error: 'Erreur création antécédent. Vérifie s’il existe déjà.' },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const idAntecedent = Number(body.idAntecedent);
    const libelle = clean(body.libelle);
    const categorie = clean(body.categorie);

    if (!idAntecedent || Number.isNaN(idAntecedent)) {
      return NextResponse.json(
        { error: 'ID antécédent invalide.' },
        { status: 400 },
      );
    }

    if (!libelle) {
      return NextResponse.json(
        { error: 'Le libellé est obligatoire.' },
        { status: 400 },
      );
    }

    const antecedent = await prisma.antecedentMedical.update({
      where: {
        idAntecedent,
      },
      data: {
        libelle: libelle.toUpperCase(),
        categorie: categorie ? categorie.toUpperCase() : null,
        actif: Boolean(body.actif),
      },
    });

    return NextResponse.json(antecedent);
  } catch (error) {
    console.error('Erreur PUT /api/antecedents:', error);

    return NextResponse.json(
      { error: 'Erreur modification antécédent.' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const idAntecedent = Number(body.idAntecedent);

    if (!idAntecedent || Number.isNaN(idAntecedent)) {
      return NextResponse.json(
        { error: 'ID antécédent invalide.' },
        { status: 400 },
      );
    }

    const usageCount = await prisma.consultationAntecedent.count({
      where: {
        antecedentId: idAntecedent,
      },
    });

    if (usageCount > 0) {
      return NextResponse.json(
        {
          error:
            'Impossible de supprimer cet antécédent : il est déjà utilisé dans une consultation. Désactive-le plutôt.',
        },
        { status: 400 },
      );
    }

    await prisma.antecedentMedical.delete({
      where: {
        idAntecedent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE /api/antecedents:', error);

    return NextResponse.json(
      { error: 'Erreur suppression antécédent.' },
      { status: 500 },
    );
  }
}