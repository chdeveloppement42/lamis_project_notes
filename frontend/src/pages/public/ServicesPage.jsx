import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPublishedListings } from '../../api/listings.api';
import { getCategories } from '../../api/categories.api';
import ListingCard from '../../components/ListingCard';
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

  useEffect(() => {
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

    const params = {};
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.city) params.city = filters.city;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    params.page = page;
    params.limit = limit;

    // Avoid calling setState synchronously in the effect body (eslint rule).
    Promise.resolve().then(() => {
      if (!didCancel) setLoading(true);
    });

    getPublishedListings(params)
      .then((data) => {
        if (didCancel) return;

        if (data && data.data) {
          setListings(data.data);
          setTotalCount(data.meta?.total || data.data.length);
          setTotalPages(data.meta?.totalPages || 1);
        } else if (Array.isArray(data)) {
          setListings(data);
          setTotalCount(data.length);
          setTotalPages(1);
        } else {
          setListings([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      })
      .catch(() => {
        if (didCancel) return;

        setListings([]);
        setTotalCount(0);
        setTotalPages(1);
      })
      .finally(() => {
        if (!didCancel) setLoading(false);
      });

    return () => {
      didCancel = true;
    };
  }, [filters, page]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.categoryId) params.set('categoryId', filters.categoryId);
    if (filters.city) params.set('city', filters.city);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    setSearchParams(params);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ categoryId: '', city: '', minPrice: '', maxPrice: '' });
    setSearchParams({});
    setPage(1);
  };
const heroImages = ['/appartement.png'];
  return (
    <div className="services-page">
      <div className="services-page__hero" style={{position:'relative',overflow:'hidden'}}>
        <img src={heroImages[0]}  alt="Background" className="hero-img-display" />
        <div className="container" >
          <h1>Nos Annonces</h1>
          <p>Parcourez tous les biens vérifiés et validés par notre équipe 
            pour concrétiser vos projets en toute sérénité.</p>
        </div>
      </div>

      <div className="container services-page__content">
        <aside className="services-filters">
          <form onSubmit={handleApplyFilters}>
            <h3 className="services-filters__title">Filtres</h3>

            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <select
                className="form-input"
                value={filters.categoryId}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ville</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Alger"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Prix minimum</label>
              <input
                type="number"
                className="form-input"
                placeholder="0 DA"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Prix maximum</label>
              <input
                type="number"
                className="form-input"
                placeholder="100 000 000 DA"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Appliquer les filtres
            </button>

            {(filters.categoryId || filters.city || filters.minPrice || filters.maxPrice) && (
              <button
                type="button"
                className="btn btn-sm services-filters__clear"
                onClick={handleClearFilters}
              >
                ✕ Réinitialiser
              </button>
            )}
          </form>
        </aside>

        <main className="services-main">
          <div className="services-results">
            <p className="results-count">{totalCount} annonce{totalCount !== 1 ? 's' : ''} trouvée{totalCount !== 1 ? 's' : ''}</p>
          </div>

          {loading ? (
            <div className="loading">Chargement des annonces...</div>
          ) : listings.length === 0 ? (
            <div className="loading">Aucune annonce trouvée.</div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={i + 1 === page ? 'active' : ''}
                  onClick={() => setPage(i + 1)}
                >
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
