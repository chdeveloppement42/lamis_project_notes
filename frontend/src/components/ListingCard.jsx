import { Link, useLocation } from 'react-router-dom';
import { getImageUrl } from '../utils/urlUtils';
import { formatPrice } from '../utils/formatPrice';
import './ListingCard.css';


export default function ListingCard({ listing }) {
  const location = useLocation();
  const {
    id,
    title,
    price,
    type,
    wilaya,
    commune,
    category,
    images = [],
    provider,
  } = listing;

  const thumbUrl = images.length > 0
    ? getImageUrl(images[0].url)
    : null;

  const providerInitial = provider?.firstName?.charAt(0) || provider?.email?.charAt(0) || 'F';

  return (
    <Link to={`/listing/${id}`} state={{ fromSearch: location.search, fromPath: location.pathname }} className="listing-card">
      <div className="listing-card__image">
        {thumbUrl ? (
          <img src={thumbUrl} alt={title} loading="lazy" />
        ) : (
          <div className="listing-card__placeholder">
            <img src="/branding/icon-house.svg" alt="House" className="listing-card__placeholder-icon" />
          </div>
        )}

        <div className="listing-card__badges">
          {category && (
            <span className="listing-card__badge listing-card__badge--category">{category.name}</span>
          )}
          {type && (
            <span className={`listing-card__badge listing-card__badge--${type.toLowerCase()}`}>
              {type === 'VENTE' ? 'Vente' : 'Location'}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <span className="listing-card__photo-count">
            <img src="/branding/icon-floor.svg" alt="Photos" className="listing-card__photo-icon" />
            {images.length}
          </span>
        )}
      </div>

      <div className="listing-card__body">
        <h3 className="listing-card__title">{title}</h3>

        <div className="listing-card__location">
          <img src="/branding/icon-pin.svg" alt="Location" className="listing-card__location-icon" />
          <span>{wilaya}{commune ? `, ${commune}` : ''}</span>
        </div>

        <div className="listing-card__footer">
          <span className="listing-card__price">{formatPrice(price)}</span>

          <div className="listing-card__provider">
            <span className="listing-card__avatar">{providerInitial}</span>
            {provider?.status === 'VALIDATED' && (
              <img 
                src="/branding/verified-badge.svg" 
                alt="Vérifié" 
                className="listing-card__verified"
                style={{ width: '14px', height: '14px', marginLeft: '-6px', marginTop: '14px', zIndex: 1 }}
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
