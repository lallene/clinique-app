import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  try {
    const compagnies = await prisma.compagnieAssurance.findMany({
      orderBy: {
        nomCompagnie: 'asc',
      },
    });

    return NextResponse.json(compagnies);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des compagnies.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.nomCompagnie) {
      return NextResponse.json(
        { error: 'Nom de compagnie obligatoire.' },
        { status: 400 },
      );
    }

    const compagnie = await prisma.compagnieAssurance.upsert({
      where: {
        nomCompagnie: String(body.nomCompagnie).trim().toUpperCase(),
      },
      update: {},
      create: {
        nomCompagnie: String(body.nomCompagnie).trim().toUpperCase(),
      },
    });

    return NextResponse.json(compagnie, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la compagnie.' },
      { status: 500 },
    );
  }
}