import React from 'react';
import { getBgColor, getTextColor } from '../theme/themeColors';

function Infocard({ title, theme = 'lime', level = 300, discription, Icon }) {
  const bgColor = getBgColor(theme, level);
  const textColor = getTextColor(theme, level);

  return (
    <div className={`w-[44%] h-64 rounded-xl shadow-lg flex flex-col items-center justify-center sm:text-4xl text-xl font-semibold p-2 ${bgColor} ${textColor} hover:scale-105 transition-transform duration-300`}>
      {Icon && <Icon className="sm:text-5xl text-3xl mb-2 text-black" />}
      <div className=" md:text-4xl text-2xl mb-2 text-black text-center">{title}</div>
      <div className="text-base md:text-xl text-center text-black">{discription}</div>
    </div>
  );
}

export default Infocard;

