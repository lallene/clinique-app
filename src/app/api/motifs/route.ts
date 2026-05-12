import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function clean(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function GET() {
  try {
    const motifs = await prisma.motifConsultation.findMany({
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

    return NextResponse.json(motifs);
  } catch (error) {
    console.error('Erreur GET /api/motifs:', error);

    return NextResponse.json(
      { error: 'Erreur chargement motifs.' },
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

    const motif = await prisma.motifConsultation.create({
      data: {
        libelle: libelle.toUpperCase(),
        categorie: categorie ? categorie.toUpperCase() : null,
        actif: body.actif !== false,
      },
    });

    return NextResponse.json(motif, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/motifs:', error);

    return NextResponse.json(
      { error: 'Erreur création motif. Vérifie s’il existe déjà.' },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const idMotif = Number(body.idMotif);
    const libelle = clean(body.libelle);
    const categorie = clean(body.categorie);

    if (!idMotif || Number.isNaN(idMotif)) {
      return NextResponse.json(
        { error: 'ID motif invalide.' },
        { status: 400 },
      );
    }

    if (!libelle) {
      return NextResponse.json(
        { error: 'Le libellé est obligatoire.' },
        { status: 400 },
      );
    }

    const motif = await prisma.motifConsultation.update({
      where: {
        idMotif,
      },
      data: {
        libelle: libelle.toUpperCase(),
        categorie: categorie ? categorie.toUpperCase() : null,
        actif: Boolean(body.actif),
      },
    });

    return NextResponse.json(motif);
  } catch (error) {
    console.error('Erreur PUT /api/motifs:', error);

    return NextResponse.json(
      { error: 'Erreur modification motif.' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const idMotif = Number(body.idMotif);

    if (!idMotif || Number.isNaN(idMotif)) {
      return NextResponse.json(
        { error: 'ID motif invalide.' },
        { status: 400 },
      );
    }

    const usageCount = await prisma.consultationMotif.count({
      where: {
        motifId: idMotif,
      },
    });

    if (usageCount > 0) {
      return NextResponse.json(
        {
          error:
            'Impossible de supprimer ce motif : il est déjà utilisé dans une consultation. Désactive-le plutôt.',
        },
        { status: 400 },
      );
    }

    await prisma.motifConsultation.delete({
      where: {
        idMotif,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE /api/motifs:', error);

    return NextResponse.json(
      { error: 'Erreur suppression motif.' },
      { status: 500 },
    );
  }
}