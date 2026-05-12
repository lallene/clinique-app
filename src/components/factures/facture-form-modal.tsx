'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

type Patient = {
  id_patient: number;
  nom: string;
  prenoms?: string | null;
  telephone?: string | null;
  numeroDossier?: string | null;
  matriculeAssure?: string | null;
  isAssure?: boolean;
  tauxCouverture?: number | null;
  assuranceId?: number | null;
  assurance?: {
    nomGarant?: string | null;
    tauxCouverture?: number | null;
    statut?: string | null;
    compagnie?: {
      nomCompagnie?: string | null;
    } | null;
  } | null;
};

type ActeMedical = {
  idActe: number;
  libelle: string;
  prixUnitaire: number;
  categorie: string;
  etat: string;
};

type LigneDraft = {
  acteId: number | null;
  designation: string;
  quantite: number;
  prixUnitaire: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
};

export default function FactureFormModal({ open, onClose, onSaved }: Props) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [actes, setActes] = useState<ActeMedical[]>([]);

  const [patientId, setPatientId] = useState('');
  const [selectedActeId, setSelectedActeId] = useState('');
  const [quantite, setQuantite] = useState('1');
  const [lignes, setLignes] = useState<LigneDraft[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedPatient = patients.find(
    (patient) => String(patient.id_patient) === patientId,
  );

  const tauxCouverture =
    selectedPatient?.isAssure && selectedPatient?.assuranceId
      ? Number(
          selectedPatient.tauxCouverture ||
            selectedPatient.assurance?.tauxCouverture ||
            0,
        )
      : 0;

  const montantTotal = useMemo(() => {
    return lignes.reduce((sum: number, ligne: LigneDraft) => {
      return sum + Number(ligne.quantite) * Number(ligne.prixUnitaire);
    }, 0);
  }, [lignes]);

  const montantAssurance = Math.round(montantTotal * (tauxCouverture / 100));
  const montantPatient = montantTotal - montantAssurance;

  async function loadData() {
    try {
      setError('');

      const [patientsRes, actesRes] = await Promise.all([
        fetch('/api/patients', { cache: 'no-store' }),
        fetch('/api/actes', { cache: 'no-store' }),
      ]);

      const patientsData = await patientsRes.json();
      const actesData = await actesRes.json();

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setActes(
        Array.isArray(actesData)
          ? actesData.filter((acte: ActeMedical) => acte.etat === 'actif')
          : [],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur chargement données.');
    }
  }

  useEffect(() => {
    if (!open) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  function resetForm() {
    setPatientId('');
    setSelectedActeId('');
    setQuantite('1');
    setLignes([]);
    setError('');
  }

  function addLigne() {
    const acte = actes.find((item) => String(item.idActe) === selectedActeId);
    const qte = Number(quantite);

    if (!acte) {
      setError('Veuillez sélectionner un acte.');
      return;
    }

    if (Number.isNaN(qte) || qte <= 0) {
      setError('Quantité invalide.');
      return;
    }

    setLignes((prev) => [
      ...prev,
      {
        acteId: acte.idActe,
        designation: acte.libelle,
        quantite: qte,
        prixUnitaire: acte.prixUnitaire,
      },
    ]);

    setSelectedActeId('');
    setQuantite('1');
    setError('');
  }

  function removeLigne(index: number) {
    setLignes((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!patientId) {
      setError('Veuillez sélectionner un patient.');
      setSubmitting(false);
      return;
    }

    if (lignes.length === 0) {
      setError('Veuillez ajouter au moins un acte.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/factures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: Number(patientId),
          lignes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur création facture.');
      }

      resetForm();
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              Nouvelle facture
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              Sélection patient, actes médicaux et calcul automatique
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
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="patientId"
                className="ml-1 text-[10px] font-black uppercase text-slate-500"
              >
                Patient *
              </label>

              <select
                id="patientId"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
              >
                <option value="">-- Choisir un patient --</option>

                {patients.map((patient) => (
                  <option key={patient.id_patient} value={patient.id_patient}>
                    {patient.numeroDossier ? `${patient.numeroDossier} - ` : ''}
                    {patient.prenoms || ''} {patient.nom}
                    {patient.isAssure && patient.assurance
                      ? ` - ${patient.assurance.compagnie?.nomCompagnie || 'ASSURANCE'}`
                      : ' - CASH'}
                  </option>
                ))}
              </select>
            </div>

            {selectedPatient && (
              <div
                className={`rounded-3xl border p-5 ${
                  selectedPatient.isAssure && selectedPatient.assurance
                    ? 'border-blue-100 bg-blue-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-black text-slate-900">
                      {selectedPatient.prenoms || ''} {selectedPatient.nom}
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      Dossier : {selectedPatient.numeroDossier || '-'}
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      Téléphone : {selectedPatient.telephone || '-'}
                    </p>
                  </div>

                  {selectedPatient.isAssure && selectedPatient.assurance ? (
                    <div className="rounded-2xl bg-white p-4 text-right shadow-sm">
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                        PATIENT ASSURÉ
                      </span>

                      <p className="mt-3 text-sm font-black text-slate-900">
                        {selectedPatient.assurance.compagnie?.nomCompagnie ||
                          'ASSURANCE'}
                      </p>

                      <p className="text-xs font-bold text-slate-500">
                        Garant : {selectedPatient.assurance.nomGarant || '-'}
                      </p>

                      <p className="text-xs font-bold text-slate-500">
                        Matricule : {selectedPatient.matriculeAssure || '-'}
                      </p>

                      <p className="mt-2 text-sm font-black text-blue-700">
                        Taux : {tauxCouverture}%
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-white p-4 text-right shadow-sm">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        CASH / PRIVÉ
                      </span>

                      <p className="mt-3 text-xs font-bold text-slate-500">
                        Le patient paie la totalité de la facture.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_120px_auto]">
            <div className="space-y-1.5">
              <label
                htmlFor="acteId"
                className="ml-1 text-[10px] font-black uppercase text-slate-500"
              >
                Acte médical
              </label>

              <select
                id="acteId"
                value={selectedActeId}
                onChange={(e) => setSelectedActeId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
              >
                <option value="">-- Choisir un acte --</option>

                {actes.map((acte) => (
                  <option key={acte.idActe} value={acte.idActe}>
                    {acte.libelle} -{' '}
                    {Number(acte.prixUnitaire).toLocaleString()} FCFA
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="quantite"
                className="ml-1 text-[10px] font-black uppercase text-slate-500"
              >
                Quantité
              </label>

              <input
                id="quantite"
                type="number"
                min="1"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={addLigne}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-black text-white hover:bg-emerald-600"
              >
                <Plus size={18} />
                Ajouter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-100">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <th className="px-6 py-4">Désignation</th>
                  <th className="px-6 py-4">Qté</th>
                  <th className="px-6 py-4">Prix U</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {lignes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      Aucun acte ajouté.
                    </td>
                  </tr>
                ) : (
                  lignes.map((ligne, index) => (
                    <tr
                      key={`${ligne.designation}-${index}`}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-4 font-bold">
                        {ligne.designation}
                      </td>
                      <td className="px-6 py-4">{ligne.quantite}</td>
                      <td className="px-6 py-4">
                        {ligne.prixUnitaire.toLocaleString()} FCFA
                      </td>
                      <td className="px-6 py-4 font-black">
                        {(ligne.quantite * ligne.prixUnitaire).toLocaleString()}{' '}
                        FCFA
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => removeLigne(index)}
                          aria-label="Retirer la ligne"
                          title="Retirer"
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

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase text-slate-400">
                Total
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {montantTotal.toLocaleString()} FCFA
              </p>
            </div>

            <div className="rounded-3xl bg-blue-50 p-5">
              <p className="text-xs font-bold uppercase text-blue-500">
                Assurance
              </p>
              <p className="mt-2 text-2xl font-black text-blue-700">
                {montantAssurance.toLocaleString()} FCFA
              </p>
            </div>

            <div className="rounded-3xl bg-orange-50 p-5">
              <p className="text-xs font-bold uppercase text-orange-500">
                Patient
              </p>
              <p className="mt-2 text-2xl font-black text-orange-700">
                {montantPatient.toLocaleString()} FCFA
              </p>
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
              {submitting ? 'Création...' : 'Créer la facture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}