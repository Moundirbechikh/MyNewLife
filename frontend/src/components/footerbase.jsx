import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Logo from '../assets/logo.png';
import { getTextColor, getBgColor } from '../theme/themeColors';

const Footerbase = ({ theme = 'lime' }) => {
  return (
    <footer className={`${getBgColor(theme, 200)} text-black py-10 px-6`}id='contact'>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

        {/* Logo + Description */}
        <div className="flex flex-col items-start gap-3">
          <img src={Logo} alt="Logo" className="w-20 h-auto mb-2" />
          <p className="leading-relaxed w-72">
            Une application moderne de gestion d'objectifs avec calendriers intégrés.
            Organisez vos journées, semaines et mois avec des objectifs clairs.
          </p>
        </div>

        {/* Fonctionnalités */}
        <div>
          <h3 className="text-base font-bold mb-2">Fonctionnalités</h3>
          <ul className="space-y-1 text-black">
            <li>📅 Objectifs quotidiens</li>
            <li>🗓️ Planification hebdomadaire</li>
            <li>📈 Objectifs mensuels</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold mb-2">Contact</h3>
          <ul className="flex gap-4 mt-2">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="text-xl hover:text-blue-400 transition duration-300" />
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-xl hover:text-pink-400 transition duration-300" />
              </a>
            </li>
            <li>
              <a href="https://wa.me/213555123456" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="text-xl hover:text-green-400 transition duration-300" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className={`mt-8 text-center text-sm ${getTextColor(theme, 400)}`}>
        © {new Date().getFullYear()} <span className="font-semibold">Me</span>. Créé pour une meilleure productivité.
      </div>
    </footer>
  );
};

export default Footerbase;
