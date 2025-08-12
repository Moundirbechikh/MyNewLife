import React, { useState, useEffect } from 'react';
import Card from './Card';
import { getUser } from '../utils/storage';

const cards = [
  { id: 1, title: 'Daily Objectives', level: 300 },
  { id: 2, title: 'Weekly Goals', level: 400 },
  { id: 3, title: 'Annualy Plans', level: 500 },
];

const Object = ({ theme = 'lime' }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [objectives, setObjectives] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const user = getUser();
  const isLoggedIn = !!user;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

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
        console.error('❌ Erreur chargement objectifs :', err);
      }
    };

    if (isLoggedIn) {
      fetchObjectives();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPosition = (i) => {
    if (i === index) return 'center';
    if (i === (index - 1 + cards.length) % cards.length) return 'left';
    if (i === (index + 1) % cards.length) return 'right';
    return 'hidden';
  };

  const getFilteredObjectives = (level) => {
    const filtered = objectives.filter((obj) => obj.level === level);
    return isMobile ? filtered.slice(0, 1) : filtered;
  };

  return (
    <div
      className={`relative w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl h-64 flex justify-center items-end mt-10 transition-all duration-700 ease-out transform ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
      }`}
    >
      {cards.map((card, i) => {
        const position = getPosition(i);
        const base = 'absolute transition-all duration-700';

        let positionClasses = '';
        if (position === 'center') {
          positionClasses = 'scale-100 z-10 opacity-100';
        } else if (position === 'left') {
          positionClasses = isMobile
            ? 'scale-[0.4] opacity-10 -translate-x-20 pointer-events-none'
            : 'scale-90 opacity-50 -translate-x-[150px] md:-translate-x-[180px] z-0';
        } else if (position === 'right') {
          positionClasses = isMobile
            ? 'scale-[0.4] opacity-10 translate-x-20 pointer-events-none'
            : 'scale-90 opacity-50 translate-x-[150px] md:translate-x-[180px] z-0';
        } else {
          positionClasses = 'opacity-0 pointer-events-none';
        }

        return (
          <div
            key={card.id}
            className={`${base} ${positionClasses}`}
            onClick={() => position === 'center' && setIndex(i)}
          >
            <Card
              title={card.title}
              theme={theme}
              level={card.level}
              objectives={getFilteredObjectives(card.level)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Object;
