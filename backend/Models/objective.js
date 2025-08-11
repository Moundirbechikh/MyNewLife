const mongoose = require('mongoose');

const objectiveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  description: String,

  category: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily',
  },

  priority: {
    type: String,
    enum: ['critical', 'medium', 'low'],
    default: 'medium',
  },

  completed: { type: Boolean, default: false },

  // Weekly only
  frequency: { type: Number }, // nombre de fois à valider dans la semaine
  progress: { type: Number, default: 0 }, // nombre de validations effectuées
  requiredCompletions: { type: Number }, // copie de frequency pour comparaison

  // Monthly only
  validatedAt: { type: Date, default: null }, // date de validation pour calcul du délai

  // Pour weekly et monthly
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }, // calculé à la création

  lastValidated: { type: Date, default: null },

  history: [
    {
      date: Date,
      status: {
        type: String,
        enum: ['completed', 'skipped', 'failed'],
        default: 'completed',
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Objective', objectiveSchema);
