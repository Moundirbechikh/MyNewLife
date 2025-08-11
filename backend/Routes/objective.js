const express = require('express');
const router = express.Router();
const Objective = require('../Models/objective');
const auth = require('../middleware/auth');

// ✅ Ajouter un objectif
router.post('/', auth, async (req, res) => {
  try {
    const now = new Date();
    let endDate = null;
    let requiredCompletions = undefined;

    if (req.body.category === 'weekly') {
      endDate = new Date(now);
      endDate.setDate(now.getDate() + 7);
      requiredCompletions = parseInt(req.body.frequency) || 1;
    }

    if (req.body.category === 'monthly') {
      endDate = new Date(now);
      endDate.setMonth(now.getMonth() + 1);
    }

    const newObjective = new Objective({
      ...req.body,
      user: req.user.id,
      completed: false,
      progress: req.body.category === 'weekly' ? 0 : undefined,
      frequency: req.body.category === 'weekly' ? parseInt(req.body.frequency) || 1 : undefined,
      requiredCompletions,
      startDate: now,
      endDate,
    });

    const saved = await newObjective.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Erreur backend :', err);
    res.status(500).json({ message: 'Erreur lors de l’ajout.' });
  }
});

// 📥 Récupérer tous les objectifs de l’utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const objectives = await Objective.find({ user: req.user.id });
    res.json(objectives);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération.' });
  }
});

// ✏️ Mettre à jour un objectif
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Objective.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
  }
});

// 🗑️ Supprimer un objectif
router.delete('/:id', auth, async (req, res) => {
  try {
    await Objective.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Objectif supprimé.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression.' });
  }
});

// ✅ Valider un objectif (avec historique)
router.patch('/:id/validate', auth, async (req, res) => {
  try {
    const objective = await Objective.findOne({ _id: req.params.id, user: req.user.id });
    if (!objective) return res.status(404).json({ message: 'Objectif introuvable.' });

    const today = new Date().toDateString();
    const last = objective.lastValidated ? new Date(objective.lastValidated).toDateString() : null;

    if (last === today) {
      return res.status(400).json({ message: 'Déjà validé aujourd’hui.' });
    }

    objective.lastValidated = new Date();

    if (objective.category === 'weekly') {
      objective.progress = Math.min((objective.progress || 0) + 1, objective.requiredCompletions || 1);
      objective.completed = objective.progress >= (objective.requiredCompletions || 1);
    }

    if (objective.category === 'monthly') {
      objective.validatedAt = new Date();
      objective.completed = true;
    }

    if (objective.category === 'daily') {
      objective.completed = true;
    }

    objective.history.push({
      date: new Date(),
      status: 'completed'
    });

    await objective.save();
    res.json(objective);
  } catch (err) {
    console.error('❌ Erreur validation :', err);
    res.status(500).json({ message: 'Erreur lors de la validation.' });
  }
});

// 🔄 Mise à jour générique (sans auth)
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Objective.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Erreur update:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

module.exports = router;
