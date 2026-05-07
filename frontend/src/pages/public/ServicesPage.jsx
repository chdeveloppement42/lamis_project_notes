import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPublishedListings } from '../../api/listings.api';
import { getCategories } from '../../api/categories.api';
import ListingCard from '../../components/ListingCard';
import { ChevronLeft, ChevronRight, Filter, X, Loader2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './ServicesPage.css';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // États des filtres
  const [filters, setFilters] = useState({
    categoryId: searchParams.get('categoryId') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  // CONFIGURATION : 3 colonnes x 3 lignes = 9 items
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
          // Calculer le total de pages si l'API ne le renvoie pas déjà par rapport à la limite de 9
          setTotalPages(data.meta?.totalPages || Math.ceil((data.meta?.total || data.data.length) / limit));
        } else {
          setListings([]);
          setTotalCount(0);
        }
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
              {/* Grille forcée à 3 colonnes via CSS */}
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
                    <button 
                      disabled={page === 1} 
                      onClick={() => setPage(page - 1)}
                      className="pag-nav-btn"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="pag-numbers">
                      {[...Array(totalPages)].map((_, i) => (
                        <button 
                          key={i + 1} 
                          className={i + 1 === page ? 'active' : ''} 
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button 
                      disabled={page === totalPages} 
                      onClick={() => setPage(page + 1)}
                      className="pag-nav-btn"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <p className="pag-info-text">Page {page} sur {totalPages}</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}