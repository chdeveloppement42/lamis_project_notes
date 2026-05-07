import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './AdminTable.css';
import { LISTING_STATUS, getStatusLabel, getStatusClass, ACCOUNT_STATUS } from '../../utils/statusUtils';
import { LayoutList, User, Tag, Banknote, ShieldCheck, Calendar, Settings } from 'lucide-react';

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
      fetchListings();
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
              <th><LayoutList size={14} style={{marginRight: 8}}/>Annonce</th>
              <th><User size={14} style={{marginRight: 8}}/>Fournisseur</th>
              <th><Tag size={14} style={{marginRight: 8}}/>Catégorie</th>
              <th><Banknote size={14} style={{marginRight: 8}}/>Prix</th>
              <th><ShieldCheck size={14} style={{marginRight: 8}}/>Statut</th>
              <th><Calendar size={14} style={{marginRight: 8}}/>Date</th>
              <th><Settings size={14} style={{marginRight: 8}}/>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>Chargement...</td></tr>
            ) : listings.length === 0 ? (
               <tr><td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>Aucune annonce trouvée</td></tr>
            ) : listings.map((l) => (
              <tr key={l.id}>
                {/* Cellule Titre - Pas de label pour faire office de "Titre de carte" sur mobile */}
                <td>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <strong style={{color: 'var(--admin-navy)', fontSize: '1rem'}}>{l.title}</strong>
                        <span style={{fontSize: '11px', color: '#94a3b8'}}>ID: #{l.id.toString().slice(-5)}</span>
                    </div>
                </td>

                <td data-label="Fournisseur">
                    {l.provider ? `${l.provider.firstName} ${l.provider.lastName}` : '—'}
                </td>

                <td data-label="Catégorie">
                    <span className="admin-badge" style={{background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0'}}>
                        {l.category?.name || '—'}
                    </span>
                </td>

                <td data-label="Prix">
                    <strong style={{color: 'var(--admin-navy)'}}>{l.price?.toLocaleString()} DA</strong>
                </td>

                <td data-label="Statut">
                  <div className="status-container-mobile">
                    <span className={`admin-badge ${getStatusClass(l.status)}`}>
                      {getStatusLabel(l.status)}
                    </span>
                    {l.provider?.status && l.provider.status !== ACCOUNT_STATUS.VALIDATED && (
                      <span className="admin-badge" style={{ backgroundColor: '#64748b', fontSize: '9px', marginTop: '4px', display: 'block' }}>
                        Masqué (Fournisseur {getStatusLabel(l.provider.status, 'account')})
                      </span>
                    )}
                  </div>
                </td>

                <td data-label="Date">
                    {new Date(l.createdAt).toLocaleDateString('fr-FR')}
                </td>

                <td data-label="Actions">
                  <div className="admin-table__actions">
                    {l.status !== 'PUBLISHED' && (
                      <button onClick={() => handleAction(l.id, 'publish')} className="admin-btn admin-btn--primary">Publier</button>
                    )}
                    {l.status === 'PUBLISHED' && (
                      <button onClick={() => handleAction(l.id, 'unpublish')} className="admin-btn admin-btn--warning">Dépublier</button>
                    )}
                    <button onClick={() => handleAction(l.id, 'delete')} className="admin-btn admin-btn--outline" style={{ color: '#ef4444', borderColor: '#fee2e2' }}>Supprimer</button>
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