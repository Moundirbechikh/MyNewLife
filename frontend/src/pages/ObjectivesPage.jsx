import React, { useState, useEffect } from 'react';
import ObjectiveForm from '../components/ObjectiveForm';
import ObjectiveList from '../components/ObjectiveList';
import Navbar from '../components/Navbar';
import { getBgColor } from '../theme/themeColors';

function ObjectivesPage() {
  const [objectives, setObjectives] = useState([]);
  const [editing, setEditing] = useState(null);
  const [theme, setTheme] = useState('lime');

  // ✅ Récupérer les objectifs de l'utilisateur connecté
  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/objectives', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();
        console.log('📋 Objectifs reçus :', data);

        if (res.ok) {
          setObjectives(data);
        } else {
          console.error('❌ Erreur lors du chargement :', data.message);
        }
      } catch (err) {
        console.error('❌ Erreur réseau :', err);
      }
    };

    fetchObjectives();
  }, []);

  // ➕ Ajouter un nouvel objectif
  const handleAdd = (newObj) => {
    setObjectives((prev) => [...prev, newObj]);
  };

  // 🔁 Mettre à jour un objectif existant
  const handleUpdate = (updatedObj) => {
    setObjectives((prev) =>
      prev.map((o) => (o._id === updatedObj._id ? updatedObj : o))
    );
    setEditing(null);
  };

  // 🗑️ Supprimer un objectif
  const handleDelete = async (obj) => {
    try {
      const res = await fetch(`http://localhost:5000/api/objectives/${obj._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        setObjectives((prev) => prev.filter((o) => o._id !== obj._id));
      } else {
        const data = await res.json();
        console.error('❌ Erreur suppression :', data.message);
      }
    } catch (err) {
      console.error('❌ Erreur réseau :', err);
    }
  };

  // ✅ Valider un objectif
  const handleToggle = async (obj) => {
    try {
      const res = await fetch(`http://localhost:5000/api/objectives/${obj._id}/validate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const updated = await res.json();
      if (res.ok) {
        setObjectives((prev) =>
          prev.map((o) => (o._id === updated._id ? updated : o))
        );
      } else {
        console.error('❌ Erreur validation :', updated.message);
      }
    } catch (err) {
      console.error('❌ Erreur réseau :', err);
    }
  };

  // ✏️ Activer le mode édition
  const handleEdit = (obj) => {
    setEditing(obj);
  };

  // ✅ Compter les objectifs complétés par catégorie
  const completedByCategory = (cat) => {
    return objectives.filter((o) => {
      if (o.category !== cat) return false;

      if (cat === 'monthly') {
        return o.validatedAt && new Date(o.validatedAt) <= new Date(o.endDate);
      }

      return o.completed;
    }).length;
  };

  // 📊 Compter tous les objectifs par catégorie
  const countByCategory = (cat) => objectives.filter((o) => o.category === cat).length;

  // 🧠 Calcul du délai de validation pour monthly
  const getMonthlyValidationDelay = (obj) => {
    if (obj.category !== 'monthly' || !obj.validatedAt) return null;
    const start = new Date(obj.startDate);
    const validated = new Date(obj.validatedAt);
    const diff = Math.floor((validated - start) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const bgColor = getBgColor(theme, 200);

  return (
    <div className={`min-h-screen w-full ${bgColor} transition-colors duration-500`}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-6xl font-bold text-center mb-8 text-black">🎯 Mes Objectifs</h1>

        <div className="grid grid-cols-3 gap-4 text-center mb-10">
          {['daily', 'weekly', 'monthly'].map((cat) => (
            <div key={cat} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold capitalize">
                {cat === 'daily' ? '🗓️ Quotidien' : cat === 'weekly' ? '📅 Hebdomadaire' : '🗓️ Mensuel'}
              </h3>
              <p className="text-gray-600">
                {completedByCategory(cat)} / {countByCategory(cat)} complétés
              </p>
            </div>
          ))}
        </div>

        <ObjectiveForm
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          theme={theme}
          initialData={editing}
        />

        <ObjectiveList
          objectives={objectives}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggle={handleToggle}
          theme={theme}
          getMonthlyValidationDelay={getMonthlyValidationDelay}
        />
      </div>
    </div>
  );
}

export default ObjectivesPage;
