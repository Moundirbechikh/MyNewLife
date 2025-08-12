import React from 'react';
import { getBgColor } from '../theme/themeColors';
import { getUser } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

function Card({ title, theme = 'lime', level = 400, className = '', objectives = [] }) {
  const bgColor = getBgColor(theme, level - 100);
  const blockBgColor = getBgColor(theme, level - 100);
  const user = getUser();
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const category = title.toLowerCase().includes('daily')
    ? 'daily'
    : title.toLowerCase().includes('weekly')
    ? 'weekly'
    : 'monthly';

  const filtered = objectives
    .filter((obj) => obj.category === category)
    .slice(0, 1);

  return (
    <div
      className={`w-42 se:w-48 sm:w-80 min-h-80 h-fit rounded-xl shadow-xl flex flex-col items-center ${
        isLoggedIn ? 'justify-between' : 'justify-center'
      } py-6 px-4 text-black ${bgColor} ${className}`}
    >
      <div className="text-3xl font-bold text-center">{title}</div>

      {isLoggedIn && (
        <div className="w-full mt-4 space-y-3 px-2 py-3 rounded-xl">
          {filtered.length > 0 ? (
            filtered.map((obj) => (
              <div
                key={obj._id}
                className={`w-full rounded-lg px-4 py-3 flex flex-col items-center justify-center text-center shadow-md hover:scale-[1.03] hover:bg-white transition-all duration-300 ${blockBgColor}`}
              >
                <div className="text-sm sm:text-lg font-semibold text-gray-800">{obj.title}</div>
                <div className="mt-1 text-sm font-medium text-gray-600">
                  {obj.category === 'weekly' ? (
                    <span>{obj.progress || 0}/{obj.frequency || 1}</span>
                  ) : (
                    <span className={obj.completed ? 'text-green-600' : 'text-red-500'}>
                      {obj.completed ? '✅ Terminé' : '❌ À faire'}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-700 italic mt-6">
              Pas d’objectif pour le moment
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => {
          if (isLoggedIn) {
            navigate('/object');
          } else {
            alert("Connectez-vous pour accéder aux objectifs !");
          }
        }}
        className={`mt-4 rounded-xl px-4 py-2 text-base font-bold w-full sm:w-fit text-center ${getBgColor(theme, 500)} hover:${getBgColor(theme, 400)} transition-all duration-300`}
      >
        Updates?
      </button>
    </div>
  );
}

export default Card;
