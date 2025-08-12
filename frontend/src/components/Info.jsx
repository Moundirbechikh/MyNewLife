import React from 'react';
import Infocard from './Infocard';
import {
  FaRegCalendarCheck,
  FaRegCalendarAlt,
  FaChartLine,
  FaLaptopCode,
} from 'react-icons/fa';
import { getBgColor } from '../theme/themeColors';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/storage';

function Info({ theme = 'lime', level = 500 }) {
  const bgColor = getBgColor(theme, level);
  const navigate = useNavigate();

  const user = getUser();
  const isLoggedIn = !!user;

  return (
    <div className="pt-20 pb-20 flex flex-col justify-center md:gap-6 gap-3" id="info">
      <div className="flex flex-wrap justify-center md:gap-10 gap-5 flex-row">
        <Infocard
          title="Objectifs Quotidiens"
          discription="Définissez et suivez vos objectifs jour par jour pour une progression constante."
          theme={theme}
          level={200}
          Icon={FaRegCalendarCheck}
        />
        <Infocard
          title="Planification Hebdomadaire"
          discription="Organisez vos semaines avec des objectifs clairs et mesurables."
          theme={theme}
          level={300}
          Icon={FaRegCalendarAlt}
        />
      </div>
      <div className="flex flex-wrap justify-center md:gap-10 gap-5 flex-row">
        <Infocard
          title="Objectifs Mensuels"
          discription="Fixez-vous des défis à long terme et suivez votre progression mensuelle."
          theme={theme}
          level={400}
          Icon={FaChartLine}
        />
        <Infocard
          title="Interface Intuitive"
          discription="Profitez d'une expérience utilisateur moderne et fluide."
          theme={theme}
          level={300}
          Icon={FaLaptopCode}
        />
      </div>

      {!isLoggedIn && (
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/auth')}
            className={`p-5 h-fit w-fit rounded-xl text-xl ${bgColor} hover:scale-105 transition-transform duration-300`}
          >
            Commencer gratuitement
          </button>
        </div>
      )}
    </div>
  );
}

export default Info;
