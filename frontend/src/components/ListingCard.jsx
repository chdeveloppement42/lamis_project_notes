import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/urlUtils';
import { formatPrice } from '../utils/formatPrice';
import './ListingCard.css';

export default function ListingCard({ listing }) {
  const { id, title, price, city, district, category, images = [], provider } = listing;
  const [currentIndex, setCurrentIndex] = useState(0);

  const getDisplayUrl = (img) => {
    if (!img) return '';
    const path = typeof img === 'object' ? img.url : img;
    return getImageUrl(path);
  };

  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const providerInitial = provider?.firstName?.charAt(0) || 'P';

  return (
    <Link to={`/listing/${id}`} className="listing-card">
      <div className="listing-card__image-container">
        {images.length > 0 ? (
          <img 
            src={getDisplayUrl(images[currentIndex])} 
            alt={`${title}`} 
            className="listing-card__img" 
            loading="lazy"
          />
        ) : (
          <div className="listing-card__placeholder">🏠</div>
        )}

        {category && <span className="listing-card__badge">{category.name}</span>}

        {images.length > 1 && (
          <>
            <button className="slider-btn prev" onClick={prevSlide}>‹</button>
            <button className="slider-btn next" onClick={nextSlide}>›</button>
            
            <div className="slider-dots">
              {images.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`dot ${idx === currentIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="listing-card__body">
        <h3 className="listing-card__title">{title}</h3>
        <div className="listing-card__location">
          <span style={{ color: 'var(--immo-dore)' }}>📍</span> {city}{district ? `, ${district}` : ''}
        </div>

        <div className="listing-card__footer">
          <span className="listing-card__price">{formatPrice(price)}</span>
          <div className="listing-card__avatar">{providerInitial}</div>
        </div>
      </div>
    </Link>
  );
}