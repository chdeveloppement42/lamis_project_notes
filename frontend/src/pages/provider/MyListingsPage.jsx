import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { formatPrice } from '../../utils/formatPrice';
import './ProviderPages.css';

const statusLabels = {
  DRAFT: { text: 'Brouillon', color: '#6b7280' },
  PUBLISHED: { text: 'Publiée', color: '#16a34a' },
  UNPUBLISHED: { text: 'Dépubliée', color: '#dc2626' },
};

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const res = await axiosInstance.get('/listings/provider/mine');
      setListings(Array.isArray(res.data) ? res.data : []);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette annonce définitivement ?')) return;
    try {
      await axiosInstance.delete(`/listings/${id}`);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="provider-page">
      <div className="provider-page__header-row">
        <div>
          <h1>Mes Annonces</h1>
          <p className="provider-page__subtitle">{listings.length} annonce{listings.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/provider/post" className="btn btn-primary">
          + Nouvelle annonce
        </Link>
      </div>

      {loading ? (
        <div className="provider-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Chargement...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="provider-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</p>
          <h3>Aucune annonce</h3>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: '1.5rem' }}>
            Vous n'avez pas encore créé d'annonce.
          </p>
          <Link to="/provider/post" className="btn btn-primary">
            Créer ma première annonce
          </Link>
        </div>
      ) : (
        <div className="provider-listings-table">
          <table>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Ville</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => {
                const status = statusLabels[listing.status] || statusLabels.DRAFT;
                return (
                  <tr key={listing.id}>
                    <td className="provider-listings-table__title">{listing.title}</td>
                    <td>{listing.city}</td>
                    <td>{formatPrice(listing.price)}</td>
                    <td>
                      <span className="provider-status-badge" style={{ background: status.color }}>
                        {status.text}
                      </span>
                    </td>
                    <td>{new Date(listing.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ color: 'var(--color-danger)' }}
                        onClick={() => handleDelete(listing.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
