'use client';

import { useMemo, useState } from 'react';
import { X } from 'lucide-react';

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

type Props = {
  open: boolean;
  produits: Produit[];
  onClose: () => void;
  onSaved: () => void | Promise<void>;
};

const typesMouvement = [
  {
    value: 'ENTREE',
    label: 'Entrée stock',
    description: 'Ajout de produits après achat ou livraison.',
  },
  {
    value: 'SORTIE',
    label: 'Sortie stock',
    description: 'Retrait de produits pour patient, service ou perte.',
  },
  {
    value: 'AJUSTEMENT',
    label: 'Ajustement stock',
    description: 'Correction manuelle du stock réel disponible.',
  },
];

export default function MouvementStockModal({
  open,
  produits,
  onClose,
  onSaved,
}: Props) {
  const [produitId, setProduitId] = useState('');
  const [typeMvt, setTypeMvt] = useState('ENTREE');
  const [qte, setQte] = useState('1');
  const [motif, setMotif] = useState('');
  const [reference, setReference] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const produitsActifs = useMemo(() => {
    return produits.filter((produit) => produit.actif);
  }, [produits]);

  const selectedProduit = produits.find(
    (produit) => String(produit.idProduit) === produitId,
  );

  if (!open) return null;

  function resetForm() {
    setProduitId('');
    setTypeMvt('ENTREE');
    setQte('1');
    setMotif('');
    setReference('');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitting(true);
    setError('');

    const quantite = Number(qte);

    if (!produitId) {
      setError('Veuillez sélectionner un produit.');
      setSubmitting(false);
      return;
    }

    if (Number.isNaN(quantite) || quantite <= 0) {
      setError('La quantité doit être supérieure à zéro.');
      setSubmitting(false);
      return;
    }

    if (typeMvt === 'SORTIE' && selectedProduit) {
      if (quantite > selectedProduit.quantiteStock) {
        setError(
          `Stock insuffisant. Stock disponible : ${selectedProduit.quantiteStock}.`,
        );
        setSubmitting(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/pharmacie/mouvements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produitId: Number(produitId),
          typeMvt,
          qte: quantite,
          motif: motif.trim() || null,
          reference: reference.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur mouvement stock.');
      }

      resetForm();
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  }

  const stockApres = (() => {
    if (!selectedProduit) return null;

    const quantite = Number(qte || 0);

    if (Number.isNaN(quantite)) return selectedProduit.quantiteStock;

    if (typeMvt === 'ENTREE') {
      return selectedProduit.quantiteStock + quantite;
    }

    if (typeMvt === 'SORTIE') {
      return selectedProduit.quantiteStock - quantite;
    }

    if (typeMvt === 'AJUSTEMENT') {
      return quantite;
    }

    return selectedProduit.quantiteStock;
  })();

  const typeDescription =
    typesMouvement.find((item) => item.value === typeMvt)?.description || '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              Mouvement de stock
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              Entrée, sortie ou ajustement pharmacie
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label
              htmlFor="produitId"
              className="ml-1 text-[10px] font-black uppercase text-slate-500"
            >
              Produit *
            </label>

            <select
              id="produitId"
              value={produitId}
              onChange={(e) => setProduitId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
            >
              <option value="">-- Choisir un produit --</option>

              {produitsActifs.map((produit) => (
                <option key={produit.idProduit} value={produit.idProduit}>
                  {produit.nomProduit}
                  {produit.dosage ? ` ${produit.dosage}` : ''} - Stock :{' '}
                  {produit.quantiteStock}
                </option>
              ))}
            </select>
          </div>

          {selectedProduit && (
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-sm font-black text-slate-900">
                {selectedProduit.nomProduit}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-500">
                Code : {selectedProduit.codeProduit || '-'} | Forme :{' '}
                {selectedProduit.forme || '-'} | Dosage :{' '}
                {selectedProduit.dosage || '-'}
              </p>
              <p className="mt-2 text-sm font-black text-emerald-700">
                Stock actuel : {selectedProduit.quantiteStock}{' '}
                {selectedProduit.unite || ''}
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="typeMvt"
                className="ml-1 text-[10px] font-black uppercase text-slate-500"
              >
                Type mouvement *
              </label>

              <select
                id="typeMvt"
                value={typeMvt}
                onChange={(e) => setTypeMvt(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
              >
                {typesMouvement.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {typeDescription && (
                <p className="ml-1 text-[11px] font-medium text-slate-400">
                  {typeDescription}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="qte"
                className="ml-1 text-[10px] font-black uppercase text-slate-500"
              >
                Quantité *
              </label>

              <input
                id="qte"
                type="number"
                min="1"
                value={qte}
                onChange={(e) => setQte(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {selectedProduit && stockApres !== null && (
            <div
              className={`rounded-3xl border p-5 ${
                stockApres < 0
                  ? 'border-red-100 bg-red-50'
                  : stockApres <= selectedProduit.seuilAlerte
                    ? 'border-orange-100 bg-orange-50'
                    : 'border-blue-100 bg-blue-50'
              }`}
            >
              <p className="text-xs font-bold uppercase text-slate-500">
                Stock après mouvement
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {stockApres} {selectedProduit.unite || ''}
              </p>

              {stockApres <= selectedProduit.seuilAlerte && (
                <p className="mt-1 text-xs font-bold text-orange-700">
                  Attention : le stock sera inférieur ou égal au seuil d’alerte.
                </p>
              )}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="motif"
                className="ml-1 text-[10px] font-black uppercase text-slate-500"
              >
                Motif
              </label>
              <input
                id="motif"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="Ex: livraison fournisseur, vente patient..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="reference"
                className="ml-1 text-[10px] font-black uppercase text-slate-500"
              >
                Référence
              </label>
              <input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ex: BL-2026-001, FAC-..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-600">
              ⚠️ {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-6 py-4 text-sm font-bold text-slate-400 hover:bg-slate-100"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-emerald-600 px-10 py-4 text-sm font-black text-white shadow-xl shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? 'Enregistrement...' : 'Valider mouvement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}