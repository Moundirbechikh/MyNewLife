import React, { useEffect, useState } from 'react';
import Logo from './logo';
import { getHoverColor } from '../theme/themeColors';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser, removeUser } from '../utils/storage';

const Navbar = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hover = getHoverColor(theme, 300);

  const currentPath = location.pathname;
  const user = getUser();
  const isLoggedIn = !!user;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user?.sexe) {
      setTheme(user.sexe === 'homme' ? 'lime' : 'purple');
    }
  }, [user, setTheme]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
    if (confirmLogout) {
      removeUser();
      navigate('/');
      window.location.reload();
    }
  };

  const navItems = [
    { label: 'Accueil', path: '/', type: 'route' },
    ...(isLoggedIn
      ? [
          { label: 'Objectif', path: '/object', type: 'route' },
          { label: 'Agenda', path: '/agenda', type: 'route' },
          { label: 'Déconnexion', path: '/logout', type: 'button' },
        ]
      : [{ label: 'Connexion', path: '/auth', type: 'route' }]
    ),
  ];

  if (currentPath === '/') {
    navItems.push({ label: 'Contact', path: '#contact', type: 'anchor' });
    navItems.push({ label: 'Info', path: '#info', type: 'anchor' });
  }

  const initials = user
    ? `${user.nom?.charAt(0) || ''}${user.prenom?.charAt(0) || ''}`.toUpperCase()
    : '';

  return (
    <>
      <div className="p-2">
        <Logo />
      </div>

      {/* Navbar container */}
      <nav className="fixed top-4 right-4 text-black px-4 sm:px-6 py-3 shadow-md rounded-2xl z-50 bg-transparent backdrop-blur-lg flex flex-col sm:flex-row items-center gap-4">
        {/* Mobile toggle button */}
        <div className="flex sm:hidden w-full justify-between items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`text-2xl font-bold focus:outline-none ${hover}`}
          >
            ☰
          </button>

          {isLoggedIn ? (
            <div
              className={`px-3 py-1 rounded-xl font-bold text-sm ${
                theme === 'lime'
                  ? 'bg-lime-300 text-black'
                  : 'bg-purple-300 text-white'
              }`}
            >
              {initials}
            </div>
          ) : (
            <button
              onClick={() => setTheme((prev) => (prev === 'lime' ? 'purple' : 'lime'))}
              className={`px-3 py-1 rounded-xl font-semibold transition text-sm ${
                theme === 'lime'
                  ? 'bg-lime-300 hover:bg-lime-400 text-black'
                  : 'bg-purple-300 hover:bg-purple-400 text-white'
              }`}
            >
              {theme === 'lime' ? '👩' : '👨'}
            </button>
          )}
        </div>

        {/* Navigation links */}
        <ul
          className={`flex-col sm:flex-row gap-2 sm:gap-4 text-base sm:text-lg font-medium items-center sm:flex ${
            isOpen ? 'flex' : 'hidden'
          } sm:items-end sm:gap-4 mt-2 sm:mt-0`}
        >
          {navItems.map(({ label, path, type }) => {
            const isActive = currentPath === path && type === 'route';
            return (
              <li key={label} className="relative">
                {type === 'route' ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(path);
                      setIsOpen(false);
                    }}
                    className={`transition font-cursive focus:outline-none ${hover}`}
                  >
                    {label}
                    {isActive && (
                      <span
                        className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${
                          theme === 'lime' ? 'bg-lime-400' : 'bg-purple-400'
                        }`}
                      ></span>
                    )}
                  </a>
                ) : type === 'anchor' ? (
                  <a
                    href={path}
                    className={`transition font-cursive focus:outline-none ${hover}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className={`px-2 py-1 rounded-md font-cursive transition focus:outline-none ${
                      theme === 'lime'
                        ? 'bg-lime-300 hover:bg-lime-400 text-black'
                        : 'bg-purple-300 hover:bg-purple-400 text-white'
                    }`}
                  >
                    {label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
