import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Home, Briefcase, Trees, Store, Warehouse,
  ShieldCheck, MapPin, Headphones, ChevronLeft, ChevronRight 
} from 'lucide-react'; 
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { getCategories } from '../../api/categories.api';
import { getLatestListings } from '../../api/listings.api';
import ListingCard from '../../components/ListingCard';
import './LandingPage.css';

const CATEGORY_ICONS = {
  appartement: <Building2 size={40} />,
  villa: <Home size={40} />,
  bureau: <Briefcase size={40} />,
  terrain: <Trees size={40} />,
  'local-commercial': <Store size={40} />,
  entrepot: <Warehouse size={40} />,
};

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [latestListings, setLatestListings] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ÉTATS POUR LA PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // REFS POUR LES BOUTONS SLIDE
  const catRef = useRef(null);
  const annoncesRef = useRef(null);

  const slides = [{ url: '/appartement.png' }, { url: '/villa.png' }, { url: '/entrop.png' }, { url: '/terrain.png' }];

  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const move = direction === 'left' ? -clientWidth : clientWidth;
      ref.current.scrollBy({ left: move, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const fetchData = async () => {
      try {
        const [cats, listings] = await Promise.all([getCategories(), getLatestListings()]);
        setCategories(cats);
        setLatestListings(listings);
        setTimeout(() => { AOS.refresh(); }, 500);
      } catch (err) { console.error("Erreur chargement:", err); }
    };
    fetchData();
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = latestListings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(latestListings.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    document.getElementById('annonces-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="aymen-style-wrapper">
      
      {/* HERO SECTION */}
      <section className="hero-full">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(10, 25, 35, 0.4), rgba(10, 25, 35, 0.7)), url(${slide.url})` }}
            />
          ))}
        </div>
        <div className="hero-content-centered" data-aos="zoom-in">
          <h1 className="hero-main-title">IMMO<span className="gold-text">LAMIS</span></h1>
          <div className="hero-text-wrapper">
            <p className="hero-desc-centered">L'excellence immobilière à Algerie et au-delà.</p>
            <p className="hero-sub-desc">Découvrez une sélection exclusive de biens d'exception.</p>
          </div>
          <div className="hero-actions">
            <Link to="/services" className="btn-discover">Découvrir notre catalogue <span className="btn-arrow">→</span></Link>
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS CHOISIR */}
      <section className="unified-section">
        <div className="container">
          <div className="section-header-large" data-aos="fade-up">
            <p className="cursive-accent">L'Engagement</p>
            <h2 className="massive-title">L'EXCELLENCE IMMO LAMIS</h2>
          </div>
          <div className="why-grid-aymen">
            <div className="why-card-aymen" data-aos="fade-up">
              <div className="why-icon-luxe"><ShieldCheck size={35} /></div>
              <div className="why-text-luxe">
                <h3>SÉRÉNITÉ TOTALE</h3>
                <p className="white-p">Audit juridique rigoureux pour un investissement sans compromis.</p>
              </div>
            </div>
            <div className="why-card-aymen" data-aos="fade-up" data-aos-delay="100">
              <div className="why-icon-luxe"><MapPin size={35} /></div>
              <div className="why-text-luxe">
                <h3>ADRESSES D'EXCEPTION</h3>
                <p className="white-p">Emplacements stratégiques et prestigieux à Alger.</p>
              </div>
            </div>
            <div className="why-card-aymen" data-aos="fade-up" data-aos-delay="200">
              <div className="why-icon-luxe"><Headphones size={35} /></div>
              <div className="why-text-luxe">
                <h3>SERVICE CONCIERGERIE</h3>
                <p className="white-p">Accompagnement personnel 7j/7 jusqu'à la remise des clés.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOS CATÉGORIES AVEC SLIDE MOBILE */}
      <section className="unified-section pt-0">
        <div className="container">
          <div className="section-header-large" data-aos="fade-up">
            <p className="cursive-accent">Explorez</p>
            <h2 className="massive-title">NOS CATÉGORIES</h2>
          </div>

          <div className="slider-nav-container">
            <button className="btn-slide-nav" onClick={() => scroll(catRef, 'left')}><ChevronLeft size={20}/></button>
            <button className="btn-slide-nav" onClick={() => scroll(catRef, 'right')}><ChevronRight size={20}/></button>
          </div>

          <div className="categories-grid-aymen mobile-slider-touch" ref={catRef}>
            {categories.map((cat, index) => (
              <Link key={cat.id} to={`/services?categoryId=${cat.id}`} className="cat-card-aymen">
                <div className="cat-icon-aymen">{CATEGORY_ICONS[cat.slug] || <Home size={40}/>}</div>
                <h3>{cat.name.toUpperCase()}</h3>
                <p className="white-p">Découvrir</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NOS ANNONCES AVEC SLIDE MOBILE */}
      <section className="unified-section pt-0" id="annonces-section">
        <div className="container">
          <div className="section-header-large" data-aos="fade-up">
            <p className="cursive-accent">Sélection Exclusive</p>
            <h2 className="massive-title">NOS DERNIÈRES <span className="gold-text">PÉPITES</span></h2>
            <p className="section-subtitle-luxe">Architecture et emplacement unique.</p>
            <div className="title-underline"></div>
          </div>

          <div className="slider-nav-container">
            <button className="btn-slide-nav" onClick={() => scroll(annoncesRef, 'left')}><ChevronLeft size={20}/></button>
            <button className="btn-slide-nav" onClick={() => scroll(annoncesRef, 'right')}><ChevronRight size={20}/></button>
          </div>

          <div className="listings-grid-aymen grid-home-3x3 mobile-slider-touch" ref={annoncesRef}>
            {currentItems.map((listing, index) => (
              <div className="listing-anim-wrapper" key={listing.id}>
                <div className="premium-tag">{index === 0 ? "Coup de Coeur" : "Nouveau"}</div>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination-luxe-wrapper" data-aos="fade-in">
              <div className="pagination-aymen">
                <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} className="pag-nav-btn"><ChevronLeft size={18} /></button>
                <div className="pag-numbers">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => paginate(i + 1)} className={`num-btn ${currentPage === i + 1 ? 'active' : ''}`}>
                      {String(i + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
                <button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} className="pag-nav-btn"><ChevronRight size={18} /></button>
              </div>
            </div>
          )}

          <div className="btn-container-center" data-aos="zoom-in">
            <Link to="/services" className="btn-aymen-gold-glow">
              <span className="main-text">EXPLORER LE CATALOGUE COMPLET</span>
              <span className="sub-text">Opportunités exclusives à Alger</span>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS & PRESTIGE */}
      <section className="unified-section stats-prestige-bg">
        <div className="container">
          <div className="stats-grid-aymen">
            <div className="stat-item" data-aos="fade-up"><span className="stat-number">15+</span><span className="stat-label">Années d'Expertise</span><div className="stat-line"></div></div>
            <div className="stat-item" data-aos="fade-up" data-aos-delay="100"><span className="stat-number">500+</span><span className="stat-label">Biens d'Exception</span><div className="stat-line"></div></div>
            <div className="stat-item" data-aos="fade-up" data-aos-delay="200"><span className="stat-number">98%</span><span className="stat-label">Clients Satisfaits</span><div className="stat-line"></div></div>
            <div className="stat-item" data-aos="fade-up" data-aos-delay="300"><span className="stat-number">24h/7</span><span className="stat-label">Accompagnement Dédié</span><div className="stat-line"></div></div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="unified-section testimonials-luxe">
        <div className="container">
          <div className="section-header-large" data-aos="fade-up">
            <p className="cursive-accent">Témoignages</p>
            <h2 className="massive-title">ILS NOUS FONT <span className="gold-text">CONFIANCE</span></h2>
          </div>
          <div className="testimonial-grid">
            <div className="testimonial-card" data-aos="fade-right">
              <div className="quote-icon">“</div>
              <p className="testimonial-text">"Professionnalisme et discrétion inégalables."</p>
              <div className="author-info"><h4>M. Benali</h4><span>Investisseur Privé</span></div>
            </div>
            <div className="testimonial-card gold-border" data-aos="fade-up">
              <div className="quote-icon">“</div>
              <p className="testimonial-text">"Un partenaire de confiance pour trouver nos bureaux."</p>
              <div className="author-info"><h4>Mme. Saidi</h4><span>CEO Tech Algeria</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="unified-section cta-final-luxe">
        <div className="container">
          <div className="cta-wrapper-aymen" data-aos="zoom-in">
            <div className="cta-content-luxe">
              <p className="cursive-accent">Accès Privilégié</p>
              <h2 className="massive-title">REJOIGNEZ LE CERCLE <span className="gold-text">IMMO LAMIS</span></h2>
              <form className="newsletter-form-luxe" onSubmit={(e) => e.preventDefault()}>
                <div className="input-group-luxe">
                  <input type="email" placeholder="Votre adresse email" required />
                  <button type="submit" className="btn-gold-submit">S'INSCRIRE</button>
                </div>
              </form>
            </div>
            <div className="cta-image-side">
              <div className="overlay-gold-frame"></div>
              <img src="/villa.png" alt="Propriété" className="cta-img-bg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}