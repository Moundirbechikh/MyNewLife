const Objective = require('./Models/objective');
const { format, differenceInCalendarDays, addDays, subDays, set } = require('date-fns');

async function checkObjectives() {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // ===== DAILY =====
  const dailyObjectives = await Objective.find({ category: 'daily' });

  for (const obj of dailyObjectives) {
    // Trouver la dernière date enregistrée dans l'historique
    const lastEntry = obj.history.length > 0 ? obj.history[obj.history.length - 1] : null;
    const lastDate = lastEntry ? new Date(lastEntry.date) : subDays(today, 1);

    // Remplir les jours manquants avec "failed"
    let checkDate = addDays(lastDate, 1);
    while (differenceInCalendarDays(today, checkDate) > 0) {
      obj.history.push({
        date: set(checkDate, { hours: 23, minutes: 59, seconds: 0, milliseconds: 0 }),
        status: 'failed'
      });
      checkDate = addDays(checkDate, 1);
    }

    // Si on change de jour → reset `completed`
    if (format(obj.updatedAt, 'yyyy-MM-dd') !== todayStr) {
      obj.completed = false;
    }

    // Si aucun log pour aujourd’hui et pas validé → failed pour aujourd’hui
    const alreadyLoggedToday = obj.history.some(e =>
      format(new Date(e.date), 'yyyy-MM-dd') === todayStr
    );
    if (!alreadyLoggedToday && !obj.completed) {
      obj.history.push({
        date: set(today, { hours: 23, minutes: 59, seconds: 0, milliseconds: 0 }),
        status: 'failed'
      });
    }

    await obj.save();
  }

  // ===== WEEKLY =====
  const weeklyObjectives = await Objective.find({ category: 'weekly' });
  for (const obj of weeklyObjectives) {
    const daysPassed = differenceInCalendarDays(today, new Date(obj.startDate));

    // Ajouter "skipped" pour les jours manquants avant la fin du cycle
    const lastEntry = obj.history.length > 0 ? obj.history[obj.history.length - 1] : null;
    let lastDate = lastEntry ? new Date(lastEntry.date) : obj.startDate;
    let checkDate = addDays(lastDate, 1);

    while (differenceInCalendarDays(today, checkDate) > 0 && differenceInCalendarDays(checkDate, obj.startDate) < 7) {
      obj.history.push({
        date: set(checkDate, { hours: 23, minutes: 59, seconds: 0, milliseconds: 0 }),
        status: 'skipped'
      });
      checkDate = addDays(checkDate, 1);
    }

    // Reset si cycle de 7 jours terminé
    if (daysPassed >= 7) {
      const status = obj.progress >= obj.requiredCompletions ? 'completed' : 'failed';
      obj.history.push({ date: today, status });
      obj.progress = 0;
      obj.completed = false;
      obj.startDate = today;
      obj.endDate = addDays(today, 6);
    }

    await obj.save();
  }

  console.log('✅ Vérification des objectifs terminée');
}

module.exports = checkObjectives;

