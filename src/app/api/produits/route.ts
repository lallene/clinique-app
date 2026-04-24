import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(await prisma.produitPharmacie.findMany());
}

export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json(await prisma.produitPharmacie.create({ data: body }));
}

export async function PUT(req: Request) {
  const body = await req.json();

  return NextResponse.json(
    await prisma.produitPharmacie.update({
      where: { idProduit: body.id_produit },
      data: body,
    }),
  );
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.produitPharmacie.delete({
    where: { idProduit: id },
  });

  return NextResponse.json({ message: 'Produit supprimé' });
}
