'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, Receipt } from 'lucide-react';
import FactureFormModal from './facture-form-modal';

type Facture = {
  idFacture: number;
  numeroFacture: string;
  dateFacture: string;
  montantTotal: number;
  montantPatient?: number | null;
  montantAssurance?: number | null;
  tauxCouverture?: number | null;
  statut?: string | null;
  patient?: {
    nom: string;
    prenoms?: string | null;
  };
  assurance?: {
    nomGarant?: string | null;
    compagnie?: {
      nomCompagnie?: string | null;
    } | null;
  } | null;
  lignes?: unknown[];
};

export default function FacturesPageClient() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchFactures() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/factures', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur chargement factures.');
      }

      setFactures(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFactures();
  }, []);

  const filteredFactures = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return factures;

    return factures.filter((facture) => {
      const patient = `${facture.patient?.prenoms ?? ''} ${facture.patient?.nom ?? ''}`.toLowerCase();
      const assurance = facture.assurance?.compagnie?.nomCompagnie?.toLowerCase() ?? '';

      return (
        facture.numeroFacture.toLowerCase().includes(q) ||
        patient.includes(q) ||
        assurance.includes(q)
      );
    });
  }, [factures, search]);

  const totalFacture = factures.reduce((sum, f) => sum + Number(f.montantTotal || 0), 0);
  const totalAssurance = factures.reduce((sum, f) => sum + Number(f.montantAssurance || 0), 0);
  const totalPatient = factures.reduce((sum, f) => sum + Number(f.montantPatient || 0), 0);

  async function handleDelete(facture: Facture) {
    const confirmed = window.confirm(`Supprimer la facture ${facture.numeroFacture} ?`);

    if (!confirmed) return;

    try {
      const response = await fetch('/api/factures', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idFacture: facture.idFacture }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur suppression facture.');
      }

      await fetchFactures();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }

  async function handleSaved() {
    setOpenModal(false);
    await fetchFactures();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Total facturé
          </p>
          <p className="mt-3 text-3xl font-black text-slate-900">
            {totalFacture.toLocaleString()} FCFA
          </p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Part assurance
          </p>
          <p className="mt-3 text-3xl font-black text-blue-700">
            {totalAssurance.toLocaleString()} FCFA
          </p>
        </div>

        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Part patient
          </p>
          <p className="mt-3 text-3xl font-black text-orange-700">
            {totalPatient.toLocaleString()} FCFA
          </p>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black text-slate-900">
              <Receipt size={26} />
              Registre des factures
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Factures patients et prises en charge assurance.
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
                placeholder="Rechercher facture, patient, assurance..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
            >
              <Plus size={20} />
              Nouvelle facture
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
                <th className="px-6 py-4">Facture</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Assurance</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Assurance</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    Chargement...
                  </td>
                </tr>
              ) : filteredFactures.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    Aucune facture enregistrée.
                  </td>
                </tr>
              ) : (
                filteredFactures.map((facture) => (
                  <tr key={facture.idFacture} className="border-t border-slate-100">
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900">{facture.numeroFacture}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(facture.dateFacture).toLocaleDateString('fr-FR')}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-bold">
                      {facture.patient?.prenoms || ''} {facture.patient?.nom || ''}
                    </td>

                    <td className="px-6 py-4">
                      {facture.assurance ? (
                        <div>
                          <p className="font-bold text-blue-700">
                            {facture.assurance.compagnie?.nomCompagnie || 'ASSURANCE'}
                          </p>
                          <p className="text-xs text-slate-400">
                            {facture.tauxCouverture || 0}% - {facture.assurance.nomGarant || '-'}
                          </p>
                        </div>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                          CASH
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 font-black">
                      {Number(facture.montantTotal || 0).toLocaleString()} FCFA
                    </td>

                    <td className="px-6 py-4 font-bold text-orange-700">
                      {Number(facture.montantPatient || 0).toLocaleString()} FCFA
                    </td>

                    <td className="px-6 py-4 font-bold text-blue-700">
                      {Number(facture.montantAssurance || 0).toLocaleString()} FCFA
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        {facture.statut || 'brouillon'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(facture)}
                        aria-label="Supprimer facture"
                        title="Supprimer"
                        className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FactureFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSaved={handleSaved}
      />
    </div>
  );
}