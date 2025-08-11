import React, { useState,useEffect } from 'react';
import CalendarGrid from '../components/CalendarGrid';
import DayObjectives from '../components/DayObjectives';
import Navbar from '../components/Navbar';
import { getBgColor } from '../theme/themeColors';
import { format, addMonths, subMonths } from 'date-fns';

function AgendaPage() {
  const [theme, setTheme] = useState('lime');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [objectives, setObjectives] = useState([]);

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const res = await fetch('https://mynewlife.onrender.com/api/objectives', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (res.ok) setObjectives(data);
      } catch (err) {
        console.error('Erreur chargement objectifs:', err);
      }
    };

    fetchObjectives();
  }, []);

  const bgColor = getBgColor(theme, 200);
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className={`min-h-screen w-full ${bgColor} transition-colors duration-500`}>
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-4">📅 Mon Agenda</h1>

        <div className="flex justify-between items-center mb-6">
          <button onClick={handlePrevMonth} className="text-lg font-medium hover:underline">← Mois précédent</button>
          <span className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
          <button onClick={handleNextMonth} className="text-lg font-medium hover:underline">Mois suivant →</button>
        </div>

        <CalendarGrid
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          currentMonth={currentMonth}
          theme={theme}
          objectives={objectives}
        />
        <DayObjectives date={selectedDate} />
      </div>
    </div>
  );
}

export default AgendaPage;
