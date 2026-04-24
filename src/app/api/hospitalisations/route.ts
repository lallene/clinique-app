import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    await prisma.hospitalisation.findMany({
      include: {
        patient: true,
        medecin: true,
      },
    }),
  );
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json(await prisma.hospitalisation.create({ data: body }));
}

export async function PUT(req: Request) {
  const body = await req.json();
  return NextResponse.json(
    await prisma.hospitalisation.update({
      where: { idHospit: body.id_hospit },
      data: body,
    }),
  );
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.hospitalisation.delete({
    where: { idHospit: id },
  });

  return NextResponse.json({ message: 'Supprimé' });
}
