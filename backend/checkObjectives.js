const Objective = require('./Models/objective');
const { format, differenceInCalendarDays, addDays, subDays, set } = require('date-fns');
const { utcToZonedTime, formatInTimeZone } = require('date-fns-tz');

// ✅ Correction : recrée zonedTimeToUtc manuellement
function zonedTimeToUtc(localDate, timeZone) {
  const zoned = utcToZonedTime(localDate, timeZone);
  const offsetMs = localDate.getTime() - zoned.getTime();
  return new Date(localDate.getTime() - offsetMs);
}

// ✅ Ta fonction inchangée, mais corrigée
function endOfDayLocal(date, timezone = 'Africa/Algiers') {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 0, 0);
  return zonedTimeToUtc(endOfDay, timezone);
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

    if (format(obj.updatedAt, 'yyyy-MM-dd') !== todayStr) {
      obj.completed = false;
    }

    await obj.save();
  }

  // ===== WEEKLY =====
  const weeklyObjectives = await Objective.find({ category: 'weekly' });

  for (const obj of weeklyObjectives) {
    const daysPassed = differenceInCalendarDays(today, new Date(obj.startDate));

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

  console.log('✅ Vérification des objectifs terminée (23:59 local, logique conservée)');
}

module.exports = checkObjectives;
