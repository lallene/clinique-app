'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  AlertTriangle,
  Edit,
  Package2,
  Pill,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

import ProduitFormModal from './produit-form-modal';
import MouvementStockModal from './mouvement-stock-modal';

type Produit = {
  idProduit: number;
  codeProduit?: string | null;

  nomProduit: string;

  categorie?: string | null;
  forme?: string | null;
  dosage?: string | null;
  unite?: string | null;

  prixAchat: number;
  prixVente: number;

  quantiteStock: number;
  seuilAlerte: number;

  fournisseur?: string | null;
  dateExpiration?: string | null;

  actif: boolean;
};

export default function PharmaciePageClient() {
  const [produits, setProduits] = useState<Produit[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [error, setError] = useState('');

  const [openProduitModal, setOpenProduitModal] = useState(false);

  const [selectedProduit, setSelectedProduit] =
    useState<Produit | null>(null);

  const [openMouvementModal, setOpenMouvementModal] = useState(false);

  async function fetchProduits() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/produits', {
        cache: 'no-store',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur chargement produits.');
      }

      setProduits(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setProduits([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProduits();
  }, []);

  const filteredProduits = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return produits;

    return produits.filter((produit) => {
      return (
        produit.nomProduit.toLowerCase().includes(q) ||
        (produit.codeProduit || '').toLowerCase().includes(q) ||
        (produit.categorie || '').toLowerCase().includes(q)
      );
    });
  }, [produits, search]);

  const totalProduits = produits.length;

  const totalStockFaible = produits.filter(
    (p) => p.quantiteStock <= p.seuilAlerte,
  ).length;

  const totalActifs = produits.filter((p) => p.actif).length;

  function handleCreateProduit() {
    setSelectedProduit(null);
    setOpenProduitModal(true);
  }

  function handleEditProduit(produit: Produit) {
    setSelectedProduit(produit);
    setOpenProduitModal(true);
  }

  async function handleDeleteProduit(produit: Produit) {
    const confirmed = window.confirm(
      `Supprimer le produit ${produit.nomProduit} ?`,
    );

    if (!confirmed) return;

    try {
      setError('');

      const response = await fetch('/api/produits', {
        method: 'DELETE',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          idProduit: produit.idProduit,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur suppression produit.');
      }

      await fetchProduits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }

  async function handleSavedProduit() {
    setOpenProduitModal(false);
    setSelectedProduit(null);

    await fetchProduits();
  }

  async function handleSavedMouvement() {
    setOpenMouvementModal(false);

    await fetchProduits();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Package2 size={24} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Produits
            </span>
          </div>

          <p className="mt-4 text-3xl font-black text-slate-900">
            {totalProduits}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Produits enregistrés
          </p>
        </div>

        <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-red-50 p-3 text-red-600">
              <AlertTriangle size={24} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Stock faible
            </span>
          </div>

          <p className="mt-4 text-3xl font-black text-red-700">
            {totalStockFaible}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Produits sous seuil
          </p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <Pill size={24} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Actifs
            </span>
          </div>

          <p className="mt-4 text-3xl font-black text-blue-700">
            {totalActifs}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Produits disponibles
          </p>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Pharmacie
            </h2>

            <p className="text-sm font-medium text-slate-500">
              Gestion des médicaments et produits pharmacie.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[300px]">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher produit..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <button
              type="button"
              onClick={() => setOpenMouvementModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-slate-800"
            >
              <Package2 size={18} />
              Mouvement stock
            </button>

            <button
              type="button"
              onClick={handleCreateProduit}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700"
            >
              <Plus size={18} />
              Nouveau produit
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-3xl border border-slate-100">
          <table className="w-full min-w-[1300px]">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Forme</th>
                <th className="px-6 py-4">Prix vente</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Seuil</th>
                <th className="px-6 py-4">État</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Chargement...
                  </td>
                </tr>
              ) : filteredProduits.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Aucun produit pharmacie enregistré.
                  </td>
                </tr>
              ) : (
                filteredProduits.map((produit) => {
                  const stockFaible =
                    produit.quantiteStock <= produit.seuilAlerte;

                  return (
                    <tr
                      key={produit.idProduit}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-black text-slate-900">
                            {produit.nomProduit}
                          </p>

                          <p className="mt-1 text-xs font-medium text-slate-400">
                            {produit.codeProduit || 'AUCUN CODE'}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-slate-500">
                        {produit.categorie || '-'}
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-slate-500">
                        {produit.forme || '-'}
                      </td>

                      <td className="px-6 py-4 font-black text-slate-900">
                        {Number(produit.prixVente).toLocaleString()} FCFA
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            stockFaible
                              ? 'bg-red-100 text-red-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {produit.quantiteStock}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-slate-500">
                        {produit.seuilAlerte}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            produit.actif
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {produit.actif ? 'ACTIF' : 'INACTIF'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEditProduit(produit)
                            }
                            aria-label="Modifier produit"
                            title="Modifier"
                            className="rounded-xl bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteProduit(produit)
                            }
                            aria-label="Supprimer produit"
                            title="Supprimer"
                            className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProduitFormModal
        key={
          selectedProduit
            ? `edit-${selectedProduit.idProduit}`
            : 'new-produit'
        }
        open={openProduitModal}
        produit={selectedProduit}
        onClose={() => {
          setOpenProduitModal(false);
          setSelectedProduit(null);
        }}
        onSaved={handleSavedProduit}
      />

      <MouvementStockModal
        open={openMouvementModal}
        produits={produits}
        onClose={() => setOpenMouvementModal(false)}
        onSaved={handleSavedMouvement}
      />
    </div>
  );
}