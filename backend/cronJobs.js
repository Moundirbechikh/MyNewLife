const cron = require('node-cron');
const Objective = require('./Models/objective');
const { format, differenceInCalendarDays, addDays, set } = require('date-fns');

//
// 🕘 1. À 23:59 → Enregistrement du statut "failed" si non validé
//
cron.schedule('40 02 * * *', async () => {
  console.log('🕘 Cron daily evaluation triggered');

  try {
    const dailyObjectives = await Objective.find({ category: 'daily' });
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    for (const obj of dailyObjectives) {
      const alreadyLogged = obj.history.some(entry =>
        format(new Date(entry.date), 'yyyy-MM-dd') === todayStr
      );

      // Si aucune validation aujourd’hui → enregistrer "failed"
      if (!alreadyLogged && !obj.completed) {
        const failedTimestamp = set(today, { hours: 23, minutes: 59, seconds: 0, milliseconds: 0 });

        obj.history.push({
          date: failedTimestamp,
          status: 'failed'
        });

        await obj.save();
      }
    }

    console.log('📌 Daily objectives evaluated for failure');
  } catch (err) {
    console.error('❌ Erreur daily evaluation:', err);
  }
});


//
// 🕛 2. À 00:00 → Réinitialisation des objectifs daily
//
cron.schedule('41 02 * * *', async () => {
  console.log('🕛 Cron daily reset triggered');

  try {
    const dailyObjectives = await Objective.find({ category: 'daily' });

    for (const obj of dailyObjectives) {
      obj.completed = false;
      await obj.save();
    }

    console.log('🔄 Daily objectives reset for new day');
  } catch (err) {
    console.error('❌ Erreur daily reset:', err);
  }
});


//
// 📅 3. À 00:00 → Vérification et reset des objectifs weekly
//
cron.schedule('0 0 * * *', async () => {
  console.log('🕛 Cron weekly dynamic triggered');

  try {
    const weeklyObjectives = await Objective.find({ category: 'weekly' });
    const today = new Date();

    for (const obj of weeklyObjectives) {
      const daysPassed = differenceInCalendarDays(today, new Date(obj.startDate));

      if (daysPassed >= 7) {
        const status = obj.progress >= obj.requiredCompletions ? 'completed' : 'failed';

        obj.history.push({
          date: today,
          status
        });

        // Nouveau cycle
        obj.progress = 0;
        obj.completed = false;
        obj.startDate = today;
        obj.endDate = addDays(today, 6);

        await obj.save();
      }
    }

    console.log('✅ Weekly objectives checked + reset');
  } catch (err) {
    console.error('❌ Erreur weekly dynamic:', err);
  }
});
