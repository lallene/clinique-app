import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const assurances = await prisma.assurance.findMany({
      orderBy: { nom_garant: 'asc' },
    });
    return NextResponse.json(assurances);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur de récupération' }, { status: 500 });
  }
}
