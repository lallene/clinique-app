import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const assurances = await prisma.assurance.findMany({
      include: {
        compagnie: true,
      },
      orderBy: {
        nomGarant: 'asc',
      },
    });

    return NextResponse.json(assurances);
  } catch (error) {
    console.error('Erreur GET /api/assurance:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors du chargement des assurances',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}