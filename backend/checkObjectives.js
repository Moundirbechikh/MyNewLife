const Objective = require('./Models/objective');
const { format, differenceInCalendarDays, addDays, subDays, set } = require('date-fns');
const { zonedTimeToUtc } = require('date-fns-tz');

// Utilise 23:59 heure locale Africa/Algiers
function endOfDayLocal(date) {
  return zonedTimeToUtc(
    set(date, { hours: 23, minutes: 59, seconds: 0, milliseconds: 0 }),
    'Africa/Algiers'
  );
}

function sameDay(d1, d2) {
  return format(d1, 'yyyy-MM-dd') === format(d2, 'yyyy-MM-dd');
}

async function checkObjectives() {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // ===== DAILY =====
  const dailyObjectives = await Objective.find({ category: 'daily' });

  for (const obj of dailyObjectives) {
    const lastEntry = obj.history.length > 0 ? obj.history[obj.history.length - 1] : null;
    const lastDate = lastEntry ? new Date(lastEntry.date) : subDays(today, 1);

    // Remplir les jours manquants AVANT aujourd’hui
    let checkDate = addDays(lastDate, 1);
    while (differenceInCalendarDays(today, checkDate) > 0) {
      const exists = obj.history.some(e => sameDay(new Date(e.date), checkDate));
      if (!exists) {
        obj.history.push({
          date: endOfDayLocal(checkDate),
          status: 'failed'
        });
      }
      checkDate = addDays(checkDate, 1);
    }

    // Reset completed si nouveau jour
    if (format(obj.updatedAt, 'yyyy-MM-dd') !== todayStr) {
      obj.completed = false;
    }

    await obj.save();
  }

  // ===== WEEKLY =====
  const weeklyObjectives = await Objective.find({ category: 'weekly' });
  for (const obj of weeklyObjectives) {
    const daysPassed = differenceInCalendarDays(today, new Date(obj.startDate));

    // Ajouter "skipped" pour les jours passés du cycle (<7) avant aujourd’hui
    const lastEntry = obj.history.length > 0 ? obj.history[obj.history.length - 1] : null;
    let lastDate = lastEntry ? new Date(lastEntry.date) : obj.startDate;
    let checkDate = addDays(lastDate, 1);

    while (
      differenceInCalendarDays(today, checkDate) > 0 &&
      differenceInCalendarDays(checkDate, new Date(obj.startDate)) < 7
    ) {
      const exists = obj.history.some(e => sameDay(new Date(e.date), checkDate));
      if (!exists) {
        obj.history.push({
          date: endOfDayLocal(checkDate),
          status: 'skipped'
        });
      }
      checkDate = addDays(checkDate, 1);
    }

    // Reset après 7 jours
    if (daysPassed >= 7) {
      const status = obj.progress >= obj.requiredCompletions ? 'completed' : 'failed';
      obj.history.push({ date: endOfDayLocal(today), status });
      obj.progress = 0;
      obj.completed = false;
      obj.startDate = today;
      obj.endDate = addDays(today, 6);
    }

    await obj.save();
  }

  console.log('✅ Vérification des objectifs terminée (23:59 local, pas de failed anticipé)');
}

module.exports = checkObjectives;
