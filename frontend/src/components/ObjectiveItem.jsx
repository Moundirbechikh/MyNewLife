import React from 'react';

function ObjectiveItem({ objective, onDelete, onEdit, onToggle, theme }) {
  const priorityColor = {
    critical: theme === 'lime' ? 'bg-red-300' : 'bg-red-500',
    medium: theme === 'lime' ? 'bg-yellow-300' : 'bg-yellow-500',
    low: theme === 'lime' ? 'bg-green-300' : 'bg-green-500',
  };

  const isValidatedToday = (lastValidated) => {
    if (!lastValidated) return false;
    const today = new Date().toDateString();
    const validatedDate = new Date(lastValidated).toDateString();
    return today === validatedDate;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const renderProgress = () => {
    if (objective.category === 'weekly' && typeof objective.progress === 'number') {
      const total = objective.requiredCompletions || 1;
      const percent = Math.min((objective.progress / total) * 100, 100);
      return (
        <div className="w-full bg-gray-200 rounded h-2 mt-1">
          <div
            className="bg-green-600 h-2 rounded"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`p-3 mb-2 rounded-lg text-black ${priorityColor[objective.priority]}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className={`font-medium ${objective.completed ? 'line-through opacity-60' : ''}`}>
            {objective.title}
          </p>
          <p className="text-sm text-gray-700">
            {objective.category === 'daily' && '🗓️ Quotidien'}
            {objective.category === 'weekly' && '📅 Hebdomadaire'}
            {objective.category === 'monthly' && '🗓️ Mensuel'}
            {objective.endDate && ` • Jusqu'au ${formatDate(objective.endDate)}`}
          </p>
          {renderProgress()}
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => !isValidatedToday(objective.lastValidated) && onToggle(objective)}
            disabled={isValidatedToday(objective.lastValidated)}
            className={`text-green-700 hover:underline text-sm ${
              isValidatedToday(objective.lastValidated) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Valider
          </button>

          <button onClick={() => onEdit(objective)} className="text-blue-700 hover:underline text-sm">Modifier</button>
          <button onClick={() => onDelete(objective)} className="text-red-700 hover:underline text-sm">Supprimer</button>
        </div>
      </div>
    </div>
  );
}

export default ObjectiveItem;
