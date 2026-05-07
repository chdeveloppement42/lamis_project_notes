import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { formatPrice } from '../../utils/formatPrice';
import './ProviderPages.css';

const statusLabels = {
  DRAFT: { text: 'Brouillon', class: 'status-draft' },
  PUBLISHED: { text: 'Publiée', class: 'status-published' },
  UNPUBLISHED: { text: 'Dépubliée', class: 'status-unpublished' },
};

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const fetchListings = async () => {
    try {
      const res = await axiosInstance.get('/listings/provider/mine');
      setListings(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Erreur:", error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const openGallery = (images) => {
    if (images?.length > 0) setGalleryImages(images);
    else alert("Aucune image disponible.");
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

  if (loading) return <div className="loading-container">Chargement de vos biens...</div>;

  return (
    <div className="provider-page animate-fade-in">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Mes Annonces</h1>
          <p className="admin-page__subtitle">
            {listings.length} bien{listings.length !== 1 ? 's' : ''} immobilier{listings.length !== 1 ? 's' : ''} en gestion
          </p>
        </div>
        <Link to="/provider/post" className="admin-btn admin-btn--primary">
          + Nouvelle annonce
        </Link>
      </div>

      <div className="provider-listings-table">
        <table>
          <thead>
            <tr>
              <th>Bien Immoblilier</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Localisation</th>
              <th>Statut</th>
              <th>Galerie</th>
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
                    <strong>{listing.title}</strong>
                  </td>
                  <td data-label="Catégorie">
                    <span className="category-tag">{listing.category?.name || 'Immobilier'}</span>
                  </td>
                  <td data-label="Prix" className="td-price">
                    {formatPrice(listing.price)} DA
                  </td>
                  <td data-label="Ville">{listing.city}</td>
                  <td data-label="Statut">
                    <span className={`status-badge ${status.class}`}>
                      {status.text}
                    </span>
                  </td>
                  <td data-label="Photos">
                    <button className="btn-view-photos" onClick={() => openGallery(images)}>
                      👁️ {images.length} Photo{images.length > 1 ? 's' : ''}
                    </button>
                  </td>
                  <td data-label="Actions">
                    <div className="action-buttons-group">
                      
                      <button className="btn-action-icon delete" onClick={() => handleDelete(listing.id)} title="Supprimer">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {listings.length === 0 && (
          <div className="empty-state-container">
            <p>Vous n'avez pas encore publié d'annonces.</p>
            <Link to="/provider/post" className="admin-btn admin-btn--outline">Créer ma première annonce</Link>
          </div>
        )}
      </div>

      {/* GALERIE MODAL */}
      {galleryImages && (
        <div className="gallery-overlay" onClick={closeGallery}>
          <button className="close-gallery" onClick={closeGallery}>&times;</button>
          <div className="gallery-scroll-container" onClick={(e) => e.stopPropagation()}>
            {galleryImages.map((img, idx) => (
              <div key={idx} className="gallery-item">
                <img 
                  src={img.url || img} 
                  alt="" 
                  className={`gallery-img ${isZoomed ? 'zoomed' : ''}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </div>
            ))}
          </div>
          <div className="gallery-footer">
            <p>{isZoomed ? "Cliquez pour dézoomer" : "Scrollez horizontalement • Cliquez pour zoomer"}</p>
          </div>
        </div>
      )}
    </div>
  );
}