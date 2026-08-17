import { createIncident, updateIncident } from "@/lib/actions/incidents";
import { INCIDENT_STATUT_LABELS, INCIDENT_STATUT_ORDER, METIER_LABELS } from "@/lib/constants";
import { IncidentStatutBadge } from "@/components/StatusBadge";
import type { Incident, Prestataire } from "@/generated/prisma/client";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

function fmtDateTime(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);
}

export function IncidentsPanel({
  propertyId,
  incidents,
  prestataires,
}: {
  propertyId: string;
  incidents: (Incident & { prestataire: Prestataire | null })[];
  prestataires: Prestataire[];
}) {
  const createAction = createIncident.bind(null, propertyId);
  const ouverts = incidents.filter((i) => i.statut !== "RESOLU").length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">
          Maintenance ({ouverts} incident(s) ouverts sur {incidents.length})
        </h2>
      </div>

      <form action={createAction} className="mb-5 space-y-3 rounded-lg border border-neutral-100 bg-neutral-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Signaler un incident</p>
        <textarea
          name="description"
          required
          placeholder="Ex : la climatisation de la chambre ne refroidit plus"
          rows={2}
          className={inputClass}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select name="prestataireId" defaultValue="" className={inputClass}>
            <option value="">Assigner plus tard</option>
            {prestataires.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom} · {METIER_LABELS[p.metier]}
              </option>
            ))}
          </select>
          <input name="photoUrl" placeholder="Lien photo (optionnel)" className={inputClass} />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Signaler
        </button>
      </form>

      {incidents.length === 0 ? (
        <p className="text-sm text-neutral-400">Aucun incident signalé pour ce bien.</p>
      ) : (
        <ul className="space-y-3">
          {incidents.map((incident) => {
            const updateAction = updateIncident.bind(null, incident.id, propertyId);
            return (
              <li key={incident.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{incident.description}</p>
                    <p className="text-xs text-neutral-400">
                      Signalé le {fmtDateTime(incident.signaleLe)}
                      {incident.resoluLe ? ` · Résolu le ${fmtDateTime(incident.resoluLe)}` : ""}
                    </p>
                  </div>
                  <IncidentStatutBadge statut={incident.statut} />
                </div>

                <form action={updateAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <select name="statut" defaultValue={incident.statut} className={inputClass}>
                    {INCIDENT_STATUT_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {INCIDENT_STATUT_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <select name="prestataireId" defaultValue={incident.prestataireId ?? ""} className={inputClass}>
                    <option value="">Non assigné</option>
                    {prestataires.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nom} · {METIER_LABELS[p.metier]}
                      </option>
                    ))}
                  </select>
                  <input
                    name="photoUrl"
                    placeholder="Lien photo de contrôle"
                    defaultValue={incident.photoUrl ?? ""}
                    className={`sm:col-span-2 ${inputClass}`}
                  />
                  <textarea
                    name="noteResolution"
                    placeholder="Note de résolution"
                    defaultValue={incident.noteResolution ?? ""}
                    rows={2}
                    className={`sm:col-span-2 ${inputClass}`}
                  />
                  <button
                    type="submit"
                    className="sm:col-span-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Mettre à jour
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
