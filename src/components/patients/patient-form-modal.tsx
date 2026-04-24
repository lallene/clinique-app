'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone, ShieldCheck, User, X } from 'lucide-react';

type Compagnie = {
  idCompagnie: number;
  nomCompagnie: string;
};

type Patient = {
  idPatient?: number;
  id_patient?: number;
  nom: string;
  prenoms?: string | null;
  sexe?: string | null;
  dateNaissance?: string | null;
  age?: number | null;
  telephone?: string | null;
  quartier?: string | null;
  personneContact?: string | null;
  numeroDossier?: string | null;
  assuranceId?: number | null;
  isAssure?: boolean;
  tauxCouverture?: number | null;
  matriculeAssure?: string | null;
  assurance?: {
  compagnieId?: number | null;
  nomGarant?: string | null;
  compagnie?: {
    idCompagnie?: number;
    nomCompagnie?: string | null;
  } | null;
} | null;
};

type PatientFormModalProps = {
  open: boolean;
  patient?: Patient | null;
  onClose: () => void;
  onCreated: () => void | Promise<void>;
};

export default function PatientFormModal({
  open,
  patient,
  onClose,
  onCreated,
}: PatientFormModalProps) {
  const [nom, setNom] = useState('');
  const [prenoms, setPrenoms] = useState('');
  const [sexe, setSexe] = useState('');
  const [telephone, setTelephone] = useState('');
  const [quartier, setQuartier] = useState('');
  const [age, setAge] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [personneContact, setPersonneContact] = useState('');

  const [isAssure, setIsAssure] = useState(false);
  const [compagnies, setCompagnies] = useState<Compagnie[]>([]);
  const [selectedCompagnieId, setSelectedCompagnieId] = useState('');
  const [nomGarant, setNomGarant] = useState('');
  const [tauxCouverture, setTauxCouverture] = useState('100');
  const [matriculeAssure, setMatriculeAssure] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = Boolean(patient?.idPatient ?? patient?.id_patient);
  const phoneRegex = /^\+?\d{10,}$/;

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();

    async function fetchCompagnies() {
      try {
        setError('');

        const res = await fetch('/api/compagnies', {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Échec du chargement des compagnies d'assurance.");
        }

        const data = await res.json();
        setCompagnies(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    }

    fetchCompagnies();

    return () => controller.abort();
  }, [open]);

  useEffect(() => {
  if (!open) return;

  if (!patient) {
    resetForm();
    return;
  }

  setNom(patient.nom || '');
  setPrenoms(patient.prenoms || '');
  setSexe(patient.sexe || '');
  setTelephone(patient.telephone || '');
  setQuartier(patient.quartier || '');
  setPersonneContact(patient.personneContact || '');

  setDateNaissance(
    patient.dateNaissance
      ? new Date(patient.dateNaissance).toISOString().split('T')[0]
      : '',
  );

  setAge(patient.age ? String(patient.age) : '');

  const patientIsAssure = Boolean(patient.isAssure || patient.assuranceId);
  setIsAssure(patientIsAssure);

  if (patientIsAssure) {
    setNomGarant(patient.assurance?.nomGarant || '');

    setSelectedCompagnieId(
      patient.assurance?.compagnieId
        ? String(patient.assurance.compagnieId)
        : patient.assurance?.compagnie?.idCompagnie
          ? String(patient.assurance.compagnie.idCompagnie)
          : '',
    );

    setTauxCouverture(
      patient.tauxCouverture !== null && patient.tauxCouverture !== undefined
        ? String(patient.tauxCouverture)
        : '100',
    );

    setMatriculeAssure(patient.matriculeAssure || '');
  } else {
    setNomGarant('');
    setSelectedCompagnieId('');
    setTauxCouverture('100');
    setMatriculeAssure('');
  }
}, [open, patient]);

  useEffect(() => {
    if (!dateNaissance) return;

    const birthDate = new Date(dateNaissance);
    const today = new Date();

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    setAge(calculatedAge.toString());
  }, [dateNaissance]);

  if (!open) return null;

  function resetForm() {
    setNom('');
    setPrenoms('');
    setSexe('');
    setTelephone('');
    setQuartier('');
    setDateNaissance('');
    setAge('');
    setPersonneContact('');
    setIsAssure(false);
    setSelectedCompagnieId('');
    setNomGarant('');
    setTauxCouverture('100');
    setMatriculeAssure('');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (telephone && !phoneRegex.test(telephone)) {
      setError('Le téléphone doit contenir au moins 10 chiffres. Exemple : +2250700000000');
      setSubmitting(false);
      return;
    }

    if (personneContact && !phoneRegex.test(personneContact)) {
      setError('La personne contact doit contenir au moins 10 chiffres. Exemple : +2250700000000');
      setSubmitting(false);
      return;
    }

    const patientId = patient?.idPatient ?? patient?.id_patient;

    const payload = {
      idPatient: patientId,
      nom: nom.toUpperCase(),
      prenoms,
      sexe,
      telephone,
      quartier,
      dateNaissance: dateNaissance || null,
      age: age ? Number(age) : null,
      personneContact,
      isAssure,
      assuranceData: isAssure
        ? {
            compagnieId: Number(selectedCompagnieId),
            nomGarant: nomGarant.toUpperCase() || 'PARTICULIER',
            tauxCouverture: Number(tauxCouverture),
            matriculeAssure,
            contact: null,
            convention: null,
          }
        : null,
    };

    try {
      const response = await fetch('/api/patients', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement.");
      }

      alert(
        isEditMode
          ? `✅ Patient modifié avec succès\n\nNom : ${data.nom}\nPrénoms : ${
              data.prenoms || '-'
            }\nN° dossier : ${data.numeroDossier || '-'}`
          : `✅ Patient bien enregistré\n\nNom : ${data.nom}\nPrénoms : ${
              data.prenoms || '-'
            }\nN° dossier : ${data.numeroDossier || '-'}`,
      );

      resetForm();
      await onCreated();
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
            <h3 className="flex items-center gap-2 text-2xl font-black text-slate-900">
              <span className="text-emerald-600">Saint Raphaël</span>
              <span className="text-slate-300">/</span>
              <span>Dossier Patient</span>
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              {isEditMode ? 'Modification du dossier patient' : 'Inscription Nouveau Patient'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="mb-2 flex items-center gap-2 text-emerald-600">
              <User size={16} />
              <span className="text-xs font-black uppercase tracking-tighter">
                Informations personnelles
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="nom" className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Nom du patient *
                </label>
                <input
                  id="nom"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white"
                  placeholder="ACHI"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="prenoms" className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Prénoms
                </label>
                <input
                  id="prenoms"
                  value={prenoms}
                  onChange={(e) => setPrenoms(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white"
                  placeholder="Lallène Cédric"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor="sexe" className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Sexe
                </label>
                <select
                  id="sexe"
                  value={sexe}
                  onChange={(e) => setSexe(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500"
                >
                  <option value="">--</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="dateNaissance" className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Date de naissance
                </label>
                <input
                  id="dateNaissance"
                  type="date"
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="age" className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Âge
                </label>
                <input
                  id="age"
                  type="number"
                  min="0"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={Boolean(dateNaissance)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ex: 28"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="telephone" className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="telephone"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500"
                    placeholder="0700..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="personneContact" className="ml-1 text-[10px] font-black uppercase text-slate-500">
                  Personne à contacter
                </label>
                <input
                  id="personneContact"
                  value={personneContact}
                  onChange={(e) => setPersonneContact(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500"
                  placeholder="téléphone du contact"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="quartier" className="ml-1 text-[10px] font-black uppercase text-slate-500">
                Quartier / Domicile
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="quartier"
                  value={quartier}
                  onChange={(e) => setQuartier(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500"
                  placeholder="Séguiéla, Face Pharmacie..."
                />
              </div>
            </div>
          </div>

          <div
            className={`rounded-[2rem] border p-6 transition-all duration-300 ${
              isAssure ? 'border-blue-200 bg-blue-50/40 shadow-inner' : 'border-slate-100 bg-slate-50/50'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2 ${isAssure ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <span className="block text-sm font-black text-slate-800">Prise en charge</span>
                  <span className="block text-[10px] font-bold uppercase tracking-tighter text-slate-400 italic">
                    Patient assuré ?
                  </span>
                </div>
              </div>

              <label className="relative inline-flex h-7 w-12 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={isAssure}
                  onChange={() => setIsAssure((prev) => !prev)}
                  className="sr-only peer"
                  aria-label="Statut de l'assurance du patient"
                />
                <span className="absolute inset-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-600" />
                <span className="relative ml-1 inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-5" />
              </label>
            </div>

            {isAssure && (
              <div className="grid gap-4 duration-500 animate-in fade-in slide-in-from-top-2 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="compagnie" className="ml-1 text-[10px] font-black uppercase text-blue-600">
                    Compagnie d&apos;assurance
                  </label>
                  <select
                    id="compagnie"
                    required={isAssure}
                    value={selectedCompagnieId}
                    onChange={(e) => setSelectedCompagnieId(e.target.value)}
                    className="w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">-- Choisir Compagnie --</option>
                    {compagnies.map((compagnie) => (
                      <option key={compagnie.idCompagnie} value={compagnie.idCompagnie}>
                        {compagnie.nomCompagnie}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="nomGarant" className="ml-1 text-[10px] font-black uppercase text-blue-600">
                    Garant
                  </label>
                  <input
                    id="nomGarant"
                    value={nomGarant}
                    onChange={(e) => setNomGarant(e.target.value)}
                    className="w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Ex: CONCENTRIX, SÉNAT..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="matriculeAssure" className="ml-1 text-[10px] font-black uppercase text-blue-600">
                    N° Matricule assuré
                  </label>
                  <input
                    id="matriculeAssure"
                    value={matriculeAssure}
                    onChange={(e) => setMatriculeAssure(e.target.value)}
                    className="w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Numéro de carte..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="tauxCouverture" className="ml-1 text-[10px] font-black uppercase text-blue-600">
                    Taux de couverture (%)
                  </label>
                  <input
                    id="tauxCouverture"
                    type="number"
                    value={tauxCouverture}
                    onChange={(e) => setTauxCouverture(e.target.value)}
                    className="w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="animate-pulse rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-600">
              ⚠️ {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6">
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
              className="rounded-2xl bg-slate-900 px-10 py-4 text-sm font-black text-white shadow-2xl shadow-slate-200 transition-all hover:bg-emerald-600 active:scale-95 disabled:opacity-50"
            >
              {submitting
                ? 'Validation en cours...'
                : isEditMode
                  ? 'Modifier le Patient'
                  : 'Inscrire le Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}