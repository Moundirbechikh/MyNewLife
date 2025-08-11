import React, { useEffect, useState } from 'react';
import { format, differenceInCalendarDays } from 'date-fns';

function DayObjectives({ date }) {
  const [objectives, setObjectives] = useState([]);

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/objectives', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (res.ok) setObjectives(data);
      } catch (err) {
        console.error('❌ Erreur chargement objectifs :', err);
      }
    };

    fetchObjectives();
  }, []);

  const isSameDay = (d1, d2) =>
    format(new Date(d1), 'yyyy-MM-dd') === format(new Date(d2), 'yyyy-MM-dd');

  const today = new Date(date);

  const daily = objectives.filter((obj) =>
    obj.category === 'daily' &&
    obj.history.some((entry) => isSameDay(entry.date, date))
  );

  const weekly = objectives.filter((obj) =>
    obj.category === 'weekly' &&
    obj.history.some((entry) => isSameDay(entry.date, date))
  );

  const monthly = objectives.filter((obj) =>
    obj.category === 'monthly' &&
    obj.lastValidated &&
    isSameDay(obj.lastValidated, date)
  );

  const historyForDay = objectives.flatMap((obj) =>
    obj.history
      .filter((entry) => isSameDay(entry.date, date))
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

  const isSameDay = (d1, d2) =>
    format(new Date(d1), 'yyyy-MM-dd') === format(new Date(d2), 'yyyy-MM-dd');

  return (
    <div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map((item) => {
          const created = new Date(item.createdAt);
          const validated = item.lastValidated ? new Date(item.lastValidated) : null;
          const today = new Date(currentDate);

          let label = '';
          let color = '';
          let icon = '';

          if (item.category === 'daily') {
            const entry = item.history.find((h) => isSameDay(h.date, today));
            if (entry?.status === 'completed') {
              label = 'Validé';
              color = 'text-green-600';
              icon = '✅';
            } else {
              label = 'pas validé';
              color = 'text-red-500';
              icon = '❌';
            }
          }

          else if (item.category === 'weekly') {
            const entry = item.history.find((h) => isSameDay(h.date, today));

            if (entry?.status === 'completed') {
              label = 'En cours (validé aujourd’hui)';
              color = 'text-yellow-500';
              icon = '🟡';
            } else if (entry) {
              label = 'En cours (non validé aujourd’hui)';
              color = 'text-orange-500';
              icon = '🟠';
            } else {
              label = 'Not completed';
              color = 'text-red-500';
              icon = '❌';
            }
          }

          else if (item.category === 'monthly') {
            if (validated && isSameDay(validated, today)) {
              const days = differenceInCalendarDays(validated, created);
              label = `Validé en ${days} jour${days > 1 ? 's' : ''}`;
              color = 'text-green-600';
              icon = '✅';
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
