import React, { useState } from 'react';
import { getBgColor, getTextColor } from '../theme/themeColors';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../utils/storage';

function LoginForm({ theme = 'lime' }) {
  const bgColor = getBgColor(theme, 300);
  const inputBg = getBgColor(theme, 200);
  const buttonBg = getBgColor(theme, 500);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://mynewlife.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      console.log('🔐 Token reçu :', data.token); // ✅ Log du token
  
      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token); // ✅ Stockage du token
        }
  
        setUser(data.user);
        setMessage(`✅ Bienvenue ${data.user.nom} !`);
  
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setMessage("❌ Erreur de connexion au serveur.");
    }
  };
  

  return (
    <div className={`w-full max-w-xl se:max-w-2xl mx-auto mt-20 p-10 rounded-2xl shadow-2xl ${bgColor} transition-all duration-100`}>
      {message && (
        <p className="text-center font-semibold mb-4 text-black">
          {message}
        </p>
      )}
      <h2 className="text-4xl font-bold mb-8 text-center text-black">Connexion</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-base">
        <InputField
          icon={<FaEnvelope />}
          name="email"
          placeholder="Adresse mail"
          value={formData.email}
          onChange={handleChange}
          inputBg={inputBg}
        />
        <InputField
          icon={<FaLock />}
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          inputBg={inputBg}
        />

        <button
          type="submit"
          className={`mt-4 py-3 rounded-xl font-semibold ${buttonBg} hover:scale-105 transition-transform text-black text-lg`}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}

function InputField({ icon, name, type = 'text', placeholder, value, onChange, inputBg }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${inputBg} shadow-sm`}>
      <span className="text-black text-xl">{icon}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 outline-none bg-transparent text-black placeholder-black text-base"
      />
    </div>
  );
}

export default LoginForm;
