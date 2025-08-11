import React, { useState, useEffect } from 'react';
import '../index.css';
import Navbar from '../components/Navbar';
import Citation from '../components/Citation';
import Object from '../components/Object';
import Info from '../components/Info';
import AnimatedSection from '../components/AnimatedSection';
import Footerbase from '../components/footerbase';

function PagePrincipal() {
  const [theme, setTheme] = useState('lime');

  useEffect(() => {
    console.log('✅ REACT_APP_API_URL =', process.env.REACT_APP_API_URL);

    if (!process.env.REACT_APP_API_URL) {
      console.warn('⚠️ La variable REACT_APP_API_URL est undefined. Vérifie Vercel et redeploie.');
    }
  }, []);

  return (
    <div className={`${theme === 'lime' ? 'bg-lime-100' : 'bg-purple-100'} min-h-screen`}>
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 mt-10 px-4 pb-28">
        <Citation theme={theme} />
        <Object theme={theme} />
      </div>
      <div className={`${theme === 'lime' ? 'bg-lime-50' : 'bg-purple-50'} mt-10 px-4`}>
        <AnimatedSection>
          <Info theme={theme} />
        </AnimatedSection>
      </div>
      <Footerbase theme={theme} />
    </div>
  );
}

export default PagePrincipal;
