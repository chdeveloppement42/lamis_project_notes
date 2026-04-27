import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './AdminTable.css';
import { getImageUrl } from '../../utils/urlUtils';

import { getStatusLabel, getStatusClass, ACCOUNT_STATUS } from '../../utils/statusUtils';

export default function ProvidersManager() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      const url = statusFilter ? `/providers?status=${statusFilter}` : '/providers';
      const response = await axiosInstance.get(url);
      setProviders(response.data);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProviders();
  }, [fetchProviders]);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Voulez-vous vraiment ${action} ce fournisseur ?`)) return;
    try {
      await axiosInstance.patch(`/providers/${id}/${action}`);
      fetchProviders(); // Refresh list after action
    } catch (error) {
      console.error(`Failed to ${action} provider:`, error);
      const message = error.response?.data?.message || 'Erreur lors de l\'opération';
      alert(`Erreur : ${message}`);
    }
  };

  return (
    <div className="admin-table-page">
      <div className="admin-table-page__header">
        <div>
          <h2>Gestion des Fournisseurs</h2>
          <p>{providers.length} fournisseurs enregistrés</p>
        </div>
        <div className="admin-table-page__filters">
          <select 
            className="form-input" 
            style={{ maxWidth: 200 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="VALIDATED">Validés</option>
            <option value="REJECTED">Rejetés</option>
            <option value="SUSPENDED">Suspendus</option>
          </select>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Fournisseur</th>
              <th>Contact</th>
              <th>Document</th>
              <th>Statut</th>
              <th>Inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Chargement...</td></tr>
            ) : providers.length === 0 ? (
               <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Aucun fournisseur trouvé</td></tr>
            ) : providers.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="admin-table__user">
                    <div className="admin-table__avatar">{p.firstName?.charAt(0) || 'F'}</div>
                    <div>
                      <strong>{p.firstName} {p.lastName}</strong>
                      <span className="admin-table__email">{p.email}</span>
                    </div>
                  </div>
                </td>
                <td>{p.phone || '—'}</td>
                <td>
                  {p.documentUrl ? (
                    <a href={getImageUrl(p.documentUrl)} target="_blank" rel="noreferrer" className="admin-btn admin-btn--sm admin-btn--outline">Voir</a>
                  ) : '—'}
                </td>
                <td><span className={`admin-badge ${getStatusClass(p.status)}`}>{getStatusLabel(p.status, 'account')}</span></td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="admin-table__actions">
                    {p.status === ACCOUNT_STATUS.PENDING && (
                      <>
                        <button onClick={() => handleAction(p.id, 'validate')} className="admin-btn admin-btn--sm admin-btn--primary">Valider</button>
                        <button onClick={() => handleAction(p.id, 'reject')} className="admin-btn admin-btn--sm admin-btn--outline" style={{ color: 'var(--color-danger)' }}>Rejeter</button>
                      </>
                    )}
                    {p.status === ACCOUNT_STATUS.VALIDATED && (
                      <button onClick={() => handleAction(p.id, 'suspend')} className="admin-btn admin-btn--sm admin-btn--warning">Suspendre</button>
                    )}
                    {p.status === ACCOUNT_STATUS.SUSPENDED && (
                      <button onClick={() => handleAction(p.id, 'reactivate')} className="admin-btn admin-btn--sm admin-btn--primary">Réactiver</button>
                    )}
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
