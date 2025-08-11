import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns';

function CalendarGrid({ selectedDate, onSelectDate, currentMonth, objectives }) {
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const getDayStatusColor = (day) => {
    const dayObjectives = objectives.filter((obj) =>
      obj.history?.some((entry) => isSameDay(entry.date, day))
    );

    if (dayObjectives.length === 0) return 'bg-white';

    const allCompleted = dayObjectives.every((obj) =>
      obj.history.some((entry) => isSameDay(entry.date, day) && entry.status === 'completed')
    );

    const noneCompleted = dayObjectives.every((obj) =>
      obj.history.some((entry) => isSameDay(entry.date, day) && entry.status !== 'completed')
    );

    if (allCompleted) return 'bg-green-200';
    if (noneCompleted) return 'bg-red-200';
    return 'bg-white';
  };

  return (
    <div className="grid grid-cols-7 gap-2 mb-8 animate-fade-in">
      {days.map((day, index) => {
        const isSelected = isSameDay(day, selectedDate);
        const statusColor = getDayStatusColor(day);

        return (
          <button
            key={day}
            onClick={() => onSelectDate(day)}
            className={`p-3 rounded-lg text-sm font-semibold transition-all duration-300 ease-out transform
              ${isSelected ? 'ring-2 ring-black scale-105' : ''}
              ${statusColor} text-gray-800 hover:scale-110 hover:bg-gray-100 animate-day-entry`}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {format(day, 'd MMM')}
          </button>
        );
      })}
    </div>
  );
}

export default CalendarGrid;
