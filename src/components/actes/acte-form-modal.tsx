'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type ActeMedical = {
  idActe?: number;
  libelle: string;
  categorie: string;
  cotation?: string | null;
  prixUnitaire: number;
  forfait: boolean;
  etat: string;
};

type Props = {
  open: boolean;
  acte?: ActeMedical | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
};

const categories = [
  'ACTES_MEDICAUX',
  'CONSULTATION',
  'CONSULTATION_SPECIALISEE',
  'ANALYSES_BIOLOGIQUES',
  'RADIOLOGIE',
  'CHIRURGIE',
  'DENTAIRE',
  'SOINS_INFIRMIERS',
  'HOSPITALISATION',
  'VISITE_DOMICILE',
  'AUTRE',
];

export default function ActeFormModal({ open, acte, onClose, onSaved }: Props) {
  const isEditMode = Boolean(acte?.idActe);

  const [libelle, setLibelle] = useState(acte?.libelle ?? '');
  const [categorie, setCategorie] = useState(acte?.categorie ?? 'ACTES_MEDICAUX');
  const [cotation, setCotation] = useState(acte?.cotation ?? '');
  const [prixUnitaire, setPrixUnitaire] = useState(
    acte?.prixUnitaire !== undefined ? String(acte.prixUnitaire) : '',
  );
  const [forfait, setForfait] = useState(acte?.forfait ?? false);
  const [etat, setEtat] = useState(acte?.etat ?? 'actif');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const prix = Number(prixUnitaire);

    if (!libelle.trim()) {
      setError('Le libellé est obligatoire.');
      setSubmitting(false);
      return;
    }

    if (!categorie.trim()) {
      setError('La catégorie est obligatoire.');
      setSubmitting(false);
      return;
    }

    if (Number.isNaN(prix) || prix < 0) {
      setError('Le prix unitaire est invalide.');
      setSubmitting(false);
      return;
    }

    const payload = {
      idActe: acte?.idActe,
      libelle: libelle.trim().toUpperCase(),
      categorie,
      cotation: cotation.trim() || null,
      prixUnitaire: prix,
      valeur: prix,
      forfait,
      etat,
    };

    try {
      const response = await fetch('/api/actes', {
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
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              {isEditMode ? 'Modifier un acte médical' : 'Nouvel acte médical'}
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              Catalogue tarifaire de la clinique
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            title="Fermer"
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label
              htmlFor="libelle"
              className="ml-1 text-[10px] font-black uppercase text-slate-500"
            >
              Libellé *
            </label>
            <input
              id="libelle"
              required
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              placeholder="Ex: CONSULTATION GENERALE"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="categorie"
                className="ml-1 text-[10px] font-black uppercase text-slate-500"
              >
                Catégorie *
              </label>
              <select
                id="categorie"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="cotation"
                className="ml-1 text-[10px] font-black uppercase text-slate-500"
              >
                Cotation
              </label>
              <input
                id="cotation"
                value={cotation}
                onChange={(e) => setCotation(e.target.value)}
                placeholder="Ex: C, B30, K10, Z15"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label
                htmlFor="prixUnitaire"
                className="ml-1 text-[10px] font-black uppercase text-slate-500"
              >
                Prix unitaire *
              </label>
              <input
                id="prixUnitaire"
                type="number"
                min="0"
                required
                value={prixUnitaire}
                onChange={(e) => setPrixUnitaire(e.target.value)}
                placeholder="15000"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="etat"
                className="ml-1 text-[10px] font-black uppercase text-slate-500"
              >
                État
              </label>
              <select
                id="etat"
                value={etat}
                onChange={(e) => setEtat(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>

            <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-700">
              Forfait
              <input
                type="checkbox"
                checked={forfait}
                onChange={(e) => setForfait(e.target.checked)}
                aria-label="Acte au forfait"
                className="h-4 w-4"
              />
            </label>
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
              className="rounded-2xl px-6 py-4 text-sm font-bold text-slate-400 transition-colors hover:bg-slate-100"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-emerald-600 px-10 py-4 text-sm font-black text-white shadow-xl shadow-emerald-100 transition hover:bg-emerald-700 disabled:opacity-50"
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