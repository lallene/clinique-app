import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

function clean(value: unknown) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function GET() {
  try {
    const consultations = await prisma.consultation.findMany({
      orderBy: {
        idConsultation: 'desc',
      },

      include: {
        patient: true,
        medecin: true,
        service: true,

        motifs: {
          include: {
            motif: true,
          },
        },

        antecedentsMedicaux: {
          include: {
            antecedent: true,
          },
        },

        prescriptions: {
          include: {
            lignes: {
              include: {
                produit: true,
              },
            },
          },
        },

        examens: true,
      },
    });

    return NextResponse.json(consultations);
  } catch (error) {
    console.error('Erreur GET /api/consultations:', error);

    return NextResponse.json(
      {
        error: 'Erreur chargement consultations.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const patientId = Number(body.patientId);
    const motifIds = Array.isArray(body.motifIds) ? body.motifIds : [];
    const antecedentIds = Array.isArray(body.antecedentIds)
      ? body.antecedentIds
      : [];
    const lignesPrescription = Array.isArray(body.lignesPrescription)
      ? body.lignesPrescription
      : [];

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient obligatoire.' },
        { status: 400 },
      );
    }

    if (motifIds.length === 0) {
      return NextResponse.json(
        { error: 'Veuillez sélectionner au moins un motif.' },
        { status: 400 },
      );
    }

    const medecin = session?.user?.email
      ? await prisma.utilisateur.findUnique({
          where: {
            login: session.user.email,
          },
        })
      : null;

    const constantes = {
      temperature: clean(body.temperature),
      tension: clean(body.tension),
      poids: clean(body.poids),
      taille: clean(body.taille),
      pouls: clean(body.pouls),
      saturation: clean(body.saturation),
    };

    const consultation = await prisma.consultation.create({
      data: {
        patientId,
        medecinId: medecin?.idUser || null,
        serviceId: body.serviceId ? Number(body.serviceId) : null,

        constantes: JSON.stringify(constantes),
        diagnostic: clean(body.diagnostic),
        compteRendu: clean(body.compteRendu),

        motifs: {
          create: motifIds.map((id: number | string) => ({
            motifId: Number(id),
          })),
        },

        antecedentsMedicaux: {
          create: antecedentIds.map((id: number | string) => ({
            antecedentId: Number(id),
          })),
        },

        prescriptions:
          lignesPrescription.length > 0
            ? {
                create: {
                  statut: 'en_attente',
                  lignes: {
                    create: lignesPrescription.map(
                      (ligne: {
                        produitId: number;
                        quantite: number;
                        posologie: string;
                        duree?: string;
                      }) => ({
                        produitId: Number(ligne.produitId),
                        quantite: Number(ligne.quantite || 1),
                        posologie: clean(ligne.posologie),
                        duree: clean(ligne.duree),
                        statut: 'en_attente',
                      }),
                    ),
                  },
                },
              }
            : undefined,
      },

      include: {
        patient: true,
        medecin: true,
        service: true,

        motifs: {
          include: {
            motif: true,
          },
        },

        antecedentsMedicaux: {
          include: {
            antecedent: true,
          },
        },

        prescriptions: {
          include: {
            lignes: {
              include: {
                produit: true,
              },
            },
          },
        },

        examens: true,
      },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/consultations:', error);

    return NextResponse.json(
      {
        error: 'Erreur création consultation.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const idConsultation = Number(body.idConsultation);

    if (!idConsultation) {
      return NextResponse.json(
        { error: 'ID consultation invalide.' },
        { status: 400 },
      );
    }

    await prisma.consultation.delete({
      where: {
        idConsultation,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Erreur DELETE /api/consultations:', error);

    return NextResponse.json(
      {
        error: 'Erreur suppression consultation.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}