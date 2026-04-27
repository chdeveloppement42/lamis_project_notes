import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListingById } from '../../api/listings.api';
import { formatPrice } from '../../utils/formatPrice';
import './DetailPage.css';

import { getImageUrl } from '../../utils/urlUtils';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getListingById(id)
      .then((data) => {
        setListing(data);
        setActiveImage(0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-page__hero"><div className="container" /></div>
        <div className="container detail-loading">
          <div className="spinner" />
          <p>Chargement de l'annonce...</p>
        </div>
      </div>
    );
  }

  // Error / 404 state
  if (error || !listing) {
    return (
      <div className="detail-page">
        <div className="detail-page__hero">
          <div className="container">
            <Link to="/services" className="detail-page__back">← Retour aux annonces</Link>
          </div>
        </div>
        <div className="container">
          <div className="detail-404">
            <span className="detail-404__icon">🔍</span>
            <h2>Annonce introuvable</h2>
            <p>Cette annonce n'existe pas ou a été retirée de la plateforme.</p>
            <Link to="/services" className="btn btn-primary">Voir toutes les annonces</Link>
          </div>
        </div>
      </div>
    );
  }

  const images = listing.images || [];
  const mainImageUrl = images.length > 0 && images[activeImage]
    ? getImageUrl(images[activeImage].url)
    : null;

  const publishDate = listing.createdAt
    ? new Date(listing.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';

  return (
    <div className="detail-page">
      {/* ─── Breadcrumb Bar ─────────────────────────────── */}
      <div className="detail-page__hero">
        <div className="container detail-page__breadcrumb">
          <Link to="/">Accueil</Link>
          <span className="detail-page__sep">›</span>
          <Link to="/services">Annonces</Link>
          <span className="detail-page__sep">›</span>
          {listing.category && (
            <>
              <Link to={`/services?categoryId=${listing.category.id}`}>{listing.category.name}</Link>
              <span className="detail-page__sep">›</span>
            </>
          )}
          <span className="detail-page__current">{listing.title}</span>
        </div>
      </div>

      <div className="container detail-content">
        {/* ─── Main Column ─────────────────────────────── */}
        <div className="detail-main">
          {/* Photo Gallery */}
          <div className="detail-gallery">
            <div className="detail-gallery__main">
              {mainImageUrl ? (
                <img src={mainImageUrl} alt={listing.title} />
              ) : (
                <div className="detail-gallery__placeholder">
                  <span>🏠</span>
                  <p>Aucune photo disponible</p>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="detail-gallery__thumbs">
                {images.map((img, i) => (
                  <button
                    key={img.id || i}
                    className={`detail-gallery__thumb ${i === activeImage ? 'detail-gallery__thumb--active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={getImageUrl(img.url)} alt={`Photo ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title + Price */}
          <div className="detail-header">
            <div>
              <h1 className="detail-header__title">{listing.title}</h1>
              <div className="detail-header__location">
                <span>📍</span>
                {listing.city}{listing.district ? `, ${listing.district}` : ''}
              </div>
            </div>
            <div className="detail-header__price">{formatPrice(listing.price)}</div>
          </div>

          {/* Info Table */}
          <div className="detail-info-table">
            <h3>📋 Informations de l'annonce</h3>
            <table>
              <tbody>
                <tr>
                  <td className="detail-info-table__label">Référence</td>
                  <td>{listing.id}</td>
                </tr>
                <tr>
                  <td className="detail-info-table__label">Date de publication</td>
                  <td>{publishDate}</td>
                </tr>
                {listing.category && (
                  <tr>
                    <td className="detail-info-table__label">Catégorie</td>
                    <td>{listing.category.name}</td>
                  </tr>
                )}
                <tr>
                  <td className="detail-info-table__label">Wilaya / Commune</td>
                  <td>{listing.city}{listing.district ? ` / ${listing.district}` : ''}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Description */}
          <div className="detail-description">
            <h3>📝 Description</h3>
            <p>{listing.description || 'Aucune description fournie.'}</p>
          </div>
        </div>

        {/* ─── Sidebar (Provider Contact) ──────────────── */}
        <aside className="detail-sidebar">
          <div className="detail-provider-card">
            <div className="detail-provider-card__header">
              <div className="detail-provider-card__avatar">
                {listing.provider?.firstName?.charAt(0) || 'F'}
              </div>
              <div>
                <h4 className="detail-provider-card__name">
                  {listing.provider?.firstName
                    ? `${listing.provider.firstName} ${listing.provider.lastName || ''}`
                    : 'Fournisseur vérifié'}
                </h4>
                <span className="detail-provider-card__badge">✅ Vérifié</span>
              </div>
            </div>

            {/* Location */}
            <div className="detail-provider-card__info">
              <span>📍</span>
              <span>{listing.city}, Algérie</span>
            </div>

            {/* Phone */}
            {listing.provider?.phone && (
              <a
                href={`tel:${listing.provider.phone}`}
                className="detail-provider-card__phone"
              >
                📞 {listing.provider.phone}
              </a>
            )}

            {/* Message button */}
            <button className="btn btn-primary detail-provider-card__msg">
              ✉️ Envoyer un message
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
