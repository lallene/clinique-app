import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const mouvements = await prisma.mvtPharmacie.findMany({
      include: {
        produit: true,
        patient: true,
      },

      orderBy: {
        dateMvt: 'desc',
      },

      take: 100,
    });

    return NextResponse.json(mouvements);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Erreur chargement mouvements.' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const produitId = Number(body.produitId);
    const qte = Number(body.qte);
    const typeMvt = String(body.typeMvt);

    const produit = await prisma.produitPharmacie.findUnique({
      where: {
        idProduit: produitId,
      },
    });

    if (!produit) {
      return NextResponse.json(
        { error: 'Produit introuvable.' },
        { status: 404 },
      );
    }

    let nouveauStock = produit.quantiteStock;

    if (typeMvt === 'ENTREE') {
      nouveauStock += qte;
    }

    if (typeMvt === 'SORTIE') {
      nouveauStock -= qte;

      if (nouveauStock < 0) {
        return NextResponse.json(
          { error: 'Stock insuffisant.' },
          { status: 400 },
        );
      }
    }

    if (typeMvt === 'AJUSTEMENT') {
      nouveauStock = qte;
    }

    const mouvement = await prisma.mvtPharmacie.create({
      data: {
        produitId,
        qte,
        typeMvt,

        motif: body.motif || null,
        reference: body.reference || null,
      },

      include: {
        produit: true,
      },
    });

    await prisma.produitPharmacie.update({
      where: {
        idProduit: produitId,
      },

      data: {
        quantiteStock: nouveauStock,
      },
    });

    return NextResponse.json(mouvement, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Erreur mouvement stock.' },
      { status: 500 },
    );
  }
}