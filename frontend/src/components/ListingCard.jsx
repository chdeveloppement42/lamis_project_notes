import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/urlUtils';
import { formatPrice } from '../utils/formatPrice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ListingCard.css';

export default function ListingCard({ listing }) {
  const { id, title, price, city, district, category, images = [], provider } = listing;
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. S'assurer que images est toujours traité comme un tableau
  const imageList = Array.isArray(images) ? images : [];

  // 2. Extraire l'URL selon ton schéma de base de données (id, url, isMain...)
  const getDisplayUrl = (img) => {
    if (!img) return '';
    // Si img est l'objet de ta table ListingImage, on prend img.url
    const path = typeof img === 'object' ? img.url : img;
    return getImageUrl(path);
  };

  // 3. Fonctions de navigation avec arrêt de propagation pour ne pas déclencher le Link
  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (imageList.length > 1) {
      setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    }
  };

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (imageList.length > 1) {
      setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
    }
  };

  const providerInitial = provider?.firstName?.charAt(0) || 'P';

  return (
    <Link to={`/listing/${id}`} className="listing-card">
      <div className="listing-card__image-container">
        {/* Affichage de l'image actuelle basée sur currentIndex */}
        {imageList.length > 0 ? (
          <img 
            key={currentIndex} 
            src={getDisplayUrl(imageList[currentIndex])} 
            alt={title} 
            className="listing-card__img" 
            loading="lazy"
          />
        ) : (
          <div className="listing-card__placeholder">
            <span>🏠</span>
          </div>
        )}

        {/* Badge Catégorie */}
        {category && <span className="listing-card__badge">{category.name}</span>}

        {/* Navigation : affichée uniquement si > 1 image (Vérifie tes données !) */}
        {imageList.length > 1 && (
          <>
            <button className="slider-btn prev" onClick={prevSlide} type="button">
              <ChevronLeft size={20} />
            </button>
            <button className="slider-btn next" onClick={nextSlide} type="button">
              <ChevronRight size={20} />
            </button>
            
            <div className="slider-dots">
              {imageList.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="listing-card__body">
        <h3 className="listing-card__title">{title}</h3>
        
        <div className="listing-card__location">
          <span className="location-icon">📍</span> 
          {city}{district ? `, ${district}` : ''}
        </div>

        <div className="listing-card__footer">
          <div className="listing-card__price-box">
             <span className="listing-card__price">{formatPrice(price)}</span>
          </div>
          <div className="listing-card__avatar">
            {providerInitial}
          </div>
        </div>
      </div>
    </Link>
  );
}