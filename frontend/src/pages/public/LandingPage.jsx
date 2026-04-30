import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../api/categories.api';
import { getLatestListings } from '../../api/listings.api';
import ListingCard from '../../components/ListingCard';
import './LandingPage.css';

const categoryIcons = {
  villa: '🏡',
  bungalow: '🏘️',
  terrain: '🌳',
  appartement: '🏢',
  'local-commercial': '🏪'
};


const features = [
  {
    icon: '✓',
    title: 'Annonces Vérifiées',
    desc: 'Chaque bien est vérifié par notre équipe avant publication'
  },
  {
    icon: '🔒',
    title: 'Transactions Sécurisées',
    desc: 'Accompagnement juridique pour vos opérations immobilières'
  },
  {
    icon: '💬',
    title: 'Support Réactif',
    desc: 'Une équipe disponible 7j/7 pour répondre à vos questions'
  }
];

const testimonials = [
  {
    text: "Une expérience fluide. J'ai trouvé mon terrain en un temps record grâce à la vérification des annonces.",
    author: 'Karim B.',
    role: 'Investisseur'
  },
  {
    text: "Le support client est incroyable. Ils m'ont accompagné pour l'achat de ma villa du début à la fin.",
    author: 'Amel S.',
    role: 'Propriétaire'
  },
  {
    text: "Plateforme très professionnelle. Les photos et descriptions correspondent parfaitement aux biens réels.",
    author: 'Mohamed T.',
    role: 'Promoteur'
  }
];

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [latestListings, setLatestListings] = useState([]);

  useEffect(() => {
    Promise.all([getCategories(), getLatestListings()])
      .then(([catData, listData]) => {
        setCategories(catData);
        setLatestListings(listData);
      });
  }, []);
const [currentSlide, setCurrentSlide] = useState(0);

  // Liste de tes nouvelles images haute qualité
  const slides = [
    { url: '/appartement.png', title: 'Appartements de standing' },
    { url: '/villa.png', title: 'Villas d\'exception' },
    { url: '/terrain.png', title: 'Terrains à fort potentiel' },
    { url: '/local.png', title: 'Espaces professionnels' }
  ];

  // Logique du défilement automatique (toutes les 5 secondes)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  return (
    <div className="landing-page">
      
      {/* HERO SECTION */}
      <section className="hero-section">
       {/* Background Slider */}
       <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.url})` }}
          />
        ))}
       </div>

       {/* Hero Content (Toujours visible) */}
       <div className="hero-content container">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          Leader de l'immobilier en Algérie
        </div>
        
        <h1 className="hero-title">
          Votre rêve immobilier commence <span>ici</span>
        </h1>
        
        <p className="hero-subtitle">
          Découvrez une sélection exclusive de villas, appartements et terrains. 
          Une plateforme de confiance pour vos projets de vie avec des annonces vérifiées.
        </p>
        
        <div className="hero-cta">
          <Link to="/listings" className="btn-primary-hero">
            Explorer le catalogue <span>→</span>
          </Link>
          <Link to="/contact" className="btn-secondary-hero">
            Nous contacter
          </Link>
        </div>

        {/* Indicateurs de slides (petits points en bas) */}
        <div className="slider-dots">
          {slides.map((_, i) => (
            <span 
              key={i} 
              className={`dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            ></span>
          ))}
        </div>
       </div>
    
  

        <div className="hero-scroll">
          <span>Découvrir</span>
          <span>↓</span>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">🏠</div>
            <div className="stat-number">500+</div>
            <div className="stat-label">Biens certifiés</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🤝</div>
            <div className="stat-number">120</div>
            <div className="stat-label">Partenaires</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">98%</div>
            <div className="stat-label">Clients satisfaits</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🛡️</div>
            <div className="stat-number">100%</div>
            <div className="stat-label">Sécurisé</div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="categories-section">
        <div className="section-header">
          <span className="section-badge">Collections</span>
          <h2 className="section-title">Nos Catégories</h2>
          <p className="section-subtitle">Explorez nos types de biens les plus demandés, triés sur le volet pour leur qualité.</p>
        </div>
        
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/services?categoryId=${cat.id}`} className="category-card">
              <div className="category-icon">{categoryIcons[cat.slug] || '🏠'}</div>
              <h3 className="category-name">{cat.name}</h3>
              <span className="category-count">Découvrir les annonces</span>
              <span className="category-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>
         {/* LISTINGS SECTION */}
        <section className="listings-section">
        <div className="section-header">
          <span className="section-badge">Opportunités</span>
          <h2 className="section-title">Annonces Récentes</h2>
          <p className="section-subtitle">Les dernières pépites immobilières mises en ligne récemment.</p>
        </div>

        <div className="listings-grid">
          {latestListings.slice(0, 6).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="listing-action">
          <Link to="/services" className="btn-view-all">
            Voir toutes les annonces
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-badge">Pourquoi nous</span>
          <h2 className="section-title">Une expérience unique</h2>
          <p className="section-subtitle">Nous nous engageons à vous offrir le meilleur service immobilier.</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

   
     
      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="section-badge">Avis clients</span>
          <h2 className="section-title">Ce que disent nos clients</h2>
          <p className="section-subtitle">Découvrez les témoignages de ceux qui nous ont fait confiance.</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{testimonial.author[0]}</div>
                <div className="testimonial-info">
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Prêt à trouver votre bien idéal ?</h2>
          <p className="cta-subtitle">Contactez-nous dès aujourd'hui pour une consultation gratuite.</p>
          <div className="cta-buttons">
            <Link to="/services" className="btn-cta-white">
              Parcourir les annonces
            </Link>
            <Link to="/contact" className="btn-cta-outline">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}