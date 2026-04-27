import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/urlUtils';
import { formatPrice } from '../utils/formatPrice';
import './ListingCard.css';


export default function ListingCard({ listing }) {
  const {
    id,
    title,
    price,
    city,
    district,
    category,
    images = [],
    provider,
  } = listing;

  const thumbUrl = images.length > 0
    ? getImageUrl(images[0].url)
    : null;

  const providerInitial = provider?.firstName?.charAt(0) || provider?.email?.charAt(0) || 'F';

  return (
    <Link to={`/listing/${id}`} className="listing-card">
      <div className="listing-card__image">
        {thumbUrl ? (
          <img src={thumbUrl} alt={title} loading="lazy" />
        ) : (
          <div className="listing-card__placeholder">
            <span>🏠</span>
          </div>
        )}

        {/* Category badge */}
        {category && (
          <span className="listing-card__badge">{category.name}</span>
        )}

        {/* Photo count */}
        {images.length > 1 && (
          <span className="listing-card__photo-count">
            📷 {images.length}
          </span>
        )}
      </div>

      <div className="listing-card__body">
        <h3 className="listing-card__title">{title}</h3>

        <div className="listing-card__location">
          <span className="listing-card__pin">📍</span>
          <span>{city}{district ? `, ${district}` : ''}</span>
        </div>

        <div className="listing-card__footer">
          <span className="listing-card__price">{formatPrice(price)}</span>

          <div className="listing-card__provider">
            <span className="listing-card__avatar">{providerInitial}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
