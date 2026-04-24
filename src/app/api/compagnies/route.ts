import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const compagnies = await prisma.compagnieAssurance.findMany({
      orderBy: {
        nomCompagnie: 'asc',
      },
    });

    return NextResponse.json(compagnies);
  } catch (error) {
    console.error('Erreur GET /api/compagnies:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des compagnies' },
      { status: 500 },
    );
  }
}
