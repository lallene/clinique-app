'use client';

import { useEffect, useMemo, useState } from 'react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';

import MotifFormModal, { type MotifConsultation } from './motif-form-modal';

export default function MotifsPageClient() {
  const [motifs, setMotifs] = useState<MotifConsultation[]>([]);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedMotif, setSelectedMotif] =
    useState<MotifConsultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchMotifs() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/motifs', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur chargement motifs.');
      }

      setMotifs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setMotifs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMotifs();
  }, []);

  const filteredMotifs = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return motifs;

    return motifs.filter((motif) => {
      return (
        motif.libelle.toLowerCase().includes(q) ||
        (motif.categorie || '').toLowerCase().includes(q)
      );
    });
  }, [motifs, search]);

  const totalActifs = motifs.filter((m) => m.actif).length;
  const totalInactifs = motifs.length - totalActifs;

  function handleCreate() {
    setSelectedMotif(null);
    setOpenModal(true);
  }

  function handleEdit(motif: MotifConsultation) {
    setSelectedMotif(motif);
    setOpenModal(true);
  }

  async function handleDelete(motif: MotifConsultation) {
    if (!motif.idMotif) return;

    const confirmed = window.confirm(`Supprimer le motif "${motif.libelle}" ?`);

    if (!confirmed) return;

    try {
      setError('');

      const response = await fetch('/api/motifs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idMotif: motif.idMotif,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur suppression motif.');
      }

      await fetchMotifs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }

  async function handleSaved() {
    setOpenModal(false);
    setSelectedMotif(null);
    await fetchMotifs();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Total motifs
          </p>
          <p className="mt-3 text-3xl font-black text-slate-900">
            {motifs.length}
          </p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Actifs
          </p>
          <p className="mt-3 text-3xl font-black text-blue-700">
            {totalActifs}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Inactifs
          </p>
          <p className="mt-3 text-3xl font-black text-slate-700">
            {totalInactifs}
          </p>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Liste des motifs
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Motifs disponibles pour les consultations médicales.
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
                placeholder="Rechercher motif ou catégorie..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
            >
              <Plus size={20} />
              Nouveau motif
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-3xl border border-slate-100">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Libellé</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Utilisation</th>
                <th className="px-6 py-4">État</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    Chargement...
                  </td>
                </tr>
              ) : filteredMotifs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Aucun motif enregistré.
                  </td>
                </tr>
              ) : (
                filteredMotifs.map((motif) => (
                  <tr key={motif.idMotif} className="border-t border-slate-100">
                    <td className="px-6 py-4 font-black text-slate-900">
                      {motif.libelle}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-slate-500">
                      {motif.categorie || '-'}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-slate-600">
                      {motif._count?.consultations || 0} consultation(s)
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          motif.actif
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {motif.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(motif)}
                          aria-label="Modifier motif"
                          title="Modifier"
                          className="rounded-xl bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(motif)}
                          aria-label="Supprimer motif"
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

      <MotifFormModal
        key={selectedMotif ? `edit-${selectedMotif.idMotif}` : 'new-motif'}
        open={openModal}
        motif={selectedMotif}
        onClose={() => {
          setOpenModal(false);
          setSelectedMotif(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}