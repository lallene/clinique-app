'use client';

import { useEffect, useMemo, useState } from 'react';
import { Eye, Plus, Search, Stethoscope, Trash2 } from 'lucide-react';

import ConsultationFormModal from './consultation-form-modal';
import ConsultationDetailModal from './consultation-detail-modal';

export type Consultation = {
  idConsultation: number;
  dateConsultation: string;
  motifLibre?: string | null;
  antecedents?: string | null;
  constantes?: string | null;
  diagnostic?: string | null;
  prescription?: string | null;
  compteRendu?: string | null;
  patient?: {
    nom: string;
    prenoms?: string | null;
    numeroDossier?: string | null;
  };
  medecin?: {
    nom?: string | null;
    prenom?: string | null;
    login: string;
  } | null;
  motifs?: {
    motif: {
      idMotif: number;
      libelle: string;
      categorie?: string | null;
    };
  }[];
};

export default function ConsultationsPageClient() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);

  async function fetchConsultations() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/consultations', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur chargement consultations.');
      }

      setConsultations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchConsultations();
  }, []);

  const filteredConsultations = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return consultations;

    return consultations.filter((consultation) => {
      const patient = `${consultation.patient?.prenoms || ''} ${consultation.patient?.nom || ''}`.toLowerCase();
      const motifs = consultation.motifs?.map((m) => m.motif.libelle).join(' ').toLowerCase() || '';

      return (
        patient.includes(q) ||
        motifs.includes(q) ||
        (consultation.diagnostic || '').toLowerCase().includes(q) ||
        (consultation.patient?.numeroDossier || '').toLowerCase().includes(q)
      );
    });
  }, [consultations, search]);

  async function handleDelete(consultation: Consultation) {
    const confirmed = window.confirm(
      `Supprimer la consultation du patient ${consultation.patient?.nom || ''} ?`,
    );

    if (!confirmed) return;

    try {
      const response = await fetch('/api/consultations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idConsultation: consultation.idConsultation }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur suppression consultation.');
      }

      await fetchConsultations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }

  async function handleSaved() {
    setOpenForm(false);
    await fetchConsultations();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Consultations
          </p>
          <p className="mt-3 text-3xl font-black text-slate-900">
            {consultations.length}
          </p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Aujourd’hui
          </p>
          <p className="mt-3 text-3xl font-black text-blue-700">
            {
              consultations.filter(
                (c) =>
                  new Date(c.dateConsultation).toLocaleDateString('fr-FR') ===
                  new Date().toLocaleDateString('fr-FR'),
              ).length
            }
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Diagnostics renseignés
          </p>
          <p className="mt-3 text-3xl font-black text-slate-700">
            {consultations.filter((c) => c.diagnostic).length}
          </p>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black text-slate-900">
              <Stethoscope size={26} />
              Registre des consultations
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Historique médical, motifs, constantes et prescriptions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[300px]">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher patient, motif, diagnostic..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={() => setOpenForm(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
            >
              <Plus size={20} />
              Nouvelle consultation
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-3xl border border-slate-100">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Motifs</th>
                <th className="px-6 py-4">Diagnostic</th>
                <th className="px-6 py-4">Médecin</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    Chargement...
                  </td>
                </tr>
              ) : filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Aucune consultation enregistrée.
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((consultation) => (
                  <tr key={consultation.idConsultation} className="border-t border-slate-100">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">
                        {new Date(consultation.dateConsultation).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(consultation.dateConsultation).toLocaleTimeString('fr-FR')}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900">
                        {consultation.patient?.prenoms || ''} {consultation.patient?.nom || ''}
                      </p>
                      <p className="text-xs text-slate-400">
                        {consultation.patient?.numeroDossier || '-'}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex max-w-sm flex-wrap gap-2">
                        {consultation.motifs?.map((item) => (
                          <span
                            key={item.motif.idMotif}
                            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                          >
                            {item.motif.libelle}
                          </span>
                        ))}

                        {consultation.motifLibre && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                            {consultation.motifLibre}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-slate-600">
                      {consultation.diagnostic || '-'}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-slate-600">
                      {consultation.medecin?.prenom || ''} {consultation.medecin?.nom || ''}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedConsultation(consultation)}
                          aria-label="Voir détail consultation"
                          title="Voir détail"
                          className="rounded-xl bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(consultation)}
                          aria-label="Supprimer consultation"
                          title="Supprimer"
                          className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConsultationFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSaved={handleSaved}
      />

      <ConsultationDetailModal
        consultation={selectedConsultation}
        onClose={() => setSelectedConsultation(null)}
      />
    </div>
  );
}