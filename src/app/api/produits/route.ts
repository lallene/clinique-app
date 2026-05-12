import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function clean(value: unknown) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function GET() {
  try {
    const produits = await prisma.produitPharmacie.findMany({
      orderBy: {
        nomProduit: 'asc',
      },
    });

    return NextResponse.json(produits);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Erreur chargement produits.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const produit = await prisma.produitPharmacie.create({
      data: {
        codeProduit: clean(body.codeProduit),

        nomProduit: String(body.nomProduit)
          .trim()
          .toUpperCase(),

        categorie: clean(body.categorie),
        forme: clean(body.forme),
        dosage: clean(body.dosage),
        unite: clean(body.unite),

        prixAchat: Number(body.prixAchat || 0),
        prixVente: Number(body.prixVente || 0),

        quantiteStock: Number(body.quantiteStock || 0),
        seuilAlerte: Number(body.seuilAlerte || 5),

        fournisseur: clean(body.fournisseur),

        dateExpiration: body.dateExpiration
          ? new Date(body.dateExpiration)
          : null,

        actif: body.actif !== false,
      },
    });

    return NextResponse.json(produit, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Erreur création produit.' },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const produit = await prisma.produitPharmacie.update({
      where: {
        idProduit: Number(body.idProduit),
      },

      data: {
        codeProduit: clean(body.codeProduit),

        nomProduit: String(body.nomProduit)
          .trim()
          .toUpperCase(),

        categorie: clean(body.categorie),
        forme: clean(body.forme),
        dosage: clean(body.dosage),
        unite: clean(body.unite),

        prixAchat: Number(body.prixAchat || 0),
        prixVente: Number(body.prixVente || 0),

        seuilAlerte: Number(body.seuilAlerte || 5),

        fournisseur: clean(body.fournisseur),

        dateExpiration: body.dateExpiration
          ? new Date(body.dateExpiration)
          : null,

        actif: Boolean(body.actif),
      },
    });

    return NextResponse.json(produit);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Erreur modification produit.' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    await prisma.produitPharmacie.delete({
      where: {
        idProduit: Number(body.idProduit),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Erreur suppression produit.' },
      { status: 500 },
    );
  }
}