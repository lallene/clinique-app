'use client';

import { useEffect, useState } from 'react';
import { Building2, ShieldCheck, X } from 'lucide-react';
import type { Assurance } from './assurances-page-client';

type Compagnie = {
  idCompagnie: number;
  nomCompagnie: string;
};

type Props = {
  open: boolean;
  assurance?: Assurance | null;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
};

export default function AssuranceFormModal({
  open,
  assurance,
  onClose,
  onSaved,
}: Props) {
  const isEditMode = Boolean(assurance?.idAssurance);

  const [compagnies, setCompagnies] = useState<Compagnie[]>([]);
  const [compagnieId, setCompagnieId] = useState(
    assurance?.compagnieId ? String(assurance.compagnieId) : '',
  );
  const [nomGarant, setNomGarant] = useState(assurance?.nomGarant || '');
  const [codeAssurance, setCodeAssurance] = useState(
    assurance?.codeAssurance || '',
  );
  const [contact, setContact] = useState(assurance?.contact || '');
  const [telephone, setTelephone] = useState(assurance?.telephone || '');
  const [email, setEmail] = useState(assurance?.email || '');
  const [adresse, setAdresse] = useState(assurance?.adresse || '');
  const [convention, setConvention] = useState(assurance?.convention || '');
  const [tauxCouverture, setTauxCouverture] = useState(
    assurance?.tauxCouverture !== undefined
      ? String(assurance.tauxCouverture)
      : '80',
  );
  const [echeanceReglement, setEcheanceReglement] = useState(
    assurance?.echeanceReglement ? String(assurance.echeanceReglement) : '30',
  );

  const [controleFacturation, setControleFacturation] = useState(
    assurance?.controleFacturation ?? true,
  );
  const [numeroBonObligatoire, setNumeroBonObligatoire] = useState(
    assurance?.numeroBonObligatoire ?? true,
  );
  const [gestionBonsPharmacie, setGestionBonsPharmacie] = useState(
    assurance?.gestionBonsPharmacie ?? false,
  );
  const [tarifSpecial, setTarifSpecial] = useState(
    assurance?.tarifSpecial ?? false,
  );
  const [modeleFacture, setModeleFacture] = useState(
    assurance?.modeleFacture || 'AUCUN',
  );
  const [statut, setStatut] = useState(assurance?.statut || 'active');
  const [observation, setObservation] = useState(assurance?.observation || '');

  const [newCompagnieName, setNewCompagnieName] = useState('');
  const [creatingCompagnie, setCreatingCompagnie] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function fetchCompagnies() {
    const res = await fetch('/api/compagnies', { cache: 'no-store' });

    if (!res.ok) {
      throw new Error("Impossible de charger les compagnies d'assurance.");
    }

    const data = await res.json();
    setCompagnies(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    if (!open) return;

    async function load() {
      try {
        setError('');
        await fetchCompagnies();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [open]);

  if (!open) return null;

  async function handleCreateCompagnie() {
    if (!newCompagnieName.trim()) {
      setError('Veuillez saisir le nom de la compagnie.');
      return;
    }

    try {
      setCreatingCompagnie(true);
      setError('');

      const res = await fetch('/api/compagnies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomCompagnie: newCompagnieName.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la compagnie.');
      }

      await fetchCompagnies();
      setCompagnieId(String(data.idCompagnie));
      setNewCompagnieName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setCreatingCompagnie(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const taux = Number(tauxCouverture);
    const echeance = Number(echeanceReglement);

    if (!compagnieId) {
      setError('Veuillez sélectionner une compagnie.');
      setSubmitting(false);
      return;
    }

    if (!nomGarant.trim()) {
      setError('Veuillez renseigner le garant.');
      setSubmitting(false);
      return;
    }

    if (Number.isNaN(taux) || taux < 0 || taux > 100) {
      setError('Le taux de couverture doit être compris entre 0 et 100.');
      setSubmitting(false);
      return;
    }

    if (Number.isNaN(echeance) || echeance <= 0) {
      setError("L'échéance de règlement est invalide.");
      setSubmitting(false);
      return;
    }

    const payload = {
      idAssurance: assurance?.idAssurance,
      compagnieId: Number(compagnieId),
      nomGarant: nomGarant.trim().toUpperCase(),
      codeAssurance: codeAssurance.trim() || null,
      contact: contact.trim() || null,
      telephone: telephone.trim() || null,
      email: email.trim() || null,
      adresse: adresse.trim() || null,
      convention: convention.trim() || null,
      tauxCouverture: taux,
      echeanceReglement: echeance,
      controleFacturation,
      numeroBonObligatoire,
      gestionBonsPharmacie,
      tarifSpecial,
      modeleFacture,
      statut,
      observation: observation.trim() || null,
    };

    try {
      const res = await fetch('/api/assurances', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
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
            <h3 className="flex items-center gap-2 text-2xl font-black text-slate-900">
              <span className="text-blue-600">Module</span>
              <span className="text-slate-300">/</span>
              <span>Assurance</span>
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              {isEditMode ? 'Modifier une convention' : 'Nouvelle convention assurance'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Building2 size={16} />
              <span className="text-xs font-black uppercase tracking-tighter">
                Compagnie et garant
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label  htmlFor="compagnie" className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Compagnie *
                </label>
                <select
                  id="compagnie"
                  value={compagnieId}
                  onChange={(e) => setCompagnieId(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="">-- Choisir --</option>
                  {compagnies.map((compagnie) => (
                    <option key={compagnie.idCompagnie} value={compagnie.idCompagnie}>
                      {compagnie.nomCompagnie}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Ajouter une compagnie
                </label>
                <div className="flex gap-2">
                  <input
                    value={newCompagnieName}
                    onChange={(e) => setNewCompagnieName(e.target.value)}
                    placeholder="ASCOMA, NSIA..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCompagnie}
                    disabled={creatingCompagnie}
                    className="rounded-2xl bg-slate-900 px-4 text-sm font-black text-white disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Garant *
                </label>
                <input
                  value={nomGarant}
                  onChange={(e) => setNomGarant(e.target.value)}
                  placeholder="CONCENTRIX, TOTAL, PARTICULIER..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Code assurance
                </label>
                <input
                  value={codeAssurance}
                  onChange={(e) => setCodeAssurance(e.target.value)}
                  placeholder="ASC-CONCENTRIX-80"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <ShieldCheck size={16} />
              <span className="text-xs font-black uppercase tracking-tighter">
                Convention et prise en charge
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor="tauxCouverture" className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Taux couverture (%)
                </label>
                <input
                id="tauxCouverture"
                  type="number"
                  min="0"
                  max="100"
                  value={tauxCouverture}
                  onChange={(e) => setTauxCouverture(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="echeanceReglement" className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Échéance règlement
                </label>
                <select
                 id="echeanceReglement"
                  value={echeanceReglement}
                  onChange={(e) => setEcheanceReglement(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
                >
                  <option value="30">30 jours</option>
                  <option value="60">60 jours</option>
                  <option value="90">90 jours</option>
                  <option value="120">120 jours</option>
                </select>
              </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="statut"
                    className="ml-1 text-[10px] font-black uppercase text-slate-500"
                >
                    Statut
                </label>

                <select
                    id="statut"
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspendue">Suspendue</option>
                </select>
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold">
                Contrôle facturation
                <input
                  type="checkbox"
                  checked={controleFacturation}
                  onChange={(e) => setControleFacturation(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold">
                Numéro de bon obligatoire
                <input
                  type="checkbox"
                  checked={numeroBonObligatoire}
                  onChange={(e) => setNumeroBonObligatoire(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold">
                Gestion bons pharmacie
                <input
                  type="checkbox"
                  checked={gestionBonsPharmacie}
                  onChange={(e) => setGestionBonsPharmacie(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold">
                Tarif spécial
                <input
                  type="checkbox"
                  checked={tarifSpecial}
                  onChange={(e) => setTarifSpecial(e.target.checked)}
                />
              </label>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Contact"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
            />

            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Téléphone"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
            />

            <input
              value={modeleFacture}
              onChange={(e) => setModeleFacture(e.target.value)}
              placeholder="Modèle facture"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
            />
          </section>

          <textarea
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="Adresse"
            className="min-h-20 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
          />

          <textarea
            value={convention}
            onChange={(e) => setConvention(e.target.value)}
            placeholder="Clauses de convention"
            className="min-h-20 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
          />

          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Observation"
            className="min-h-20 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white"
          />

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
              className="rounded-2xl bg-blue-600 px-10 py-4 text-sm font-black text-white shadow-xl shadow-blue-100 transition hover:bg-blue-700 disabled:opacity-50"
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