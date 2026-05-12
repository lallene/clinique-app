'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Edit,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import AssuranceFormModal from './assurance-form-modal';

type CurrentUser = {
  name: string;
  email: string;
  role: string;
};

type Compagnie = {
  idCompagnie: number;
  nomCompagnie: string;
};

export type Assurance = {
  idAssurance: number;
  compagnieId: number;
  nomGarant: string;
  codeAssurance?: string | null;
  contact?: string | null;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  convention?: string | null;
  tauxCouverture: number;
  echeanceReglement?: number | null;
  controleFacturation: boolean;
  numeroBonObligatoire: boolean;
  gestionBonsPharmacie: boolean;
  modeleFacture?: string | null;
  tarifSpecial: boolean;
  statut: string;
  observation?: string | null;
  compagnie?: Compagnie | null;
  patients?: unknown[];
  factures?: unknown[];
};

type Props = {
  currentUser: CurrentUser;
};

export default function AssurancesPageClient({ currentUser }: Props) {
  const [assurances, setAssurances] = useState<Assurance[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAssurance, setSelectedAssurance] = useState<Assurance | null>(null);
  const [error, setError] = useState('');

  async function fetchAssurances() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/assurances', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des assurances.');
      }

      const data = await response.json();
      setAssurances(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAssurances();
  }, []);

  const activeAssurances = assurances.filter((item) => item.statut === 'active').length;
  const totalPatients = assurances.reduce(
    (total, item) => total + (item.patients?.length ?? 0),
    0,
  );

  const filteredAssurances = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return assurances;

    return assurances.filter((item) => {
      return (
        item.nomGarant.toLowerCase().includes(q) ||
        item.compagnie?.nomCompagnie?.toLowerCase().includes(q) ||
        item.codeAssurance?.toLowerCase().includes(q) ||
        item.contact?.toLowerCase().includes(q)
      );
    });
  }, [assurances, search]);

  function handleEdit(assurance: Assurance) {
    setSelectedAssurance(assurance);
    setOpenModal(true);
  }

  async function handleDelete(assurance: Assurance) {
    const confirmDelete = window.confirm(
      `Supprimer la convention ${assurance.compagnie?.nomCompagnie || ''} / ${assurance.nomGarant} ?`,
    );

    if (!confirmDelete) return;

    try {
      setError('');

      const response = await fetch('/api/assurances', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idAssurance: assurance.idAssurance }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression.');
      }

      await fetchAssurances();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }

  async function handleSaved() {
    setOpenModal(false);
    setSelectedAssurance(null);
    await fetchAssurances();
  }

  const canManage = ['administrateur', 'direction', 'caisse', 'USER'].includes(
    currentUser.role,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <ShieldCheck size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Conventions
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {assurances.length}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Assurances enregistrées
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Building2 size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Actives
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {activeAssurances}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Conventions actives
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <Users size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Patients
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {totalPatients}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Patients liés
          </p>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Registre des assurances
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Compagnies, garants, taux, bons et délais de règlement.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[300px]">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher compagnie, garant, code..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {canManage && (
              <button
                type="button"
                onClick={() => {
                  setSelectedAssurance(null);
                  setOpenModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-95"
              >
                <Plus size={20} />
                Nouvelle assurance
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-sm">
          <table className="w-full min-w-[1200px] bg-white">
            <thead>
              <tr className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-5">Compagnie / Garant</th>
                <th className="px-6 py-5">Contact</th>
                <th className="px-6 py-5">Couverture</th>
                <th className="px-6 py-5">Règles</th>
                <th className="px-6 py-5">Statut</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6">
                      <div className="h-4 rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : filteredAssurances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Aucune assurance trouvée.
                  </td>
                </tr>
              ) : (
                filteredAssurances.map((assurance) => (
                  <tr
                    key={assurance.idAssurance}
                    className="transition hover:bg-blue-50/30"
                  >
                    <td className="px-6 py-5">
                      <p className="font-black text-slate-900">
                        {assurance.compagnie?.nomCompagnie || 'Compagnie inconnue'}
                      </p>
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Garant : {assurance.nomGarant}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        Code : {assurance.codeAssurance || '-'}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-700">
                        {assurance.contact || '-'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {assurance.telephone || '-'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {assurance.email || ''}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        {assurance.tauxCouverture}% couvert
                      </span>
                      <p className="mt-2 text-xs text-slate-400">
                        Échéance : {assurance.echeanceReglement || 30} jours
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {assurance.numeroBonObligatoire && (
                          <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600">
                            Bon obligatoire
                          </span>
                        )}
                        {assurance.controleFacturation && (
                          <span className="rounded-full bg-purple-50 px-2 py-1 text-[10px] font-bold text-purple-600">
                            Contrôle facture
                          </span>
                        )}
                        {assurance.tarifSpecial && (
                          <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                            Tarif spécial
                          </span>
                        )}
                        {assurance.gestionBonsPharmacie && (
                          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                            Bons pharmacie
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          assurance.statut === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : assurance.statut === 'suspendue'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {assurance.statut}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(assurance)}
                          className="rounded-xl bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          aria-label="Modifier assurance"
                        >
                          <Edit size={16} />
                        </button>

                        {canManage && (
                          <button
                            type="button"
                            onClick={() => handleDelete(assurance)}
                            className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                            aria-label="Supprimer assurance"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AssuranceFormModal
        key={
          selectedAssurance
            ? `edit-${selectedAssurance.idAssurance}`
            : 'new-assurance'
        }
        open={openModal}
        assurance={selectedAssurance}
        onClose={() => {
          setOpenModal(false);
          setSelectedAssurance(null);
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}