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
        const res = await fetch('http://localhost:5000/api/objectives', {
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

  const getPosition = (i) => {
    if (i === index) return 'center';
    if (i === (index - 1 + cards.length) % cards.length) return 'left';
    if (i === (index + 1) % cards.length) return 'right';
    return 'hidden';
  };

  return (
    <div
      className={`relative w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl h-64 flex justify-center items-end mt-10 transition-all duration-700 ease-out transform ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
      }`}
    >
      {cards.map((card, i) => {
        const position = getPosition(i);
        return (
          <div
            key={card.id}
            className={`absolute transition-all duration-700 cursor-pointer ${
              position === 'center'
                ? 'scale-100 z-10 opacity-100'
                : position === 'left'
                ? 'translate-x-[-150px] scale-90 z-0 opacity-50'
                : position === 'right'
                ? 'translate-x-[150px] scale-90 z-0 opacity-50'
                : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIndex(i)}
          >
            <Card title={card.title} theme={theme} level={card.level} objectives={objectives} />
          </div>
        );
      })}
    </div>
  );
};

export default Object;
