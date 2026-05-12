import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function normalizeString(value: unknown) {
  if (typeof value !== 'string') return null;

  const cleaned = value.trim();

  return cleaned.length > 0 ? cleaned : null;
}

function normalizeBoolean(value: unknown) {
  return value === true || value === 'true';
}

export async function GET() {
  try {
    const actes = await prisma.acteMedical.findMany({
      orderBy: {
        libelle: 'asc',
      },
    });

    return NextResponse.json(actes);
  } catch (error) {
    console.error('Erreur récupération actes:', error);

    return NextResponse.json(
      { error: 'Erreur récupération actes' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const libelle = normalizeString(body.libelle);
    const categorie = normalizeString(body.categorie);
    const cotation = normalizeString(body.cotation);
    const etat = normalizeString(body.etat) ?? 'actif';

    const prixUnitaire = Number(body.prixUnitaire);
    const quantiteBase = body.quantiteBase ? Number(body.quantiteBase) : 1;
    const valeur = body.valeur ? Number(body.valeur) : prixUnitaire;

    if (!libelle) {
      return NextResponse.json(
        { error: 'Le libellé est obligatoire.' },
        { status: 400 },
      );
    }

    if (!categorie) {
      return NextResponse.json(
        { error: 'La catégorie est obligatoire.' },
        { status: 400 },
      );
    }

    if (Number.isNaN(prixUnitaire) || prixUnitaire < 0) {
      return NextResponse.json(
        { error: 'Le prix unitaire est invalide.' },
        { status: 400 },
      );
    }

    if (Number.isNaN(quantiteBase) || quantiteBase <= 0) {
      return NextResponse.json(
        { error: 'La quantité de base est invalide.' },
        { status: 400 },
      );
    }

    if (Number.isNaN(valeur) || valeur < 0) {
      return NextResponse.json(
        { error: 'La valeur est invalide.' },
        { status: 400 },
      );
    }

    const acte = await prisma.acteMedical.create({
      data: {
        libelle: libelle.toUpperCase(),
        categorie: categorie.toUpperCase(),
        cotation: cotation ? cotation.toUpperCase() : null,
        quantiteBase,
        prixUnitaire,
        valeur,
        forfait: normalizeBoolean(body.forfait),
        etat: etat.toLowerCase(),
      },
    });

    return NextResponse.json(acte, { status: 201 });
  } catch (error) {
    console.error('Erreur création acte:', error);

    return NextResponse.json(
      { error: 'Erreur création acte. Vérifie la console serveur.' },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const idActe = Number(body.idActe);

    if (!idActe || Number.isNaN(idActe)) {
      return NextResponse.json(
        { error: 'ID acte invalide.' },
        { status: 400 },
      );
    }

    const libelle = normalizeString(body.libelle);
    const categorie = normalizeString(body.categorie);
    const cotation = normalizeString(body.cotation);
    const etat = normalizeString(body.etat) ?? 'actif';

    const prixUnitaire = Number(body.prixUnitaire);
    const quantiteBase = body.quantiteBase ? Number(body.quantiteBase) : 1;
    const valeur = body.valeur ? Number(body.valeur) : prixUnitaire;

    if (!libelle) {
      return NextResponse.json(
        { error: 'Le libellé est obligatoire.' },
        { status: 400 },
      );
    }

    if (!categorie) {
      return NextResponse.json(
        { error: 'La catégorie est obligatoire.' },
        { status: 400 },
      );
    }

    if (Number.isNaN(prixUnitaire) || prixUnitaire < 0) {
      return NextResponse.json(
        { error: 'Le prix unitaire est invalide.' },
        { status: 400 },
      );
    }

    const acte = await prisma.acteMedical.update({
      where: {
        idActe,
      },
      data: {
        libelle: libelle.toUpperCase(),
        categorie: categorie.toUpperCase(),
        cotation: cotation ? cotation.toUpperCase() : null,
        quantiteBase,
        prixUnitaire,
        valeur,
        forfait: normalizeBoolean(body.forfait),
        etat: etat.toLowerCase(),
      },
    });

    return NextResponse.json(acte);
  } catch (error) {
    console.error('Erreur modification acte:', error);

    return NextResponse.json(
      { error: 'Erreur modification acte. Vérifie la console serveur.' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const idActe = Number(body.idActe);

    if (!idActe || Number.isNaN(idActe)) {
      return NextResponse.json(
        { error: 'ID acte invalide.' },
        { status: 400 },
      );
    }

    const lignesLiees = await prisma.ligneFacture.count({
      where: {
        acteId: idActe,
      },
    });

    if (lignesLiees > 0) {
      return NextResponse.json(
        {
          error:
            'Impossible de supprimer cet acte : il est déjà utilisé dans une facture. Passe-le plutôt en inactif.',
        },
        { status: 400 },
      );
    }

    await prisma.acteMedical.delete({
      where: {
        idActe,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Erreur suppression acte:', error);

    return NextResponse.json(
      { error: 'Erreur suppression acte. Vérifie la console serveur.' },
      { status: 500 },
    );
  }
}