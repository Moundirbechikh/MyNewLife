import React, { useEffect, useState } from 'react';
import { getTextColor } from '../theme/themeColors';
import { getUser } from '../utils/storage';

function Citation({ theme = 'lime' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const user = getUser();
  const isLoggedIn = !!user;
  const prenom = user?.prenom || '';

  return (
    <div
      className={`text-5xl sm:text-6xl md:text-7xl lg:text-9xl p-4 rounded-xl transition-all duration-700 ease-out transform text-center ${
        visible
          ? 'opacity-100 translate-x-0 translate-y-0 rotate-0 scale-100'
          : 'opacity-0 translate-x-10 translate-y-10 rotate-[-5deg] scale-95'
      } ${getTextColor(theme, 400)}`}
    >
      {isLoggedIn ? (
        <>
          The <span className="text-black">New</span> <span className={`${getTextColor(theme, 300)}`}>{prenom}</span>
        </>
      ) : (
        <>
          My <span className="text-black">New</span>{' '}
          <span className={`${getTextColor(theme, 300)}`}>Me !</span>
        </>
      )}
    </div>
  );
}

export default Citation;
