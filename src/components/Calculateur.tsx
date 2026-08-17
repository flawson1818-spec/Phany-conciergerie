function fmtFCFA(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";
}

export function Calculateur({
  loyerEstime,
  chargesMensuelles,
  commissionPct,
}: {
  loyerEstime: number | null;
  chargesMensuelles: number | null;
  commissionPct: number;
}) {
  const revenu = loyerEstime ?? 0;
  const charges = chargesMensuelles ?? 0;
  const commission = (revenu * commissionPct) / 100;
  const netProprietaire = revenu - commission - charges;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-neutral-900">Calculateur PHANY de rentabilité</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-neutral-500">Revenu mensuel brut estimé</dt>
          <dd className="font-medium text-neutral-900">{fmtFCFA(revenu)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-neutral-500">Commission PHANY ({commissionPct}%)</dt>
          <dd className="font-medium text-red-600">− {fmtFCFA(commission)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-neutral-500">Charges mensuelles (ménage, maintenance...)</dt>
          <dd className="font-medium text-red-600">− {fmtFCFA(charges)}</dd>
        </div>
        <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2">
          <dt className="font-semibold text-neutral-900">Net estimé propriétaire / mois</dt>
          <dd className="font-semibold text-emerald-600">{fmtFCFA(netProprietaire)}</dd>
        </div>
        <div className="flex justify-between text-xs text-neutral-400">
          <dt>Net estimé propriétaire / an</dt>
          <dd>{fmtFCFA(netProprietaire * 12)}</dd>
        </div>
      </dl>
    </div>
  );
}
