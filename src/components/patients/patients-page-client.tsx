"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, RefreshCcw, Users } from "lucide-react";
import PatientFormModal from "./patient-form-modal";

type Patient = {
  id_patient: number;
  code_patient?: string | null;
  nom: string;
  prenom?: string | null;
  sexe?: string | null;
  dateNaissance?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  personne_contact?: string | null;
  emploi?: string | null;
  numero_dossier?: string | null;
  assurance_id?: number | null;
};

export default function PatientsPageClient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");

  async function fetchPatients() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/patients", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Impossible de charger les patients.");
      }

      const data = await response.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
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
      const fullName = `${patient.prenom ?? ""} ${patient.nom ?? ""}`.toLowerCase();
      const phone = (patient.telephone ?? "").toLowerCase();
      const dossier = (patient.numero_dossier ?? "").toLowerCase();
      const code = (patient.code_patient ?? "").toLowerCase();

      return (
        fullName.includes(q) ||
        phone.includes(q) ||
        dossier.includes(q) ||
        code.includes(q)
      );
    });
  }, [patients, search]);

  async function handlePatientCreated() {
    setOpenModal(false);
    await fetchPatients();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total
            </span>
          </div>
          <p className="text-sm text-gray-500">Patients enregistrés</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{patients.length}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Patients filtrés</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {filteredPatients.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Recherche active</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {search ? search : "Aucune"}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Liste des patients</h2>
            <p className="text-sm text-gray-500">
              Rechercher, consulter et ajouter des patients
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-[280px]">
              <label htmlFor="patient-search" className="sr-only">
                Rechercher un patient
              </label>
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="patient-search"
                type="text"
                placeholder="Rechercher par nom, téléphone, dossier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400"
              />
            </div>

            <button
              type="button"
              onClick={fetchPatients}
              title="Actualiser la liste des patients"
              aria-label="Actualiser la liste des patients"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <RefreshCcw size={16} />
              Actualiser
            </button>

            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus size={16} />
              Ajouter un patient
            </button>
          </div>
        </div>

        {error ? (
          <div
            className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Patient
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Sexe
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Téléphone
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Dossier
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Date naissance
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Adresse
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      Aucun patient trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id_patient} className="hover:bg-gray-50/70">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {patient.prenom ?? ""} {patient.nom}
                          </p>
                          <p className="text-xs text-gray-500">
                            {patient.code_patient || "Code non défini"}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {patient.sexe || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {patient.telephone || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {patient.numero_dossier || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {patient.dateNaissance
                          ? new Date(patient.dateNaissance).toLocaleDateString("fr-FR")
                          : "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {patient.adresse || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PatientFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={handlePatientCreated}
      />
    </div>
  );
}