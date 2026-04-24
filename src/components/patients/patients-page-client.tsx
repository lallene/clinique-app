'use client';

import { useEffect, useMemo, useState } from 'react';
import { Edit, Plus, Search, ShieldCheck, Trash2, User, Users } from 'lucide-react';
import PatientFormModal from './patient-form-modal';

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
    nomGarant?: string | null;
    compagnie?: {
      idCompagnie?: number;
      nomCompagnie?: string | null;
    } | null;
  } | null;
};

export default function PatientsPageClient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  async function fetchPatients() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/patients', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération.');
      }

      const data = await response.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return patients;

    return patients.filter((patient) => {
      const fullName = `${patient.prenoms ?? ''} ${patient.nom ?? ''}`.toLowerCase();

      return (
        fullName.includes(q) ||
        (patient.telephone ?? '').includes(q) ||
        (patient.numeroDossier ?? '').toLowerCase().includes(q)
      );
    });
  }, [patients, search]);

  async function handlePatientCreated() {
    setOpenModal(false);
    setSelectedPatient(null);
    await fetchPatients();
  }

  function handleEdit(patient: Patient) {
    setSelectedPatient(patient);
    setOpenModal(true);
  }

  async function handleDelete(patient: Patient) {
    const patientId = patient.idPatient ?? patient.id_patient;

    if (!patientId) {
      setError('ID patient introuvable.');
      return;
    }

    const confirmDelete = window.confirm(
      `Voulez-vous vraiment supprimer le patient ${patient.prenoms || ''} ${patient.nom} ?`,
    );

    if (!confirmDelete) return;

    try {
      setError('');

      const response = await fetch('/api/patients', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: patientId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression.');
      }

      await fetchPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }

  return (
    <div className="min-h-screen w-full space-y-6 bg-slate-50 px-6 py-6 lg:px-10">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Users size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Base Patients
            </span>
          </div>

          <p className="mt-4 text-3xl font-black text-slate-900">{patients.length}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">Inscrits à ce jour</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <ShieldCheck size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Assurance
            </span>
          </div>

          <p className="mt-4 text-3xl font-black text-slate-900">
            {patients.filter((patient) => patient.assuranceId).length}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">Patients sous couverture</p>
        </div>
      </div>

      <div className="w-full rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Registre Global</h2>
            <p className="text-sm font-medium text-slate-500">
              Gestion et suivi des dossiers patients
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
                placeholder="Rechercher un patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedPatient(null);
                setOpenModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 active:scale-95"
            >
              <Plus size={20} />
              Nouveau Dossier
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="w-full overflow-x-auto rounded-3xl border border-slate-100 shadow-sm">
          <table className="w-full min-w-[1200px] bg-white">
            <thead>
              <tr className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-5">Identité du Patient</th>
                <th className="px-6 py-5">Genre</th>
                <th className="px-6 py-5">Dossier / Code</th>
                <th className="px-6 py-5">Localisation</th>
                <th className="px-6 py-5">Âge / Naissance</th>
                <th className="px-6 py-5 text-right">Couverture</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-6">
                      <div className="h-4 w-full rounded-lg bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center font-medium text-slate-500">
                    Aucun patient trouvé dans la base.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const patientId = patient.idPatient ?? patient.id_patient;

                  return (
                    <tr key={patientId} className="group transition hover:bg-emerald-50/30">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-emerald-100 group-hover:text-emerald-600">
                            <User size={18} />
                          </div>

                          <div>
                            <p className="font-bold leading-tight text-slate-900">
                              {patient.prenoms} {patient.nom}
                            </p>
                            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                              {patient.telephone || 'Aucun contact'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 font-medium text-slate-600">
                        {patient.sexe || '-'}
                      </td>

                      <td className="px-6 py-5 font-mono text-xs font-semibold">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-bold shadow-sm ${
                            patient.numeroDossier?.startsWith('AS')
                              ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                              : 'border-blue-200 bg-blue-100 text-blue-700'
                          }`}
                        >
                          {patient.numeroDossier?.startsWith('AS') ? '🟢' : '🔵'}
                          {patient.numeroDossier || 'EN COURS'}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-[10px] font-bold uppercase tracking-tighter text-slate-600">
                        {patient.quartier || 'N/A'}
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-700">
                          {patient.age ? `${patient.age} ans` : '-'}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400">
                          {patient.dateNaissance
                            ? new Date(patient.dateNaissance).toLocaleDateString('fr-FR')
                            : ''}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-right">
                        {patient.assuranceId ? (
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-black shadow-sm ${
                                patient.tauxCouverture === 100
                                  ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                                  : 'border-blue-200 bg-blue-100 text-blue-700'
                              }`}
                            >
                              {patient.tauxCouverture || 0}%
                            </span>

                            <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                              {patient.assurance?.nomGarant || 'ASSURÉ'}
                            </span>

                            <span className="text-[10px] font-medium text-slate-400">
                              {patient.assurance?.compagnie?.nomCompagnie || ''}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-500">
                            CASH / PRIVÉ
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(patient)}
                            className="rounded-xl bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                            aria-label="Modifier le patient"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(patient)}
                            className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                            aria-label="Supprimer le patient"
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

      <PatientFormModal
        open={openModal}
        patient={selectedPatient}
        onClose={() => {
          setOpenModal(false);
          setSelectedPatient(null);
        }}
        onCreated={handlePatientCreated}
      />
    </div>
  );
}
