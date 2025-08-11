import React, { useState } from 'react';
import { getBgColor } from '../theme/themeColors';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBirthdayCake,
  FaBriefcase,
  FaVenusMars,
} from 'react-icons/fa';

function RegisterForm({ theme = 'lime' }) {
  const bgColor = getBgColor(theme, 300);
  const inputBg = getBgColor(theme, 200);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    sexe: '',
    password: '',
    confirmPassword: '',
    age: '',
    profession: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Inscription réussie !");
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          sexe: '',
          password: '',
          confirmPassword: '',
          age: '',
          profession: '',
        });
      } else {
        setMessage(`❌ ${data.message || "Erreur lors de l’inscription."}`);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      setMessage("❌ Erreur de connexion au serveur.");
    }
  };

  return (
    <div className={`max-w-xl mx-auto p-8 rounded-xl shadow-2xl ${bgColor}`}>
      <h2 className="text-4xl font-bold mb-6 text-center text-black">Créer un compte</h2>
      {message && <p className="text-center text-red-600 font-semibold mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
        <div className="flex gap-4">
          <InputField icon={<FaUser />} name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} inputBg={inputBg} />
          <InputField icon={<FaUser />} name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} inputBg={inputBg} />
        </div>
        <InputField icon={<FaEnvelope />} name="email" placeholder="Adresse mail" value={formData.email} onChange={handleChange} inputBg={inputBg} />
        <SelectField icon={<FaVenusMars />} name="sexe" value={formData.sexe} onChange={handleChange} options={['Homme', 'Femme']} inputBg={inputBg} />
        <InputField icon={<FaLock />} name="password" type="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} inputBg={inputBg} />
        <InputField icon={<FaLock />} name="confirmPassword" type="password" placeholder="Confirmer le mot de passe" value={formData.confirmPassword} onChange={handleChange} inputBg={inputBg} />
        <InputField icon={<FaBirthdayCake />} name="age" type="number" placeholder="Âge" value={formData.age} onChange={handleChange} inputBg={inputBg} />
        <SelectField icon={<FaBriefcase />} name="profession" value={formData.profession} onChange={handleChange} options={['Étudiant', 'Autre']} inputBg={inputBg} />

        <button type="submit" className={`mt-4 py-2 rounded-xl font-semibold ${getBgColor(theme, 500)} hover:scale-105 transition-transform text-black text-lg`}>
          S'inscrire
        </button>
      </form>
    </div>
  );
}

function InputField({ icon, name, type = 'text', placeholder, value, onChange, inputBg }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl p-2 ${inputBg}`}>
      <span className="text-black">{icon}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 outline-none bg-transparent text-black placeholder-black"
      />
    </div>
  );
}

function SelectField({ icon, name, value, onChange, options, inputBg }) {
  return (
    <div className={`flex items-center gap-2 rounded p-2 ${inputBg}`}>
      <span className="text-black">{icon}</span>
      <select name={name} value={value} onChange={onChange} className="flex-1 bg-transparent text-black outline-none">
        <option value="">{name.charAt(0).toUpperCase() + name.slice(1)}</option>
        {options.map(opt => (
          <option key={opt} value={opt.toLowerCase()}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default RegisterForm;
