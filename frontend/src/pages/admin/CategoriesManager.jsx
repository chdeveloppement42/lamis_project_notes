import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './AdminTable.css';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/categories/${editingId}`, formData);
      } else {
        await axiosInstance.post('/categories', formData);
      }
      setFormData({ name: '' });
      setEditingId(null);
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      await axiosInstance.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Impossible de supprimer (annonces liées ?)');
    }
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Gestion des catégories</h1>
          <p className="admin-page__subtitle">{categories.length} catégorie(s) au total</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '' }); }}>
          {showForm ? '✕ Fermer' : '+ Nouvelle catégorie'}
        </button>
      </div>

      {showForm && (
        <form className="admin-inline-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom de la catégorie"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            required
            className="admin-input"
          />
          <button type="submit" className="admin-btn admin-btn--primary">
            {editingId ? 'Modifier' : 'Créer'}
          </button>
        </form>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Slug</th>
              <th>Créée le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td><strong>{cat.name}</strong></td>
                <td><code>{cat.slug}</code></td>
                <td>{new Date(cat.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="admin-table__actions">
                  <button className="admin-btn admin-btn--sm admin-btn--outline" onClick={() => handleEdit(cat)}>✏️ Modifier</button>
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(cat.id)}>🗑️ Supprimer</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan="5" className="admin-table__empty">Aucune catégorie trouvée</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
