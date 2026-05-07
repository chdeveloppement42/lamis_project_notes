import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // Ajout de Link pour le bouton conciergerie
import { getPublishedListings } from '../../api/listings.api';
import { getCategories } from '../../api/categories.api';
import ListingCard from '../../components/ListingCard';
import { ChevronLeft, ChevronRight, Filter, X, Loader2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './ServicesPage.css';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    categoryId: searchParams.get('categoryId') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const [page, setPage] = useState(1);
  const limit = 9; 

  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    getCategories()
      .then((data) => {
        const cats = Array.isArray(data) ? data : (data?.data || []);
        setCategories(cats);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let didCancel = false;
    const params = { ...filters, page, limit };

    setLoading(true);
    getPublishedListings(params)
      .then((data) => {
        if (didCancel) return;
        if (data && data.data) {
          setListings(data.data);
          setTotalCount(data.meta?.total || data.data.length);
          setTotalPages(data.meta?.totalPages || Math.ceil((data.meta?.total || data.data.length) / limit));
        } else {
          setListings([]);
          setTotalCount(0);
        }
        // Scroll fluide vers le haut à chaque changement de page ou filtre
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => {
        setListings([]);
        setTotalCount(0);
      })
      .finally(() => setLoading(false));

    return () => { didCancel = true; };
  }, [filters, page]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.set(key, filters[key]);
    });
    setSearchParams(params);
    setPage(1);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ categoryId: '', city: '', minPrice: '', maxPrice: '' });
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="aymen-services-wrapper">
      {/* HERO SECTION - Assure-toi que /service.png existe dans public */}
      <section className="hero-services">
        <div className="hero-overlay" style={{ backgroundImage: `url('/service.png')` }} />
        <div className="container hero-content-services" data-aos="zoom-out">
          <p className="cursive-accent">Immo Lamis</p>
          <h1 className="massive-title">NOS ANNONCES</h1>
        </div>
      </section>

      <button className="mobile-filter-trigger" onClick={() => setIsFilterOpen(true)}>
        <Filter size={20} /> FILTRER LES BIENS
      </button>

      <div className="container services-layout">
        <aside className={`filters-sidebar ${isFilterOpen ? 'open' : ''}`}>
          <div className="sidebar-header-mobile">
            <h3>FILTRES</h3>
            <button onClick={() => setIsFilterOpen(false)}><X /></button>
          </div>

          <form onSubmit={handleApplyFilters} className="filters-form-luxe">
            <h3 className="filter-title-luxe d-none-mobile">RECHERCHE AVANCÉE</h3>
            <div className="filter-group-luxe">
              <label>CATÉGORIE</label>
              <select value={filters.categoryId} onChange={(e) => handleFilterChange('categoryId', e.target.value)}>
                <option value="">Tous les biens</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group-luxe">
              <label>VILLE</label>
              <input type="text" placeholder="Alger, Oran..." value={filters.city} onChange={(e) => handleFilterChange('city', e.target.value)} />
            </div>
            <div className="filter-group-luxe">
              <label>PRIX MINIMUM (DA)</label>
              <input type="number" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} />
            </div>
            <div className="filter-group-luxe">
              <label>PRIX MAXIMUM (DA)</label>
              <input type="number" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
            </div>
            <button type="submit" className="btn-aymen-gold w-100 mt-3">APPLIQUER</button>
            {(filters.categoryId || filters.city || filters.minPrice || filters.maxPrice) && (
              <button type="button" className="btn-reset-luxe" onClick={handleClearFilters}>EFFACER TOUT</button>
            )}
          </form>
        </aside>

        <main className="results-main">
          <div className="results-info">
            <p>
              <span style={{ opacity: 0.5 }}>Résultats : </span> 
              <strong>{totalCount}</strong> 
              <span style={{ opacity: 0.5 }}> Biens disponibles</span>
            </p>
          </div>

          {loading ? (
            <div className="loader-aymen-container">
              <Loader2 className="spinner-gold" size={40} />
              <p>Recherche en cours...</p>
            </div>
          ) : (
            <>
              <div className="listings-grid-aymen grid-3x3">
                {listings.length > 0 ? (
                  listings.map((listing) => (
                    <div className="listing-card-wrapper" key={listing.id} data-aos="fade-up">
                      <ListingCard listing={listing} />
                    </div>
                  ))
                ) : (
                  <div className="no-results">Aucun bien ne correspond à vos critères.</div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="pagination-luxe-container" data-aos="fade-up">
                  <div className="pagination-aymen">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)} className="pag-nav-btn">
                      <ChevronLeft size={20} />
                    </button>
                    <div className="pag-numbers">
                      {[...Array(totalPages)].map((_, i) => (
                        <button key={i + 1} className={i + 1 === page ? 'active' : ''} onClick={() => setPage(i + 1)}>
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="pag-nav-btn">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ─── SECTION ACCOMPAGNEMENT ─── */}
      <section className="conciergerie-section" data-aos="fade-up">
        <div className="container">
          <div className="conciergerie-box">
            <div className="conciergerie-content">
              <p className="cursive-accent">Service Chasseur de Biens</p>
              <h2 className="massive-title-small">VOUS NE TROUVEZ PAS VOTRE <span className="gold-text">IDÉAL ?</span></h2>
              <p className="white-p">
                Notre catalogue public n'est que la partie visible. Nous disposons de nombreuses propriétés en 
                <strong> "Off-Market"</strong>. Confiez-nous vos critères, et notre équipe activera son réseau 
                exclusif pour vous trouver la perle rare.
              </p>
              <div className="conciergerie-features">
                <div className="feat-item"><span className="feat-dot"></span><p>Recherche personnalisée</p></div>
                <div className="feat-item"><span className="feat-dot"></span><p>Négociation de haut niveau</p></div>
                <div className="feat-item"><span className="feat-dot"></span><p>Expertise juridique incluse</p></div>
              </div>
              <Link to="/contact" className="btn-aymen-gold-outline mt-4">
                CONTACTER UN CONSEILLER
              </Link>
            </div>
            <div className="conciergerie-visual">
              <div className="gold-border-frame"></div>
              <img src="/appartement.png" alt="Intérieur de luxe" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}