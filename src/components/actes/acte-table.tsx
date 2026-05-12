type ActeMedical = {
  idActe: number;
  libelle: string;
  categorie: string;
  cotation?: string | null;
  prixUnitaire: number;
  forfait: boolean;
  etat: string;
};

type Props = {
  actes: ActeMedical[];
  loading: boolean;
};

export default function ActeTable({ actes, loading }: Props) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-100">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <th className="px-6 py-4">Libellé</th>
            <th className="px-6 py-4">Catégorie</th>
            <th className="px-6 py-4">Cotation</th>
            <th className="px-6 py-4">Prix</th>
            <th className="px-6 py-4">Forfait</th>
            <th className="px-6 py-4">État</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center">
                Chargement...
              </td>
            </tr>
          ) : actes.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center">
                Aucun acte enregistré
              </td>
            </tr>
          ) : (
            actes.map((acte) => (
              <tr key={acte.idActe} className="border-t border-slate-100">
                <td className="px-6 py-4 font-bold">{acte.libelle}</td>
                <td className="px-6 py-4">{acte.categorie}</td>
                <td className="px-6 py-4">{acte.cotation || '-'}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">
                  {acte.prixUnitaire.toLocaleString()} FCFA
                </td>
                <td className="px-6 py-4">{acte.forfait ? 'Oui' : 'Non'}</td>
                <td className="px-6 py-4">{acte.etat}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}