import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPublishedListings } from '../../api/listings.api';
import { getCategories } from '../../api/categories.api';
import ListingCard from '../../components/ListingCard';
import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
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
  const limit = 12;

  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // État pour mobile

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    getCategories()
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
        else if (Array.isArray(data?.data)) setCategories(data.data);
        else setCategories([]);
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
          setTotalPages(data.meta?.totalPages || 1);
        } else {
          setListings([]);
          setTotalCount(0);
        }
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
    setPage(1);
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.set(key, filters[key]);
    });
    setSearchParams(params);
    setPage(1);
    setIsFilterOpen(false); // Ferme le tiroir sur mobile
  };

  const handleClearFilters = () => {
    setFilters({ categoryId: '', city: '', minPrice: '', maxPrice: '' });
    setSearchParams({});
    setPage(1);
  };

  const scrollSlider = (direction) => {
    const el = document.getElementById('services-slider');
    const scrollAmount = 320;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="aymen-services-wrapper">
      <section className="hero-services">
        <div className="hero-overlay" style={{ backgroundImage: `url('/appartement.png')` }} />
        <div className="container hero-content-services" data-aos="zoom-out">
          <p className="cursive-accent">Explorez</p>
          <h1 className="massive-title">NOS ANNONCES</h1>
        </div>
      </section>

      {/* Bouton de filtrage mobile flottant */}
      <button className="mobile-filter-trigger" onClick={() => setIsFilterOpen(true)}>
        <Filter size={20} /> FILTRER
      </button>

      <div className="container services-layout">
        {/* SIDEBAR / MOBILE MODAL */}
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

            <button type="submit" className="btn-aymen-gold w-100 mt-3">VOIR LES RÉSULTATS</button>

            {(filters.categoryId || filters.city || filters.minPrice || filters.maxPrice) && (
              <button type="button" className="btn-reset-luxe" onClick={handleClearFilters}>RÉINITIALISER</button>
            )}
          </form>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="results-main">
          <div className="results-info">
            <p>{totalCount} PROPRIÉTÉ{totalCount > 1 ? 'S' : ''} TROUVÉE{totalCount > 1 ? 'S' : ''}</p>
          </div>

          {loading ? (
            <div className="loader-aymen">UN INSTANT...</div>
          ) : (
            <div className="mobile-slider-container">
              <button className="slider-nav-btn prev" onClick={() => scrollSlider('left')}><ChevronLeft /></button>
              
              <div className="listings-grid-aymen mobile-slider" id="services-slider">
                {listings.map((listing) => (
                  <div className="mobile-slide-item" key={listing.id}>
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>

              <button className="slider-nav-btn next" onClick={() => scrollSlider('right')}><ChevronRight /></button>
            </div>
          )}

          {totalPages > 1 && !loading && (
            <div className="pagination-aymen">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={i + 1 === page ? 'active' : ''} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}