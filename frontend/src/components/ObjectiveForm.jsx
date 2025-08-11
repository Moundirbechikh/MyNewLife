import React, { useState, useEffect } from 'react';

function ObjectiveForm({ onAdd, onUpdate, theme, initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'daily',
    priority: 'medium',
    frequency: '',
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        frequency: initialData.frequency || '',
      });
      setEditingId(initialData._id);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const now = new Date();
    let endDate = null;
    let requiredCompletions = undefined;

    if (formData.category === 'weekly') {
      endDate = new Date(now);
      endDate.setDate(now.getDate() + 6); // 7-day window
      requiredCompletions = parseInt(formData.frequency) || 1;
    }

    if (formData.category === 'monthly') {
      endDate = new Date(now);
      endDate.setMonth(now.getMonth() + 1); // 1-month window
    }

    const newObj = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      completed: false,
      startDate: now,
      endDate,
      frequency: formData.category === 'weekly' ? parseInt(formData.frequency) || 1 : undefined,
      progress: formData.category === 'weekly' ? 0 : undefined,
      requiredCompletions,
    };

    const url = editingId
      ? `${process.env.REACT_APP_API_URL}/api/objectives/update/${editingId}`
      : '${process.env.REACT_APP_API_URL}/api/objectives';

    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newObj),
      });

      const data = await res.json();
      if (res.ok) {
        editingId ? onUpdate(data) : onAdd(data);
        setFormData({
          title: '',
          description: '',
          category: 'daily',
          priority: 'medium',
          frequency: '',
        });
        setEditingId(null);
      } else {
        console.error('Erreur:', data.message);
      }
    } catch (err) {
      console.error('Erreur réseau:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mt-6 space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Titre de l'objectif"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="daily">🗓️ Quotidien</option>
        <option value="weekly">📅 Hebdomadaire</option>
        <option value="monthly">🗓️ Mensuel</option>
      </select>
      {formData.category === 'weekly' && (
        <input
          type="number"
          name="frequency"
          min="1"
          max="7"
          value={formData.frequency}
          onChange={handleChange}
          placeholder="Nombre de fois par semaine"
          className="w-full p-2 border rounded"
        />
      )}
      <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="critical">🔥 Critique</option>
        <option value="medium">⚠️ Moyen</option>
        <option value="low">✅ Faible</option>
      </select>
      <button
        type="submit"
        className={`px-4 py-2 rounded text-white ${
          theme === 'lime' ? 'bg-lime-600 hover:bg-lime-700' : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {editingId ? 'Modifier' : 'Ajouter'}
      </button>
    </form>
  );
}

export default ObjectiveForm;
