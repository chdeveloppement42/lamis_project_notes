import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from '../../api/categories.api';
import { getLatestListings } from '../../api/listings.api';
import { getPlatformStats } from '../../api/stats.api';
import { 
  Building2, Home, Briefcase, Trees, Store, Warehouse,
  ShieldCheck, MapPin, Headphones, ChevronLeft, ChevronRight 
} from 'lucide-react';
import ListingCard from '../../components/ListingCard';
import './LandingPage.css';

const fallbackStats = [
  { number: '500+', label: 'Biens vérifiés' },
  { number: '120+', label: 'Fournisseurs' },
  { number: '10K+', label: 'Visiteurs / mois' },
  { number: '100%', label: 'Validés par admin' },
];

const categoryIcons = {
  appartement: <Building2 size={40} />,
  villa: <Home size={40} />,
  bureau: <Briefcase size={40} />,
  terrain: <Trees size={40} />,
  'local-commercial': <Store size={40} />,
  entrepot: <Warehouse size={40} />,
};

const slides = [
  { url: '/appartement.webp' },
  { url: '/villa.webp' },
  { url: '/services.webp' },
  { url: '/terrain.webp' }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [latestListings, setLatestListings] = useState([]);
  const [search, setSearch] = useState({ wilaya: '', category: '', maxPrice: '' });
  const [platformStats, setPlatformStats] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));

    getLatestListings()
      .then((data) => setLatestListings(Array.isArray(data) ? data : []))
      .catch(() => setLatestListings([]));

    getPlatformStats()
      .then(data => setPlatformStats([
        { number: `${data.activeListings || 0}+`, label: 'Biens vérifiés' },
        { number: `${data.totalProviders || 0}+`, label: 'Fournisseurs' },
        { number: `${data.citiesCovered || 0}+`, label: 'Villes couvertes' },
        { number: '100%', label: 'Validés par admin' },
      ]))
      .catch(() => setPlatformStats(fallbackStats));

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.wilaya) params.set('wilaya', search.wilaya);
    if (search.category) params.set('categoryId', search.category);
    if (search.maxPrice) params.set('maxPrice', search.maxPrice);
    navigate(`/services?${params.toString()}`);
  };

  return (
    <div className="landing">
      {/* ═══ HERO PRESTIGE ══════════════════════════════════════════ */}
      <section className="hero-full">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.url})` }}
            />
          ))}
        </div>

        <div className="hero-content-centered">
          <span className="hero-badge" data-aos="fade-down" data-aos-delay="200">
            L'IMMOBILIER DE PRESTIGE DEPUIS 2010
          </span>

          <h1 className="hero-main-title" data-aos="zoom-out" data-aos-duration="1500">
            IMMO<span className="text-prestige-gold">LAMIS</span>
          </h1>

          <div className="hero-subtitle-wrapper" data-aos="fade-up" data-aos-delay="400">
            <div className="line-prestige"></div>
            <h2 className="hero-subtitle-italique">L'Excellence Immobilière à Alger</h2>
            <div className="line-prestige"></div>
          </div>

          <p className="hero-long-desc" data-aos="fade-up" data-aos-delay="600">
            Bienvenue chez <span className="text-prestige-gold text-prestige-gold--bold">IMMOLAMIS</span>, votre partenaire de confiance dédié à l’immobilier d’exception. 
            Nous transcendons la simple transaction pour vous offrir une expérience sur mesure au cœur de la capitale.
          </p>

          <form className="hero-search-prestige glass" onSubmit={handleSearch} data-aos="fade-up" data-aos-delay="800">
            <div className="search-field">
              <label>Wilaya</label>
              <input
                type="text"
                placeholder="Alger, Oran..."
                value={search.wilaya}
                onChange={(e) => setSearch({ ...search, wilaya: e.target.value })}
              />
            </div>
            <div className="search-field">
              <label>Type</label>
              <select
                value={search.category}
                onChange={(e) => setSearch({ ...search, category: e.target.value })}
              >
                <option value="">Tous les types</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-discover-gold">
              Rechercher →
            </button>
          </form>
        </div>
        
        <div className="scroll-hint">
          <div className="mouse-icon"><div className="mouse-wheel"></div></div>
        </div>
      </section>

      {/* ═══ POURQUOI NOUS CHOISIR ════════════════════════════════ */}
      <section className="prestige-navy-bg section">
        <div className="container">
          <div className="section-header-prestige" data-aos="fade-up">
            <p className="cursive-accent">L'Engagement</p>
            <h2 className="massive-title">L'EXCELLENCE IMMO <span className="text-prestige-gold">LAMIS</span></h2>
            <p className="header-description">
              Nous redéfinissons les standards de l'immobilier algérois à travers une approche holistique où chaque détail compte.
            </p>
            <div className="title-underline-centered"></div>
          </div>
          <div className="why-grid-prestige">
            {[
              { icon: <ShieldCheck size={35}/>, title: "SÉRÉNITÉ TOTALE", desc: "Audit juridique rigoureux pour vos investissements." },
              { icon: <MapPin size={35}/>, title: "ADRESSES D'EXCEPTION", desc: "Emplacements stratégiques et prestigieux." },
              { icon: <Headphones size={35}/>, title: "CONCIERGERIE", desc: "Accompagnement VIP 7j/7 personnalisé." }
            ].map((item, idx) => (
              <div className="why-card-prestige glass-card" key={idx} data-aos="fade-up" data-aos-delay={idx * 200}>
                <div className="why-icon-luxe text-prestige-gold">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES (dynamic) ════════════════════════════════ */}
      <section className="section categories-section categories-section--ivory">
        <div className="container">
          <div className="section-header-prestige" data-aos="fade-up">
            <p className="cursive-accent">Explorez</p>
            <h2 className="massive-title massive-title--dark">NOS CATÉGORIES</h2>
            <p className="header-description header-description--muted">
              Découvrez notre sélection classée par univers.
            </p>
            <div className="title-underline-centered"></div>
          </div>
          <div className="categories-grid-prestige">
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                to={`/services?categoryId=${cat.id}`}
                className="cat-card-prestige cat-card-prestige--white"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="cat-icon-prestige text-prestige-gold">{categoryIcons[cat.slug] || <Home size={40}/>}</div>
                <h3>{cat.name.toUpperCase()}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LATEST LISTINGS (dynamic) ═════════════════════════════ */}
      {latestListings.length > 0 && (
        <section className="section latest-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Dernières annonces</h2>
              <p className="section-subtitle">
                Les biens les plus récemment publiés sur notre plateforme
              </p>
            </div>

            <div className="latest-grid">
              {latestListings.map((listing, idx) => (
                <div key={listing.id} data-aos="fade-up" data-aos-delay={idx * 150}>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>

            <div className="latest-section__cta">
              <Link to="/services" className="btn btn-secondary btn-lg">
                Voir toutes les annonces →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ HOW IT WORKS ══════════════════════════════════════════ */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Comment ça marche ?</h2>
            <p className="section-subtitle">
              Un processus simple, transparent et sécurisé
            </p>
          </div>

          <div className="how-grid">
            <div className="how-card" data-aos="fade-up" data-aos-delay="0">
              <div className="how-card__number">01</div>
              <h3>Inscription Fournisseur</h3>
              <p>Les agents immobiliers s'inscrivent avec leurs documents professionnels pour vérification.</p>
            </div>
            <div className="how-card" data-aos="fade-up" data-aos-delay="200">
              <div className="how-card__number">02</div>
              <h3>Validation Admin</h3>
              <p>Notre équipe vérifie chaque profil et chaque annonce avant publication sur la plateforme.</p>
            </div>
            <div className="how-card" data-aos="fade-up" data-aos-delay="400">
              <div className="how-card__number">03</div>
              <h3>Annonces Fiables</h3>
              <p>Les visiteurs accèdent à des biens 100% vérifiés avec des photos protégées par filigrane.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══════════════════════════════════════════════════ */}
      <section className="prestige-navy-bg section">
        <div className="container">
          <div className="stats-grid-prestige">
            {(platformStats || fallbackStats).map((s, i) => (
              <div className="stat-item" key={i} data-aos="zoom-in" data-aos-delay={i * 100}>
                <span className="stat-number text-prestige-gold">{s.number}</span>
                <span className="stat-label">{s.label}</span>
                <div className="stat-line"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-wrapper-prestige prestige-navy-bg">
            <div className="cta-content-prestige">
              <p className="cursive-accent">Privé</p>
              <h2 className="massive-title">DEVENEZ <span className="text-prestige-gold">PARTENAIRE</span></h2>
              <p className="cta-desc">Rejoignez le premier réseau immobilier de prestige en Algérie. Bénéficiez d'une visibilité exclusive et d'outils de gestion professionnels.</p>
              <Link to="/register" className="btn-discover-gold">
                Créer mon compte →
              </Link>
            </div>
            <div className="cta-image-prestige" />
          </div>
        </div>
      </section>
    </div>
  );
}
