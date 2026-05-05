import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './AdminTable.css';

export default function UsersManager() {
  const [admins, setAdmins] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', roleId: '',
  });

  const fetchData = async () => {
    try {
      const [adminsRes, rolesRes] = await Promise.all([
        axiosInstance.get('/admin/users'),
        axiosInstance.get('/roles'),
      ]);
      setAdmins(adminsRes.data);
      setRoles(rolesRes.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/admin/users', {
        ...formData,
        roleId: parseInt(formData.roleId),
      });
      setFormData({ firstName: '', lastName: '', email: '', password: '', roleId: '' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleSuspend = async (id) => {
    try {
      await axiosInstance.patch(`/admin/users/${id}/suspend`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  const handleReactivate = async (id) => {
    try {
      await axiosInstance.patch(`/admin/users/${id}/reactivate`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt('Nouveau mot de passe :');
    if (!newPassword) return;
    try {
      await axiosInstance.patch(`/admin/users/${id}/reset-password`, { newPassword });
      alert('Mot de passe réinitialisé');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  const statusBadge = (status) => {
    const map = {
      VALIDATED: 'admin-badge--success',
      SUSPENDED: 'admin-badge--danger',
      PENDING: 'admin-badge--warning',
    };
    return <span className={`admin-badge ${map[status] || ''}`}>{status}</span>;
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Gestion des utilisateurs</h1>
          <p className="admin-page__subtitle">{admins.length} administrateur(s)</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Fermer' : '+ Nouvel administrateur'}
        </button>
      </div>

      {showForm && (
        <form className="admin-inline-form admin-inline-form--grid" onSubmit={handleSubmit}>
          <input className="admin-input" placeholder="Prénom" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
          <input className="admin-input" placeholder="Nom" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
          <input className="admin-input" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input className="admin-input" type="password" placeholder="Mot de passe" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <select className="admin-input" value={formData.roleId} onChange={(e) => setFormData({...formData, roleId: e.target.value})} required>
            <option value="">Sélectionner un rôle</option>
            {roles.filter(r => !r.isSuperAdmin).map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <button type="submit" className="admin-btn admin-btn--primary">Créer</button>
        </form>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Créé par</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td><strong>{admin.firstName} {admin.lastName}</strong></td>
                <td>{admin.email}</td>
                <td>{admin.role?.name}</td>
                <td>{statusBadge(admin.status)}</td>
                <td>{admin.createdBy ? `${admin.createdBy.firstName} ${admin.createdBy.lastName}` : '—'}</td>
                <td className="admin-table__actions">
                  {!admin.isSuperAdmin && (
                    <>
                      {admin.status === 'VALIDATED' ? (
                        <button className="admin-btn admin-btn--sm admin-btn--warning" onClick={() => handleSuspend(admin.id)}>⏸️ Suspendre</button>
                      ) : (
                        <button className="admin-btn admin-btn--sm admin-btn--success" onClick={() => handleReactivate(admin.id)}>▶️ Réactiver</button>
                      )}
                      <button className="admin-btn admin-btn--sm admin-btn--outline" onClick={() => handleResetPassword(admin.id)}>🔑 MDP</button>
                    </>
                  )}
                  {admin.isSuperAdmin && <span className="admin-badge admin-badge--info">Super Admin</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
