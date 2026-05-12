'use client';

import { X } from 'lucide-react';
import { type Consultation } from './consultations-page-client';

function parseConstantes(value?: string | null) {
  if (!value) return null;

  try {
    return JSON.parse(value) as Record<string, string | null>;
  } catch {
    return null;
  }
}

type Props = {
  consultation: Consultation | null;
  onClose: () => void;
};

export default function ConsultationDetailModal({ consultation, onClose }: Props) {
  if (!consultation) return null;

  const constantes = parseConstantes(consultation.constantes);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              Détail consultation
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              {new Date(consultation.dateConsultation).toLocaleString('fr-FR')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            title="Fermer"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-xs font-black uppercase text-emerald-700">Patient</p>
            <p className="mt-2 text-xl font-black text-slate-900">
              {consultation.patient?.prenoms || ''} {consultation.patient?.nom || ''}
            </p>
            <p className="text-xs font-bold text-slate-500">
              Dossier : {consultation.patient?.numeroDossier || '-'}
            </p>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-xs font-black uppercase text-blue-700">Motifs</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {consultation.motifs?.map((item) => (
                <span
                  key={item.motif.idMotif}
                  className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700 shadow-sm"
                >
                  {item.motif.libelle}
                </span>
              ))}

              {consultation.motifLibre && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                  {consultation.motifLibre}
                </span>
              )}
            </div>
          </section>

          {constantes && (
            <section className="rounded-3xl border border-red-100 bg-white p-5">
              <p className="text-xs font-black uppercase text-red-600">Constantes</p>

              <div className="mt-4 grid gap-3 md:grid-cols-6">
                {Object.entries(constantes).map(([key, value]) => (
                  <div key={key} className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      {key}
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-900">
                      {value || '-'}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="grid gap-4 md:grid-cols-2">
            <InfoBlock title="Antécédents" value={consultation.antecedents} />
            <InfoBlock title="Diagnostic" value={consultation.diagnostic} />
            <InfoBlock title="Prescription" value={consultation.prescription} />
            <InfoBlock title="Compte rendu" value={consultation.compteRendu} />
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ title, value }: { title: string; value?: string | null }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase text-slate-500">{title}</p>
      <p className="mt-3 whitespace-pre-wrap text-sm font-medium text-slate-700">
        {value || '-'}
      </p>
    </div>
  );
}