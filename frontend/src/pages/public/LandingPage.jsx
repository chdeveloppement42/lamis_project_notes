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

  const slides = [
    { url: '/appartement.png' },
    { url: '/villa.png' },
    { url: '/terrain.png' }
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    getCategories().then(setCategories).catch(() => setCategories([]));
    getLatestListings().then(setLatestListings).catch(() => setLatestListings([]));

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Fonction de scroll pour les sliders mobiles
  const scrollContainer = (id, direction) => {
    const el = document.getElementById(id);
    const scrollAmount = 320;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="aymen-style-wrapper">
      
      {/* ─── HERO SECTION ─── */}
      <section className="hero-full">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `linear-gradient(rgba(10, 25, 35, 0.2), rgba(10, 25, 35, 0.5)), url(${slide.url})` }}
            />
          ))}
        </div>
        <div className="hero-content-centered" data-aos="zoom-in">
          <h1 className="hero-main-title">IMMO<span className="gold-text">LAMIS</span></h1>
          <p className="hero-desc-centered">L'excellence immobilière à Alger et au-delà.</p>
        </div>
      </section>

      {/* ─── POURQUOI NOUS CHOISIR ─── */}
      <section className="unified-section">
        <div className="container">
          <div className="section-header-large" data-aos="fade-up">
            <p className="cursive-accent">Pourquoi</p>
            <h2 className="massive-title">NOUS CHOISIR ?</h2>
          </div>

          <div className="why-grid-aymen">
            <div className="why-card-aymen" data-aos="fade-up">
              <div className="why-icon-luxe"><ShieldCheck size={35} /></div>
              <div className="why-text-luxe">
                <h3>SÉCURITÉ</h3>
                <p className="white-p">Accompagnement juridique et vérification rigoureuse.</p>
              </div>
            </div>
            <div className="why-card-aymen" data-aos="fade-up" data-aos-delay="100">
              <div className="why-icon-luxe"><MapPin size={35} /></div>
              <div className="why-text-luxe">
                <h3>EMPLACEMENT</h3>
                <p className="white-p">Zones les plus prestigieuses de la capitale.</p>
              </div>
            </div>
            <div className="why-card-aymen" data-aos="fade-up" data-aos-delay="200">
              <div className="why-icon-luxe"><Headphones size={35} /></div>
              <div className="why-text-luxe">
                <h3>SUPPORT</h3>
                <p className="white-p">Une équipe dédiée à votre écoute 7j/7.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION NOS CATÉGORIES (SLIDER MOBILE) ─── */}
      <section className="unified-section pt-0">
        <div className="container">
          <div className="section-header-large" data-aos="fade-up">
            <p className="cursive-accent">Explorez</p>
            <h2 className="massive-title">NOS CATÉGORIES</h2>
          </div>

          <div className="mobile-slider-wrapper">
            <button className="slider-nav-btn prev" onClick={() => scrollContainer('cat-slider', 'left')}><ChevronLeft /></button>
            <div className="categories-grid-aymen mobile-slider" id="cat-slider">
              {categories.map((cat, index) => (
                <Link key={cat.id} to={`/services?categoryId=${cat.id}`} className="cat-card-aymen">
                  <div className="cat-icon-aymen">
                    {CATEGORY_ICONS[cat.slug] || <Home size={40}/>}
                  </div>
                  <h3>{cat.name.toUpperCase()}</h3>
                  <p className="white-p">Découvrir</p>
                </Link>
              ))}
            </div>
            <button className="slider-nav-btn next" onClick={() => scrollContainer('cat-slider', 'right')}><ChevronRight /></button>
          </div>
        </div>
      </section>

      {/* ─── SECTION NOS ANNONCES (SLIDER MOBILE) ─── */}
      <section className="unified-section pt-0">
        <div className="container">
          <div className="section-header-large" data-aos="fade-up">
            <p className="cursive-accent">D'ImmoLamis</p>
            <h2 className="massive-title">NOS ANNONCES</h2>
          </div>

          <div className="mobile-slider-wrapper">
            <button className="slider-nav-btn prev" onClick={() => scrollContainer('listing-slider', 'left')}><ChevronLeft /></button>
            <div className="listings-grid-aymen mobile-slider" id="listing-slider">
              {latestListings.slice(0, 6).map((listing) => (
                <div className="mobile-slide-item" key={listing.id}>
                   <ListingCard listing={listing} />
                </div>
              ))}
            </div>
            <button className="slider-nav-btn next" onClick={() => scrollContainer('listing-slider', 'right')}><ChevronRight /></button>
          </div>

          <div className="btn-container-center" data-aos="fade-up">
            <Link to="/services" className="btn-aymen-gold">
              VOIR TOUTES LES ANNONCES
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}