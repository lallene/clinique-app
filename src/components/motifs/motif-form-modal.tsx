'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export type MotifConsultation = {
  idMotif?: number;
  libelle: string;
  categorie?: string | null;
  actif: boolean;
  _count?: {
    consultations: number;
  };
};

type Props = {
  open: boolean;
  motif?: MotifConsultation | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
};

const categories = [
  'GENERAL',
  'URGENCE',
  'PEDIATRIE',
  'GYNECOLOGIE',
  'CARDIOLOGIE',
  'SUIVI',
  'CONTROLE',
  'AUTRE',
];

export default function MotifFormModal({
  open,
  motif,
  onClose,
  onSaved,
}: Props) {
  const isEditMode = Boolean(motif?.idMotif);

  const [libelle, setLibelle] = useState(motif?.libelle || '');
  const [categorie, setCategorie] = useState(motif?.categorie || 'GENERAL');
  const [actif, setActif] = useState(motif?.actif ?? true);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!libelle.trim()) {
      setError('Le libellé est obligatoire.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/motifs', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idMotif: motif?.idMotif,
          libelle,
          categorie,
          actif,
        }),
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
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-100 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              {isEditMode ? 'Modifier un motif' : 'Nouveau motif'}
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              Référentiel médical des consultations
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

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Ex: FIÈVRE"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

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
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-700">
            Motif actif
            <input
              type="checkbox"
              checked={actif}
              onChange={(e) => setActif(e.target.checked)}
              aria-label="Motif actif"
              className="h-4 w-4"
            />
          </label>

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