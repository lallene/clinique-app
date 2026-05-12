'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  X, Plus, Trash2, Stethoscope, ClipboardList, Activity,
  Pill, FileText, ChevronDown, Search, User,
} from 'lucide-react';

import MotifFormModal from '@/components/motifs/motif-form-modal';
import AntecedentFormModal from '@/components/antecedents/antecedent-form-modal';

// ─── Types ────────────────────────────────────────────────────────────────────

type Patient = {
  id_patient: number;
  nom: string;
  prenoms?: string | null;
  numeroDossier?: string | null;
};

type Motif = {
  idMotif: number;
  libelle: string;
  categorie?: string | null;
  actif: boolean;
};

type Antecedent = {
  idAntecedent: number;
  libelle: string;
  categorie?: string | null;
  actif: boolean;
};

type ProduitPharmacie = {
  idProduit: number;
  nomProduit: string;
  dosage?: string | null;
  forme?: string | null;
  unite?: string | null;
  quantiteStock: number;
  actif: boolean;
};

type LignePrescriptionDraft = {
  produitId: number;
  nomProduit: string;
  dosage?: string | null;
  quantite: number;
  posologie: string;
  duree: string;
  stockDisponible: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function ConsultationFormModal({ open, onClose, onSaved }: Props) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [antecedents, setAntecedents] = useState<Antecedent[]>([]);
  const [produits, setProduits] = useState<ProduitPharmacie[]>([]);

  const [patientId, setPatientId] = useState('');
  const [selectedMotifIds, setSelectedMotifIds] = useState<number[]>([]);
  const [motifSearch, setMotifSearch] = useState('');
  const [selectedAntecedentIds, setSelectedAntecedentIds] = useState<number[]>([]);
  const [antecedentSearch, setAntecedentSearch] = useState('');

  const [openMotifModal, setOpenMotifModal] = useState(false);
  const [openAntecedentModal, setOpenAntecedentModal] = useState(false);

  const [temperature, setTemperature] = useState('');
  const [tension, setTension] = useState('');
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [pouls, setPouls] = useState('');
  const [saturation, setSaturation] = useState('');

  const [diagnostic, setDiagnostic] = useState('');
  const [compteRendu, setCompteRendu] = useState('');

  const [selectedProduitId, setSelectedProduitId] = useState('');
  const [quantitePrescription, setQuantitePrescription] = useState('1');
  const [posologie, setPosologie] = useState('');
  const [duree, setDuree] = useState('');
  const [lignesPrescription, setLignesPrescription] = useState<LignePrescriptionDraft[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedPatient = patients.find((p) => String(p.id_patient) === patientId);

  const motifsActifs = useMemo(() => motifs.filter((m) => m.actif), [motifs]);
  const filteredMotifs = useMemo(() => {
    const q = motifSearch.toLowerCase().trim();
    if (!q) return motifsActifs.slice(0, 12);
    return motifsActifs.filter(
      (m) => m.libelle.toLowerCase().includes(q) || (m.categorie || '').toLowerCase().includes(q),
    );
  }, [motifsActifs, motifSearch]);

  const antecedentsActifs = useMemo(() => antecedents.filter((a) => a.actif), [antecedents]);
  const filteredAntecedents = useMemo(() => {
    const q = antecedentSearch.toLowerCase().trim();
    if (!q) return antecedentsActifs.slice(0, 12);
    return antecedentsActifs.filter(
      (a) => a.libelle.toLowerCase().includes(q) || (a.categorie || '').toLowerCase().includes(q),
    );
  }, [antecedentsActifs, antecedentSearch]);

  const produitsActifs = useMemo(() => produits.filter((p) => p.actif), [produits]);
  const selectedProduit = produitsActifs.find((p) => String(p.idProduit) === selectedProduitId);

  useEffect(() => {
    if (!open) return;
    Promise.all([
      fetch('/api/patients', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/motifs', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/antecedents', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/produits', { cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([p, m, a, pr]) => {
        setPatients(Array.isArray(p) ? p : []);
        setMotifs(Array.isArray(m) ? m : []);
        setAntecedents(Array.isArray(a) ? a : []);
        setProduits(Array.isArray(pr) ? pr : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur chargement données.'));
  }, [open]);

  if (!open) return null;

  function resetForm() {
    setPatientId('');
    setSelectedMotifIds([]); setMotifSearch('');
    setSelectedAntecedentIds([]); setAntecedentSearch('');
    setTemperature(''); setTension(''); setPoids(''); setTaille(''); setPouls(''); setSaturation('');
    setDiagnostic(''); setCompteRendu('');
    setSelectedProduitId(''); setQuantitePrescription('1'); setPosologie(''); setDuree('');
    setLignesPrescription([]); setError('');
  }

  function toggleMotif(id: number) {
    setSelectedMotifIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function toggleAntecedent(id: number) {
    setSelectedAntecedentIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  async function handleMotifCreated() {
    const data = await fetch('/api/motifs', { cache: 'no-store' }).then((r) => r.json());
    setMotifs(Array.isArray(data) ? data : []);
    setOpenMotifModal(false);
  }

  async function handleAntecedentCreated() {
    const data = await fetch('/api/antecedents', { cache: 'no-store' }).then((r) => r.json());
    setAntecedents(Array.isArray(data) ? data : []);
    setOpenAntecedentModal(false);
  }

  function addLignePrescription() {
    if (!selectedProduit) { setError('Veuillez sélectionner un produit.'); return; }
    const quantite = Number(quantitePrescription);
    if (Number.isNaN(quantite) || quantite <= 0) { setError('Quantité invalide.'); return; }
    if (!posologie.trim()) { setError('Veuillez renseigner la posologie.'); return; }
    setLignesPrescription((prev) => [
      ...prev,
      {
        produitId: selectedProduit.idProduit,
        nomProduit: selectedProduit.nomProduit,
        dosage: selectedProduit.dosage,
        quantite,
        posologie: posologie.trim(),
        duree: duree.trim(),
        stockDisponible: selectedProduit.quantiteStock,
      },
    ]);
    setSelectedProduitId(''); setQuantitePrescription('1'); setPosologie(''); setDuree(''); setError('');
  }

  function removeLignePrescription(index: number) {
    setLignesPrescription((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    if (!patientId) { setError('Veuillez sélectionner un patient.'); setSubmitting(false); return; }
    if (selectedMotifIds.length === 0) { setError('Veuillez sélectionner au moins un motif de consultation.'); setSubmitting(false); return; }
    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: Number(patientId),
          motifIds: selectedMotifIds,
          antecedentIds: selectedAntecedentIds,
          temperature, tension, poids, taille, pouls, saturation,
          diagnostic, compteRendu, lignesPrescription,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur création consultation.');
      resetForm();
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-md">
        <div className="relative flex w-full max-w-5xl max-h-[95vh] flex-col overflow-hidden rounded-2xl bg-slate-50 shadow-2xl">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-[#0f3460] via-[#0a5c7a] to-[#0d8a6b]">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white opacity-10" />
            <div className="pointer-events-none absolute -bottom-8 right-36 h-28 w-28 rounded-full bg-white opacity-10" />

            <div className="relative flex items-center justify-between px-8 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15"aria-hidden="true">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div> 
                <div>
                  <h2 className="text-lg font-bold leading-tight text-white">Nouvelle consultation</h2>
                  <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    Clinique Médicale Saint Raphaël de Séguéla
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer le formulaire"
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* ── Scrollable body ─────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden" noValidate>
            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto">

              {/* 1. Patient */}
              <section className="px-8 py-6">
                <SectionHeading icon={<User className="h-4 w-4" />} color="teal" label="Patient" />

                <div className="mt-4 space-y-3">
                  <label
                    htmlFor="select-patient"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Patient{' '}
                    <span className="text-rose-500" aria-hidden="true">*</span>
                    <span className="sr-only">(obligatoire)</span>
                  </label>

                  <div className="relative">
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <select
                      id="select-patient"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      required
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                      <option value="">— Choisir un patient —</option>
                      {patients.map((p) => (
                        <option key={p.id_patient} value={p.id_patient}>
                          {p.numeroDossier ? `[${p.numeroDossier}] ` : ''}{p.prenoms || ''} {p.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPatient && (
                    <div className="flex items-center gap-4 rounded-xl border border-teal-100 bg-teal-50 p-4">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0f3460] to-[#0d8a6b] text-sm font-bold text-white"
                        aria-hidden="true"
                      >
                        {((selectedPatient.prenoms || selectedPatient.nom)[0] || '').toUpperCase()}
                        {(selectedPatient.nom[0] || '').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {selectedPatient.prenoms || ''} {selectedPatient.nom}
                        </p>
                        <p className="mt-0.5 text-xs text-teal-700">
                          N° dossier : <span className="font-bold">{selectedPatient.numeroDossier || '—'}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* 2. Motifs */}
              <section className="px-8 py-6">
                <SectionHeading icon={<ClipboardList className="h-4 w-4" />} color="blue" label="Motifs de consultation" />

                <div className="mt-4 space-y-3">
                  <SelectorBox
                    searchId="search-motifs"
                    searchValue={motifSearch}
                    onSearchChange={setMotifSearch}
                    placeholder="Rechercher : fièvre, toux, douleur…"
                    emptySelectedText="Aucun motif sélectionné"
                    emptyListText="Aucun motif trouvé."
                    selectedIds={selectedMotifIds}
                    items={motifs}
                    filteredItems={filteredMotifs}
                    idKey="idMotif"
                    onToggle={toggleMotif}
                    accentColor="blue"
                  />
                  <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-xs text-blue-700">Motif introuvable ? Créez-le sans quitter la consultation.</p>
                    <button
                      type="button"
                      onClick={() => setOpenMotifModal(true)}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      Ajouter un motif
                    </button>
                  </div>
                </div>
              </section>

              {/* 3. Antécédents */}
              <section className="px-8 py-6">
                <SectionHeading icon={<FileText className="h-4 w-4" />} color="purple" label="Antécédents médicaux" />

                <div className="mt-4 space-y-3">
                  <SelectorBox
                    searchId="search-antecedents"
                    searchValue={antecedentSearch}
                    onSearchChange={setAntecedentSearch}
                    placeholder="Rechercher : paludisme, diabète, HTA…"
                    emptySelectedText="Aucun antécédent sélectionné"
                    emptyListText="Aucun antécédent trouvé."
                    selectedIds={selectedAntecedentIds}
                    items={antecedents}
                    filteredItems={filteredAntecedents}
                    idKey="idAntecedent"
                    onToggle={toggleAntecedent}
                    accentColor="purple"
                  />
                  <div className="flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50 px-4 py-3">
                    <p className="text-xs text-purple-700">Antécédent introuvable ? Créez-le sans quitter la consultation.</p>
                    <button
                      type="button"
                      onClick={() => setOpenAntecedentModal(true)}
                      className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      Ajouter un antécédent
                    </button>
                  </div>
                </div>
              </section>

              {/* 4. Constantes vitales */}
              <section className="px-8 py-6">
                <SectionHeading icon={<Activity className="h-4 w-4" />} color="rose" label="Constantes vitales" />

                <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  <VitalCard inputId="vital-temperature" label="Température"    unit="°C"   value={temperature} onChange={setTemperature} placeholder="37.5" icon="🌡️" accentColor="#f43f5e" />
                  <VitalCard inputId="vital-tension"     label="Tension"        unit="mmHg" value={tension}     onChange={setTension}     placeholder="12/8" icon="💉" accentColor="#ef4444" />
                  <VitalCard inputId="vital-poids"       label="Poids"          unit="kg"   value={poids}       onChange={setPoids}       placeholder="70"   icon="⚖️" accentColor="#f59e0b" />
                  <VitalCard inputId="vital-taille"      label="Taille"         unit="cm"   value={taille}      onChange={setTaille}      placeholder="175"  icon="📏" accentColor="#0ea5e9" />
                  <VitalCard inputId="vital-pouls"       label="Pouls"          unit="bpm"  value={pouls}       onChange={setPouls}       placeholder="80"   icon="❤️" accentColor="#ec4899" />
                  <VitalCard inputId="vital-saturation"  label="SpO₂"           unit="%"    value={saturation}  onChange={setSaturation}  placeholder="98"   icon="🫁" accentColor="#14b8a6" />
                </div>
              </section>

              {/* 5. Prescription */}
              <section className="px-8 py-6">
                <SectionHeading icon={<Pill className="h-4 w-4" />} color="orange" label="Prescription médicale" />

                <div className="mt-4 space-y-4">
                  {/* Add-line form */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-[1fr_90px_1fr_160px]">
                      <div className="space-y-1.5">
                        <label htmlFor="select-produit" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Médicament
                        </label>
                        <div className="relative">
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                          <select
                            id="select-produit"
                            value={selectedProduitId}
                            onChange={(e) => setSelectedProduitId(e.target.value)}
                            className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 pr-8 text-sm font-medium outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                          >
                            <option value="">— Sélectionner —</option>
                            {produitsActifs.map((p) => (
                              <option key={p.idProduit} value={p.idProduit}>
                                {p.nomProduit}{p.dosage ? ` ${p.dosage}` : ''} (stock : {p.quantiteStock})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="input-quantite" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Qté
                        </label>
                        <input
                          id="input-quantite"
                          type="number"
                          min="1"
                          value={quantitePrescription}
                          onChange={(e) => setQuantitePrescription(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-sm font-bold outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="input-posologie" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Posologie
                        </label>
                        <input
                          id="input-posologie"
                          value={posologie}
                          onChange={(e) => setPosologie(e.target.value)}
                          placeholder="Ex : 1 cp matin et soir"
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="input-duree" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Durée
                        </label>
                        <input
                          id="input-duree"
                          value={duree}
                          onChange={(e) => setDuree(e.target.value)}
                          placeholder="Ex : 5 jours"
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
                        />
                      </div>
                    </div>

                    {selectedProduit && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-4 py-2.5">
                        <Pill className="h-4 w-4 shrink-0 text-orange-500" aria-hidden="true" />
                        <span className="text-xs text-orange-700">
                          Stock disponible :{' '}
                          <span className="font-bold">
                            {selectedProduit.quantiteStock} {selectedProduit.unite || 'unités'}
                          </span>
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={addLignePrescription}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-orange-300 py-2.5 text-sm font-semibold text-orange-600 transition hover:border-orange-400 hover:bg-orange-50"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Ajouter à la prescription
                    </button>
                  </div>

                  {/* Prescription table */}
                  {lignesPrescription.length > 0 ? (
                    <div className="overflow-x-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <table className="w-full min-w-[640px] text-sm">
                        <thead>
                          <tr className="bg-gradient-to-br from-[#0f3460] to-[#0a5c7a]">
                            {['Médicament', 'Qté', 'Posologie', 'Durée', 'Stock', ''].map((h, i) => (
                              <th
                                key={i}
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/80"
                              >
                                {h || <span className="sr-only">Actions</span>}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {lignesPrescription.map((ligne, i) => (
                            <tr key={`${ligne.produitId}-${i}`} className="border-t border-slate-100 hover:bg-slate-50">
                              <td className="px-4 py-3 font-semibold text-slate-800">
                                {ligne.nomProduit}{ligne.dosage ? ` ${ligne.dosage}` : ''}
                              </td>
                              <td className="px-4 py-3 text-slate-600">{ligne.quantite}</td>
                              <td className="px-4 py-3 text-slate-600">{ligne.posologie}</td>
                              <td className="px-4 py-3 text-slate-600">{ligne.duree || '—'}</td>
                              <td className="px-4 py-3">
                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  ligne.stockDisponible < 10
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-teal-100 text-teal-700'
                                }`}>
                                  {ligne.stockDisponible}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeLignePrescription(i)}
                                  aria-label={`Retirer ${ligne.nomProduit}${ligne.dosage ? ` ${ligne.dosage}` : ''} de la prescription`}
                                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                                >
                                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center">
                      <Pill className="mx-auto mb-2 h-8 w-8 text-slate-300" aria-hidden="true" />
                      <p className="text-sm text-slate-400">Aucun médicament prescrit</p>
                    </div>
                  )}
                </div>
              </section>

              {/* 6. Diagnostic & compte rendu */}
              <section className="px-8 py-6">
                <SectionHeading icon={<Stethoscope className="h-4 w-4" />} color="teal" label="Diagnostic & compte rendu" />

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="textarea-diagnostic" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Diagnostic
                    </label>
                    <textarea
                      id="textarea-diagnostic"
                      value={diagnostic}
                      onChange={(e) => setDiagnostic(e.target.value)}
                      rows={4}
                      placeholder="Ex : PALUDISME SIMPLE, ANÉMIE FERRIPRIVE…"
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="textarea-compte-rendu" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Compte rendu de consultation
                    </label>
                    <textarea
                      id="textarea-compte-rendu"
                      value={compteRendu}
                      onChange={(e) => setCompteRendu(e.target.value)}
                      rows={5}
                      placeholder="Résumé détaillé de la consultation, observations, recommandations…"
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>
              </section>

            </div>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <div className="shrink-0 border-t border-slate-100 bg-white px-8 py-4">
              {error && (
                <div role="alert" className="mb-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <span className="mt-0.5 text-rose-500" aria-hidden="true">⚠</span>
                  <p className="text-sm font-medium text-rose-700">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-6 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#0f3460] to-[#0d8a6b] px-8 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Enregistrement…
                    </>
                  ) : (
                    'Enregistrer la consultation'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <MotifFormModal
        open={openMotifModal}
        motif={null}
        onClose={() => setOpenMotifModal(false)}
        onSaved={handleMotifCreated}
      />
      <AntecedentFormModal
        open={openAntecedentModal}
        antecedent={null}
        onClose={() => setOpenAntecedentModal(false)}
        onSaved={handleAntecedentCreated}
      />
    </>
  );
}

// ─── SectionHeading ───────────────────────────────────────────────────────────

type SectionColor = 'teal' | 'blue' | 'purple' | 'rose' | 'orange';

const sectionColorMap: Record<SectionColor, string> = {
  teal:   'bg-teal-100 text-teal-700',
  blue:   'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  rose:   'bg-rose-100 text-rose-700',
  orange: 'bg-orange-100 text-orange-700',
};

function SectionHeading({ icon, color, label }: { icon: React.ReactNode; color: SectionColor; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${sectionColorMap[color]}`} aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">{label}</h3>
    </div>
  );
}

// ─── SelectorBox ─────────────────────────────────────────────────────────────

type SelectorItem = {
  libelle: string;
  categorie?: string | null;
  actif: boolean;
  [key: string]: string | number | boolean | null | undefined;
};

function SelectorBox<T extends SelectorItem>({
  searchId, searchValue, onSearchChange, placeholder,
  emptySelectedText, emptyListText, selectedIds, items, filteredItems,
  idKey, onToggle, accentColor,
}: {
  searchId: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  placeholder: string;
  emptySelectedText: string;
  emptyListText: string;
  selectedIds: number[];
  items: T[];
  filteredItems: T[];
  idKey: keyof T;
  onToggle: (id: number) => void;
  accentColor: 'blue' | 'purple';
}) {
  const accent =
    accentColor === 'blue'
      ? { badge: 'bg-blue-600 text-white', active: 'border-blue-300 bg-blue-50 text-blue-800', ring: 'focus:ring-2 focus:ring-blue-100 focus:border-blue-400' }
      : { badge: 'bg-purple-600 text-white', active: 'border-purple-300 bg-purple-50 text-purple-800', ring: 'focus:ring-2 focus:ring-purple-100 focus:border-purple-400' };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <label htmlFor={searchId} className="sr-only">Rechercher</label>
        <input
          id={searchId}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm font-medium shadow-sm outline-none transition ${accent.ring}`}
        />
      </div>

      <div className="flex min-h-[36px] flex-wrap gap-1.5" aria-live="polite" aria-label="Éléments sélectionnés">
        {selectedIds.length === 0 ? (
          <span className="self-center text-xs text-slate-400">{emptySelectedText}</span>
        ) : (
          selectedIds.map((id) => {
            const item = items.find((e) => Number(e[idKey]) === id);
            if (!item) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggle(id)}
                aria-label={`Retirer ${item.libelle}`}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-80 ${accent.badge}`}
              >
                {item.libelle}
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            );
          })
        )}
      </div>

      <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-100 bg-white p-3 shadow-inner">
  <div className="grid gap-1.5 md:grid-cols-2">
    {filteredItems.map((item) => {
      const id = Number(item[idKey]);
      const checked = selectedIds.includes(id);

      return (
        <button
          key={id}
          type="button"
          onClick={() => onToggle(id)}
          className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            checked
              ? accent.active
              : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200 hover:bg-white'
          }`}
        >
          <span>{item.libelle}</span>

          {item.categorie && (
            <span className="ml-2 shrink-0 text-[10px] font-normal text-slate-400">
              {item.categorie}
            </span>
          )}
        </button>
      );
    })}

    {filteredItems.length === 0 && (
      <p className="col-span-2 py-4 text-center text-xs text-slate-400">
        {emptyListText}
      </p>
    )}
  </div>
</div>
    </div>
  );
}

// ─── VitalCard ────────────────────────────────────────────────────────────────

function VitalCard({
  inputId, label, value, onChange, placeholder, icon, accentColor,
}: {
  inputId: string;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: string;
  accentColor: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-base" aria-hidden="true">{icon}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            accentColor === 'blue'
              ? 'bg-blue-100 text-blue-700'
              : accentColor === 'purple'
              ? 'bg-purple-100 text-purple-700'
              : accentColor === 'red'
              ? 'bg-red-100 text-red-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        ></span>
      </div>
      <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold text-slate-500">
        {label}
      </label>
      <input
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded-lg border border-slate-200 bg-slate-50
          px-3 py-2 text-lg font-bold text-slate-800 outline-none transition
          caret-emerald-600
          focus:border-emerald-600 focus:bg-white
        "
      />
    </div>
  );
}