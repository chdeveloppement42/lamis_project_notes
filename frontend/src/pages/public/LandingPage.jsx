import { useState, useEffect } from 'react';
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

  const slides = [{ url: '/appartement.png' }, { url: '/villa.png' }, { url: '/entrop.png' }, { url: '/terrain.png' }];

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

  // LOGIQUE DE PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = latestListings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(latestListings.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll fluide vers le début de la section annonces lors du changement de page
    document.getElementById('annonces-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="aymen-style-wrapper">
      
      {/* HERO SECTION - inchangée */}
      <section className="hero-full">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div key={index} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(10, 25, 35, 0.2), rgba(10, 25, 35, 0.5)), url(${slide.url})` }}
            />
          ))}
        </div>
        <div className="hero-content-centered" data-aos="zoom-in">
          <h1 className="hero-main-title">IMMO<span className="gold-text">LAMIS</span></h1>
          <p className="hero-desc-centered">L'excellence immobilière à Alger et au-delà.</p>
        </div>
      </section>
{/* ─── POURQUOI NOUS CHOISIR (VERSION PRESTIGE) ─── */}
      <section className="unified-section">
        <div className="container">
          <div className="section-header-large" data-aos="fade-up">
            <p className="cursive-accent">L'Engagement</p>
            <h2 className="massive-title">L'EXCELLENCE IMMO LAMIS</h2>
          </div>

          <div className="why-grid-aymen">
            {/* CARTE 1 : SÉCURITÉ */}
            <div className="why-card-aymen" data-aos="fade-up">
              <div className="why-icon-luxe"><ShieldCheck size={35} /></div>
              <div className="why-text-luxe">
                <h3>SÉRÉNITÉ TOTALE</h3>
                <p className="white-p">
                  Bien plus qu'une vérification, nous sécurisons votre patrimoine. 
                  Chaque transaction bénéficie d'un audit juridique rigoureux pour un investissement sans compromis.
                </p>
              </div>
            </div>

            {/* CARTE 2 : EMPLACEMENT */}
            <div className="why-card-aymen" data-aos="fade-up" data-aos-delay="100">
              <div className="why-icon-luxe"><MapPin size={35} /></div>
              <div className="why-text-luxe">
                <h3>ADRESSES D'EXCEPTION</h3>
                <p className="white-p">
                  Nous sélectionnons l'invisible : des emplacements stratégiques et prestigieux à Alger, 
                  offrant à la fois un cadre de vie unique et une forte valorisation immobilière.
                </p>
              </div>
            </div>

            {/* CARTE 3 : SUPPORT */}
            <div className="why-card-aymen" data-aos="fade-up" data-aos-delay="200">
              <div className="why-icon-luxe"><Headphones size={35} /></div>
              <div className="why-text-luxe">
                <h3>SERVICE CONCIERGERIE</h3>
                <p className="white-p">
                  Votre temps est précieux. Notre équipe dédiée vous accompagne personnellement 7j/7, 
                  du premier contact jusqu'à la remise des clés, et bien au-delà.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      {/* NOS CATÉGORIES - inchangée */}
      <section className="unified-section pt-0">
        <div className="container">
          <div className="section-header-large" data-aos="fade-up">
            <p className="cursive-accent">Explorez</p>
            <h2 className="massive-title">NOS CATÉGORIES</h2>
          </div>
          <div className="categories-grid-aymen">
            {categories.map((cat, index) => (
              <Link key={cat.id} to={`/services?categoryId=${cat.id}`} className="cat-card-aymen" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="cat-icon-aymen">{CATEGORY_ICONS[cat.slug] || <Home size={40}/>}</div>
                <h3>{cat.name.toUpperCase()}</h3>
                <p className="white-p">Découvrir</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
 <section className="unified-section pt-0" id="annonces-section">
  <div className="container">
    {/* En-tête : On remplace "Nos Annonces" par une promesse de valeur */}
    <div className="section-header-large" data-aos="fade-up">
      <p className="cursive-accent">Sélection Exclusive</p>
      <h2 className="massive-title">NOS DERNIÈRES <span className="gold-text">PÉPITES</span></h2>
      <p className="section-subtitle-luxe">
        Découvrez des propriétés d'exception rigoureusement sélectionnées pour leur architecture et leur emplacement unique.
      </p>
      <div className="title-underline"></div>
    </div>

    {/* Grille 3x3 avec délai d'apparition (AOS Delay) */}
    <div className="listings-grid-aymen grid-home-3x3">
      {currentItems.map((listing, index) => (
        <div 
          className="listing-anim-wrapper" 
          key={listing.id}
          data-aos="fade-up"
          data-aos-delay={index * 100} // Les cartes apparaissent l'une après l'autre
        >
          {/* Badge de statut pour créer l'urgence/prestige */}
          <div className="premium-tag">
            {index === 0 ? "Coup de Coeur" : "Nouveau"}
          </div>
          
          <ListingCard listing={listing} />
        </div>
      ))}
    </div>

    {/* Pagination : Design minimaliste type "01 / 02" */}
    {totalPages > 1 && (
      <div className="pagination-luxe-wrapper" data-aos="fade-in">
        <div className="pagination-aymen">
          <button 
            disabled={currentPage === 1} 
            onClick={() => paginate(currentPage - 1)}
            className="pag-nav-btn"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="pag-numbers">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i + 1} 
                onClick={() => paginate(i + 1)}
                className={`num-btn ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages} 
            onClick={() => paginate(currentPage + 1)}
            className="pag-nav-btn"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )}

    {/* CTA : Bouton avec sous-titre pour rassurer sur le volume du catalogue */}
    <div className="btn-container-center" data-aos="zoom-in">
      <Link to="/services" className="btn-aymen-gold-glow">
        <span className="main-text">EXPLORER LE CATALOGUE COMPLET</span>
        <span className="sub-text">Découvrez nos opportunités exclusives à Alger</span>
      </Link>
    </div>
  </div>
</section>

     
    </div>
  );
}