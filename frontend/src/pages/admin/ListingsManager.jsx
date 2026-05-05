import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './AdminTable.css';

import { LISTING_STATUS, getStatusLabel, getStatusClass, ACCOUNT_STATUS } from '../../utils/statusUtils';

export default function ListingsManager() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/listings/admin/all?status=${statusFilter}` : '/listings/admin/all';
      const response = await axiosInstance.get(url);
      setListings(response.data);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchListings();
  }, [fetchListings]);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Voulez-vous vraiment ${action} cette annonce ?`)) return;
    try {
      if (action === 'delete') {
        await axiosInstance.delete(`/listings/admin/${id}`);
      } else {
        await axiosInstance.patch(`/listings/${id}/${action}`);
      }
      fetchListings(); // Refresh list
    } catch (error) {
      console.error(`Failed to ${action} listing:`, error);
      alert('Erreur lors de l\'opération');
    }
  };

  return (
    <div className="admin-table-page">
      <div className="admin-table-page__header">
        <div>
          <h2>Modération des Annonces</h2>
          <p>{listings.length} annonces au total</p>
        </div>
        <div className="admin-table-page__filters">
          <select 
            className="form-input" 
            style={{ maxWidth: 200 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="DRAFT">Brouillons</option>
            <option value="PUBLISHED">Publiées</option>
            <option value="UNPUBLISHED">Dépubliées</option>
          </select>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Annonce</th>
              <th>Fournisseur</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Chargement...</td></tr>
            ) : listings.length === 0 ? (
               <tr><td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>Aucune annonce trouvée</td></tr>
            ) : listings.map((l) => (
              <tr key={l.id}>
                <td><strong>{l.title}</strong></td>
                <td>{l.provider?.firstName} {l.provider?.lastName}</td>
                <td><span className="admin-badge admin-badge--info">{l.category?.name || '—'}</span></td>
                <td>{l.price} DA</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className={`admin-badge ${getStatusClass(l.status)}`}>
                      {getStatusLabel(l.status)}
                    </span>
                    {l.provider?.status && l.provider.status !== ACCOUNT_STATUS.VALIDATED && (
                      <span className="admin-badge" style={{ backgroundColor: '#64748b', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                        Masqué (Fournisseur {getStatusLabel(l.provider.status, 'account')})
                      </span>
                    )}
                  </div>
                </td>
                <td>{new Date(l.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="admin-table__actions">
                    {l.status !== 'PUBLISHED' && (
                      <button onClick={() => handleAction(l.id, 'publish')} className="admin-btn admin-btn--sm admin-btn--primary">Publier</button>
                    )}
                    {l.status === 'PUBLISHED' && (
                      <button onClick={() => handleAction(l.id, 'unpublish')} className="admin-btn admin-btn--sm admin-btn--warning">Dépublier</button>
                    )}
                    <button onClick={() => handleAction(l.id, 'delete')} className="admin-btn admin-btn--sm admin-btn--outline" style={{ color: 'var(--color-danger)' }}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
