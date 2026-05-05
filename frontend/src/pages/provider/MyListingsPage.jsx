import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { formatPrice } from '../../utils/formatPrice';
import './ProviderPages.css';

const statusLabels = {
  DRAFT: { text: 'Brouillon', color: '#6b7280' },
  PUBLISHED: { text: 'Publiée', color: '#34657F' }, // Bleu signature Immo Lamis
  UNPUBLISHED: { text: 'Dépubliée', color: '#dc2626' },
};

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState(null); // Gère l'affichage de la galerie
  const [isZoomed, setIsZoomed] = useState(false); // Gère l'état du zoom

  const fetchListings = async () => {
    try {
      const res = await axiosInstance.get('/listings/provider/mine');
      setListings(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Erreur de récupération:", error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const openGallery = (images) => {
    if (images && images.length > 0) {
      setGalleryImages(images);
    } else {
      alert("Aucune image disponible pour cette annonce.");
    }
  };

  const closeGallery = () => {
    setGalleryImages(null);
    setIsZoomed(false);
  };

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
    <div className="provider-page animate-fade-in">
      {/* HEADER */}
      <div className="provider-page__header-row">
        <div className="header-text">
          <h1 className="provider-page__title">Mes Annonces</h1>
          <p className="provider-page__subtitle">
            {listings.length} annonce{listings.length !== 1 ? 's' : ''} répertoriée{listings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/provider/post" className="btn-provider-primary">
          <span className="btn-icon">+</span>
          <span className="hide-mobile">Nouvelle annonce</span>
        </Link>
      </div>

      {loading ? (
        <div className="provider-card-loading">
          <p>Chargement de vos biens immobiliers...</p>
        </div>
      ) : (
        <div className="provider-listings-table">
          <table>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Ville</th>
                <th>Statut</th>
                <th>Photos</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => {
                const status = statusLabels[listing.status] || statusLabels.DRAFT;
                const images = listing.images || [];

                return (
                  <tr key={listing.id}>
                    <td data-label="Titre" className="td-title">
                      {listing.title}
                    </td>

                    <td data-label="Catégorie">
                      <span className="category-tag">
                        {listing.category?.name || 'Immobilier'}
                      </span>
                    </td>

                    <td data-label="Prix" className="td-price">
                      {formatPrice(listing.price)} DA
                    </td>

                    <td data-label="Ville">{listing.city}</td>

                    <td data-label="Statut">
                      <span 
                        className="provider-status-badge" 
                        style={{ background: status.color }}
                      >
                        {status.text}
                      </span>
                    </td>

                    <td data-label="Photos">
                      <button 
                        className="btn-view-photos" 
                        onClick={() => openGallery(images)}
                      >
                        👁️ Voir ({images.length})
                      </button>
                    </td>

                    <td data-label="Actions">
                      <div className="mobile-actions">
                        <Link 
                          to={`/provider/edit/${listing.id}`} 
                          className="btn-action edit"
                          title="Modifier"
                        >
                          ✏️ <span className="show-mobile">Modifier</span>
                        </Link>
                        <button 
                          className="btn-action delete" 
                          onClick={() => handleDelete(listing.id)}
                          title="Supprimer"
                        >
                          🗑️ <span className="show-mobile">Supprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {listings.length === 0 && !loading && (
            <div className="empty-state">
              <p>Vous n'avez pas encore publié d'annonces.</p>
            </div>
          )}
        </div>
      )}

      {/* GALERIE PLEIN ÉCRAN (MODAL) */}
      {galleryImages && (
        <div className="gallery-overlay" onClick={closeGallery}>
          <button className="close-gallery" onClick={closeGallery}>&times;</button>
          
          <div className="gallery-scroll-container" onClick={(e) => e.stopPropagation()}>
            {galleryImages.map((img, idx) => (
              <div key={idx} className="gallery-item">
                <img 
                  src={img.url || img} 
                  alt={`Vue ${idx + 1}`} 
                  className={`gallery-img ${isZoomed ? 'zoomed' : ''}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </div>
            ))}
          </div>

          <div className="gallery-footer">
            <p>
              {isZoomed 
                ? "Cliquez sur l'image pour dézoomer" 
                : "Scrollez horizontalement • Cliquez pour zoomer"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}