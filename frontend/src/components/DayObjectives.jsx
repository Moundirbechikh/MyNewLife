import React from 'react';
import { format, differenceInCalendarDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const TZ = 'Africa/Algiers';

// Compare au jour près dans le fuseau Africa/Algiers
const sameLocalDay = (d1, d2) =>
  formatInTimeZone(new Date(d1), TZ, 'yyyy-MM-dd') ===
  formatInTimeZone(new Date(d2), TZ, 'yyyy-MM-dd');

function DayObjectives({ date, objectives = [] }) {
  const daily = objectives.filter(o => o.category === 'daily');
  const weekly = objectives.filter(o => o.category === 'weekly');
  const monthly = objectives.filter(o => o.category === 'monthly');

  const historyForDay = objectives.flatMap((obj) =>
    (obj.history || [])
      .filter((entry) => sameLocalDay(entry.date, date))
      .map((entry) => ({
        title: obj.title,
        category: obj.category,
        status: entry.status,
      }))
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">📌 Objectifs du {format(date, 'dd MMMM yyyy')}</h2>

      {daily.length || weekly.length || monthly.length ? (
        <div className="space-y-4">
          <ObjectiveList title="🗓️ Daily" items={daily} currentDate={date} />
          <ObjectiveList title="📅 Weekly" items={weekly} currentDate={date} />
          <ObjectiveList title="📆 Monthly" items={monthly} currentDate={date} />
        </div>
      ) : (
        <p className="text-gray-500">Aucun objectif enregistré pour ce jour.</p>
      )}

      {historyForDay.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">🕓 Historique du jour</h3>
          <ul className="space-y-1">
            {historyForDay.map((entry, index) => (
              <li key={index} className="flex justify-between text-gray-700">
                <span>{entry.title} ({entry.category})</span>
                <span className={
                  entry.status === 'completed' ? 'text-green-600' :
                  entry.status === 'skipped' ? 'text-yellow-500' :
                  'text-red-500'
                }>
                  {entry.status === 'completed' ? '✅' : entry.status === 'skipped' ? '⏭️' : '❌'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ObjectiveList({ title, items, currentDate }) {
  if (!items || items.length === 0) return null;

  const now = new Date();
  const relation = differenceInCalendarDays(now, new Date(currentDate)); // >0 passé, 0 aujourd'hui, <0 futur

  return (
    <div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map((item) => {
          const entry = (item.history || []).find((h) => sameLocalDay(h.date, currentDate));

          let label = '';
          let color = '';
          let icon = '';

          if (item.category === 'daily') {
            if (entry) {
              if (entry.status === 'completed') { label = 'Validé'; color = 'text-green-600'; icon = '✅'; }
              else if (entry.status === 'failed') { label = 'Non validé'; color = 'text-red-500'; icon = '❌'; }
            } else {
              if (relation === 0) { label = 'En attente'; color = 'text-gray-600'; icon = '⏳'; }
              else if (relation > 0) { label = 'Non validé'; color = 'text-red-500'; icon = '❌'; }
              else { label = 'À venir'; color = 'text-gray-400'; icon = '…'; }
            }
          }

          else if (item.category === 'weekly') {
            if (entry) {
              if (entry.status === 'completed') { label = 'Validé aujourd’hui'; color = 'text-green-600'; icon = '✅'; }
              else if (entry.status === 'skipped') { label = 'Non validé aujourd’hui'; color = 'text-orange-500'; icon = '🟠'; }
              else if (entry.status === 'failed') { label = 'Échec (fin de cycle)'; color = 'text-red-500'; icon = '❌'; }
            } else {
              if (relation === 0) { label = 'En cours (à valider)'; color = 'text-gray-600'; icon = '⏳'; }
              else if (relation > 0) { label = 'Non validé (jour passé)'; color = 'text-orange-500'; icon = '🟠'; }
              else { label = 'À venir'; color = 'text-gray-400'; icon = '…'; }
            }
          }
          // monthly → même logique que ton code existant
                             else if (item.category === 'monthly') {
            const created = new Date(item.createdAt);
            const validated = item.lastValidated ? new Date(item.lastValidated) : null;
            if (validated && sameLocalDay(validated, currentDate)) {
              const days = differenceInCalendarDays(validated, created);
              label = `Validé en ${days} jour${days > 1 ? 's' : ''}`;
              color = 'text-green-600';
              icon = '✅';
            } else {
              if (relation === 0) { label = 'En attente'; color = 'text-gray-600'; icon = '⏳'; }
              else if (relation > 0) { label = 'Non validé'; color = 'text-red-500'; icon = '❌'; }
              else { label = 'À venir'; color = 'text-gray-400'; icon = '…'; }
            }
          }

          return (
            <li key={item._id} className="text-gray-700 flex justify-between">
              <span>{item.title}</span>
              {label && (
                <span className={`${color} flex items-center gap-1`}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default DayObjectives;
