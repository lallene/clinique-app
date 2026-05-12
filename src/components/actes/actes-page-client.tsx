'use client';

import { useEffect, useState } from 'react';

import { Edit, Plus, Trash2 } from 'lucide-react';

import ActeFormModal from './acte-form-modal';

type ActeMedical = {
  idActe?: number;

  libelle: string;
  categorie: string;

  cotation?: string | null;

  prixUnitaire: number;

  forfait: boolean;

  etat: string;
};

export default function ActesPageClient() {
  const [actes, setActes] = useState<ActeMedical[]>([]);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [selectedActe, setSelectedActe] =
    useState<ActeMedical | null>(null);

  async function fetchActes() {
    try {
      setLoading(true);

      const response = await fetch('/api/actes');

      const data = await response.json();

      setActes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      setActes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchActes();
  }, []);

  async function handleDelete(acte: ActeMedical) {
    if (!acte.idActe) return;

    const confirmed = window.confirm(
      `Supprimer l'acte "${acte.libelle}" ?`,
    );

    if (!confirmed) return;

    try {
      await fetch('/api/actes', {
        method: 'DELETE',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          idActe: acte.idActe,
        }),
      });

      await fetchActes();
    } catch (error) {
      console.error(error);
    }
  }

  function handleEdit(acte: ActeMedical) {
    setSelectedActe(acte);

    setOpenModal(true);
  }

  function handleCreate() {
    setSelectedActe(null);

    setOpenModal(true);
  }

  async function handleSaved() {
    setOpenModal(false);

    setSelectedActe(null);

    await fetchActes();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Catalogue des actes
            </h2>

            <p className="text-sm text-slate-500">
              Gestion des prestations médicales
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            aria-label="Créer un acte"
            title="Créer acte"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
          >
            <Plus size={18} />
            Nouvel acte
          </button>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-100">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Libellé</th>

                <th className="px-6 py-4">Catégorie</th>

                <th className="px-6 py-4">Cotation</th>

                <th className="px-6 py-4">Prix</th>

                <th className="px-6 py-4">Forfait</th>

                <th className="px-6 py-4">État</th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center"
                  >
                    Chargement...
                  </td>
                </tr>
              ) : actes.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center"
                  >
                    Aucun acte enregistré
                  </td>
                </tr>
              ) : (
                actes.map((acte) => (
                  <tr
                    key={acte.idActe}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-4 font-bold">
                      {acte.libelle}
                    </td>

                    <td className="px-6 py-4">
                      {acte.categorie}
                    </td>

                    <td className="px-6 py-4">
                      {acte.cotation || '-'}
                    </td>

                    <td className="px-6 py-4 font-bold text-emerald-600">
                      {acte.prixUnitaire.toLocaleString()} FCFA
                    </td>

                    <td className="px-6 py-4">
                      {acte.forfait ? 'Oui' : 'Non'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          acte.etat === 'actif'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {acte.etat}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(acte)}
                          aria-label="Modifier acte"
                          title="Modifier"
                          className="rounded-xl bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(acte)}
                          aria-label="Supprimer acte"
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

      <ActeFormModal
        open={openModal}
        acte={selectedActe}
        onClose={() => {
          setOpenModal(false);

          setSelectedActe(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}