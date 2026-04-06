import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all patients
export async function GET() {
  const patients = await prisma.patient.findMany({
    include: {
      assurance: true,
    },
  });
  return NextResponse.json(patients);
}

// CREATE patient
export async function POST(req: Request) {
  const body = await req.json();

  const patient = await prisma.patient.create({
    data: body,
  });

  return NextResponse.json(patient);
}

// UPDATE patient
export async function PUT(req: Request) {
  const body = await req.json();

  const patient = await prisma.patient.update({
    where: { id_patient: body.id_patient },
    data: body,
  });

  return NextResponse.json(patient);
}

// DELETE patient
export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.patient.delete({
    where: { id_patient: id },
  });

  return NextResponse.json({ message: "Patient supprimé" });
}