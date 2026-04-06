import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    await prisma.facture.findMany({
      include: {
        patient: true,
        assurance: true,
        paiements: true,
      },
    })
  );
}

export async function POST(req: Request) {
  const body = await req.json();

  const facture = await prisma.facture.create({
    data: body,
  });

  return NextResponse.json(facture);
}

export async function PUT(req: Request) {
  const body = await req.json();

  return NextResponse.json(
    await prisma.facture.update({
      where: { id_facture: body.id_facture },
      data: body,
    })
  );
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.facture.delete({
    where: { id_facture: id },
  });

  return NextResponse.json({ message: "Facture supprimée" });
}