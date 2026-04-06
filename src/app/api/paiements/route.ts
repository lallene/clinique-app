import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await prisma.paiement.findMany());
}

export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json(
    await prisma.paiement.create({ data: body })
  );
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.paiement.delete({
    where: { id_paiement: id },
  });

  return NextResponse.json({ message: "Paiement supprimé" });
}