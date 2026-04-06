"use client";

import { useState } from "react";
import { X } from "lucide-react";

type PatientFormModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function PatientFormModal({
  open,
  onClose,
  onCreated,
}: PatientFormModalProps) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [sexe, setSexe] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [numeroDossier, setNumeroDossier] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prenom: prenom || null,
          sexe: sexe || null,
          telephone: telephone || null,
          adresse: adresse || null,
          dateNaissance: dateNaissance || null,
          numero_dossier: numeroDossier || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible d'ajouter le patient.");
      }

      setNom("");
      setPrenom("");
      setSexe("");
      setTelephone("");
      setAdresse("");
      setDateNaissance("");
      setNumeroDossier("");

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="patient-modal-title"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 id="patient-modal-title" className="text-xl font-bold text-gray-900">
              Ajouter un patient
            </h3>
            <p className="text-sm text-gray-500">
              Renseignez les informations principales du patient
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            title="Fermer"
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="patient-nom"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Nom *
              </label>
              <input
                id="patient-nom"
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom du patient"
                required
                disabled={submitting}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-400 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label
                htmlFor="patient-prenom"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Prénom
              </label>
              <input
                id="patient-prenom"
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom du patient"
                disabled={submitting}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-400 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label
                htmlFor="patient-sexe"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Sexe
              </label>
              <select
                id="patient-sexe"
                value={sexe}
                onChange={(e) => setSexe(e.target.value)}
                disabled={submitting}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-400 disabled:bg-gray-50"
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="patient-telephone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Téléphone
              </label>
              <input
                id="patient-telephone"
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Numéro de téléphone"
                disabled={submitting}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-400 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label
                htmlFor="patient-date-naissance"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Date de naissance
              </label>
              <input
                id="patient-date-naissance"
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                disabled={submitting}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-400 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label
                htmlFor="patient-numero-dossier"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Numéro de dossier
              </label>
              <input
                id="patient-numero-dossier"
                type="text"
                value={numeroDossier}
                onChange={(e) => setNumeroDossier(e.target.value)}
                placeholder="Ex: DOS-2026-001"
                disabled={submitting}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-400 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="patient-adresse"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Adresse
            </label>
            <textarea
              id="patient-adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              rows={3}
              placeholder="Adresse complète du patient"
              disabled={submitting}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-400 disabled:bg-gray-50"
            />
          </div>

          {error ? (
            <div
              className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}