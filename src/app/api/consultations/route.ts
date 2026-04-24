import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await prisma.consultation.findMany({
    include: {
      patient: true,
      medecin: true,
      service: true,
      examens: true,
    },
  });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const data = await prisma.consultation.create({
    data: body,
  });

  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const body = await req.json();

  const data = await prisma.consultation.update({
    where: { idConsultation: body.id_consultation },
    data: body,
  });

  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.consultation.delete({
    where: { idConsultation: id },
  });

  return NextResponse.json({ message: 'Consultation supprimée' });
}
