import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    await prisma.rendezVous.findMany({
      include: {
        patient: true,
        medecin: true,
        service: true,
      },
    })
  );
}

export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json(
    await prisma.rendezVous.create({ data: body })
  );
}

export async function PUT(req: Request) {
  const body = await req.json();

  return NextResponse.json(
    await prisma.rendezVous.update({
      where: { id_rdv: body.id_rdv },
      data: body,
    })
  );
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.rendezVous.delete({
    where: { id_rdv: id },
  });

  return NextResponse.json({ message: "RDV supprimé" });
}