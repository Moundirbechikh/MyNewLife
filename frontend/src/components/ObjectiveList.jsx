import React from 'react';

function ObjectiveList({ objectives, onDelete, onEdit, onToggle }) {
  const categories = ['daily', 'weekly', 'monthly'];

  const getPriorityColor = (priority) => {
    if (priority === 'critical') return 'border-red-500';
    if (priority === 'medium') return 'border-yellow-500';
    return 'border-green-500';
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

  const renderProgressBar = (progress, total) => {
    const percent = Math.min((progress / total) * 100, 100);
    return (
      <div className="w-full bg-gray-200 rounded h-2 mt-2">
        <div
          className="bg-green-600 h-2 rounded"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="mt-10 space-y-10">
      {categories.map((cat) => {
        const filtered = objectives.filter((o) => o.category === cat);
        if (filtered.length === 0) return null;

        return (
          <div key={cat}>
            <h2 className="text-2xl font-bold text-gray-800 capitalize mb-4">
              {cat === 'daily' ? '🗓️ Quotidien' : cat === 'weekly' ? '📅 Hebdomadaire' : '🗓️ Mensuel'}
            </h2>
            <div className="space-y-4">
              {filtered.map((obj) => (
                <div
                  key={obj._id}
                  className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getPriorityColor(obj.priority)} ${
                    obj.completed ? 'opacity-60 line-through' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <h3 className="text-xl font-semibold text-gray-700">{obj.title}</h3>
                      <p className="text-gray-600 mt-2">{obj.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {obj.startDate && `📅 Début : ${formatDate(obj.startDate)} `}
                        {obj.endDate && `• 🕓 Fin : ${formatDate(obj.endDate)}`}
                      </p>
                      {obj.category === 'weekly' && (
                        <>
                          <p className="text-sm text-gray-500 mt-1">
                            Progression : {obj.progress || 0} / {obj.requiredCompletions || obj.frequency || 1}
                          </p>
                          {renderProgressBar(obj.progress || 0, obj.requiredCompletions || obj.frequency || 1)}
                        </>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => !isValidatedToday(obj.lastValidated) && onToggle(obj)}
                        disabled={isValidatedToday(obj.lastValidated)}
                        className={`text-sm px-3 py-1 rounded ${
                          isValidatedToday(obj.lastValidated)
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}
                      >
                        {obj.completed ? 'Annuler' : 'Valider'}
                      </button>

                      <button
                        onClick={() => onEdit(obj)}
                        className="text-sm px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => onDelete(obj)}
                        className="text-sm px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ObjectiveList;
