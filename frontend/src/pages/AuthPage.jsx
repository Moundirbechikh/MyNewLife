import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import AnimatedSection from '../components/AnimatedSection';
import { getBgColor } from '../theme/themeColors';
import Navbar from '../components/Navbar';

function AuthPage() {
  const [theme, setTheme] = useState('lime');
  const [isLogin, setIsLogin] = useState(true); // ✅ Ajouté ici
  const bgColor = getBgColor(theme, 200);

  return (
    <div className={`min-h-screen w-full ${bgColor} transition-colors duration-500`}>
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="flex flex-col items-center justify-center">
        <AnimatedSection delay={200}>
          {isLogin ? <LoginForm theme={theme} /> : <RegisterForm theme={theme} />}
        </AnimatedSection>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 px-4 py-2 rounded-xl text-sm font-medium text-blue-700 hover:text-blue-900 transition hover:scale-105"
        >
          {isLogin ? "Pas encore inscrit ? Créer un compte" : "Déjà inscrit ? Se connecter"}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
