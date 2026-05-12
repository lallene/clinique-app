'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type Produit = {
  idProduit?: number;
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
  produit?: Produit | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
};

const categories = [
  'ANTALGIQUE',
  'ANTIBIOTIQUE',
  'ANTI-INFLAMMATOIRE',
  'ANTIPALUDIQUE',
  'ANTISEPTIQUE',
  'VITAMINE',
  'PERFUSION',
  'INJECTABLE',
  'CARDIOLOGIE',
  'DIABETOLOGIE',
  'GYNECOLOGIE',
  'PEDIATRIE',
  'MATERIEL_MEDICAL',
  'AUTRE',
];

const formes = [
  'COMPRIME',
  'GELULE',
  'SIROP',
  'SOLUTION',
  'INJECTABLE',
  'AMPOULE',
  'FLACON',
  'SACHET',
  'POMMADE',
  'CREME',
  'COLLYRE',
  'PERFUSION',
  'SPRAY',
  'AUTRE',
];

const unites = [
  'BOITE',
  'PLAQUETTE',
  'COMPRIME',
  'FLACON',
  'AMPOULE',
  'SACHET',
  'TUBE',
  'UNITE',
  'BOUTEILLE',
  'AUTRE',
];

function formatDateForInput(date?: string | null) {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}

export default function ProduitFormModal({
  open,
  produit,
  onClose,
  onSaved,
}: Props) {
  const isEditMode = Boolean(produit?.idProduit);

  const [codeProduit, setCodeProduit] = useState(produit?.codeProduit || '');
  const [nomProduit, setNomProduit] = useState(produit?.nomProduit || '');
  const [categorie, setCategorie] = useState(produit?.categorie || 'ANTALGIQUE');
  const [forme, setForme] = useState(produit?.forme || 'COMPRIME');
  const [dosage, setDosage] = useState(produit?.dosage || '');
  const [unite, setUnite] = useState(produit?.unite || 'BOITE');

  const [prixAchat, setPrixAchat] = useState(
    produit?.prixAchat !== undefined ? String(produit.prixAchat) : '0',
  );
  const [prixVente, setPrixVente] = useState(
    produit?.prixVente !== undefined ? String(produit.prixVente) : '0',
  );

  const [quantiteStock, setQuantiteStock] = useState(
    produit?.quantiteStock !== undefined ? String(produit.quantiteStock) : '0',
  );
  const [seuilAlerte, setSeuilAlerte] = useState(
    produit?.seuilAlerte !== undefined ? String(produit.seuilAlerte) : '5',
  );

  const [fournisseur, setFournisseur] = useState(produit?.fournisseur || '');
  const [dateExpiration, setDateExpiration] = useState(
    formatDateForInput(produit?.dateExpiration),
  );
  const [actif, setActif] = useState(produit?.actif ?? true);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const achat = Number(prixAchat);
    const vente = Number(prixVente);
    const stock = Number(quantiteStock);
    const seuil = Number(seuilAlerte);

    if (!nomProduit.trim()) {
      setError('Le nom du produit est obligatoire.');
      setSubmitting(false);
      return;
    }

    if (Number.isNaN(achat) || achat < 0) {
      setError('Le prix d’achat est invalide.');
      setSubmitting(false);
      return;
    }

    if (Number.isNaN(vente) || vente < 0) {
      setError('Le prix de vente est invalide.');
      setSubmitting(false);
      return;
    }

    if (Number.isNaN(stock) || stock < 0) {
      setError('La quantité en stock est invalide.');
      setSubmitting(false);
      return;
    }

    if (Number.isNaN(seuil) || seuil < 0) {
      setError('Le seuil d’alerte est invalide.');
      setSubmitting(false);
      return;
    }

    const payload = {
      idProduit: produit?.idProduit,
      codeProduit: codeProduit.trim() || null,
      nomProduit: nomProduit.trim().toUpperCase(),
      categorie,
      forme,
      dosage: dosage.trim() || null,
      unite,
      prixAchat: achat,
      prixVente: vente,
      quantiteStock: stock,
      seuilAlerte: seuil,
      fournisseur: fournisseur.trim() || null,
      dateExpiration: dateExpiration || null,
      actif,
    };

    try {
      const response = await fetch('/api/produits', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement.");
      }

      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              {isEditMode ? 'Modifier le produit' : 'Nouveau produit pharmacie'}
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              Référentiel pharmacie, prix et stock
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

        <form onSubmit={handleSubmit} className="space-y-7">
          <section className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
              Informations produit
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="nomProduit"
                  className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                  Nom du produit *
                </label>
                <input
                  id="nomProduit"
                  required
                  value={nomProduit}
                  onChange={(e) => setNomProduit(e.target.value)}
                  placeholder="Ex: PARACÉTAMOL"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="codeProduit"
                  className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                  Code produit
                </label>
                <input
                  id="codeProduit"
                  value={codeProduit}
                  onChange={(e) => setCodeProduit(e.target.value)}
                  placeholder="Ex: MED-0001"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="categorie"
                  className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                  Catégorie
                </label>
                <select
                  id="categorie"
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="forme"
                  className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                  Forme
                </label>
                <select
                  id="forme"
                  value={forme}
                  onChange={(e) => setForme(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
                >
                  {formes.map((item) => (
                    <option key={item} value={item}>
                      {item.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="dosage"
                  className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                  Dosage
                </label>
                <input
                  id="dosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="500mg"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="unite"
                  className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                  Unité
                </label>
                <select
                  id="unite"
                  value={unite}
                  onChange={(e) => setUnite(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
                >
                  {unites.map((item) => (
                    <option key={item} value={item}>
                      {item.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
              Prix et stock
            </p>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="prixAchat"
                  className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                  Prix achat
                </label>
                <input
                  id="prixAchat"
                  type="number"
                  min="0"
                  value={prixAchat}
                  onChange={(e) => setPrixAchat(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="prixVente"
                  className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                  Prix vente
                </label>
                <input
                  id="prixVente"
                  type="number"
                  min="0"
                  value={prixVente}
                  onChange={(e) => setPrixVente(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="quantiteStock"
                  className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                  Stock initial
                </label>
                <input
                  id="quantiteStock"
                  type="number"
                  min="0"
                  value={quantiteStock}
                  onChange={(e) => setQuantiteStock(e.target.value)}
                  disabled={isEditMode}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="seuilAlerte"
                  className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                  Seuil alerte
                </label>
                <input
                  id="seuilAlerte"
                  type="number"
                  min="0"
                  value={seuilAlerte}
                  onChange={(e) => setSeuilAlerte(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {isEditMode && (
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-xs font-bold text-orange-700">
                Le stock d’un produit existant se modifie depuis “Mouvement stock”
                afin de garder un historique.
              </div>
            )}
          </section>

          <section className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Fournisseur et péremption
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="fournisseur"
                  className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                  Fournisseur
                </label>
                <input
                  id="fournisseur"
                  value={fournisseur}
                  onChange={(e) => setFournisseur(e.target.value)}
                  placeholder="Nom du fournisseur"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="dateExpiration"
                  className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                  Date expiration
                </label>
                <input
                  id="dateExpiration"
                  type="date"
                  value={dateExpiration}
                  onChange={(e) => setDateExpiration(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-700">
              Produit actif
              <input
                type="checkbox"
                checked={actif}
                onChange={(e) => setActif(e.target.checked)}
                aria-label="Produit actif"
                className="h-4 w-4"
              />
            </label>
          </section>

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
              {submitting
                ? 'Enregistrement...'
                : isEditMode
                  ? 'Modifier'
                  : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}