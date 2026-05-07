import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './AdminTable.css';
import { Tag, Fingerprint, Link2, Calendar, Settings, Plus, X } from 'lucide-react';

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
    <div className="admin-table-page">
      <div className="admin-table-page__header">
        <div>
          <h2 className="admin-page__title">Gestion des catégories</h2>
          <p className="admin-page__subtitle">{categories.length} catégorie(s) au total</p>
        </div>
        <button 
          className={`admin-btn ${showForm ? 'admin-btn--outline' : 'admin-btn--primary'}`} 
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '' }); }}
        >
          {showForm ? <><X size={16}/> Fermer</> : <><Plus size={16}/> Nouvelle catégorie</>}
        </button>
      </div>

      {showForm && (
        <form className="admin-role-form" onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--admin-navy)', fontWeight: 700 }}>
                {editingId ? 'Modifier le nom' : 'Nom de la nouvelle catégorie'}
              </label>
              <input
                type="text"
                placeholder="Ex: Appartements, Villas..."
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                required
                className="form-input"
                style={{ width: '100%', background: 'white' }}
              />
            </div>
            <button type="submit" className="admin-btn admin-btn--primary" style={{ height: '45px' }}>
              {editingId ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th><Fingerprint size={14} style={{marginRight: 8}}/> ID</th>
              <th><Tag size={14} style={{marginRight: 8}}/> Nom</th>
              <th><Link2 size={14} style={{marginRight: 8}}/> Slug</th>
              <th><Calendar size={14} style={{marginRight: 8}}/> Créée le</th>
              <th><Settings size={14} style={{marginRight: 8}}/> Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td data-label="ID">#{cat.id}</td>
                
                {/* On ne met pas de label sur le Nom pour qu'il ressorte en haut de carte sur mobile */}
                <td data-label="Nom"><strong>{cat.name}</strong></td>
                
                <td data-label="Slug"><code>{cat.slug}</code></td>
                
                <td data-label="Date">
                  {new Date(cat.createdAt).toLocaleDateString('fr-FR')}
                </td>
                
                <td data-label="Actions">
                  <div className="admin-table__actions">
                    <button className="admin-btn admin-btn--sm admin-btn--outline" onClick={() => handleEdit(cat)}>
                      Modifier
                    </button>
                    <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(cat.id)}>
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>Aucune catégorie trouvée</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}