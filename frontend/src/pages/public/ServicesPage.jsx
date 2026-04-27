import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPublishedListings } from '../../api/listings.api';
import { getCategories } from '../../api/categories.api';
import ListingCard from '../../components/ListingCard';
import './ServicesPage.css';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state — initialized from URL params (from hero search)
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
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Fetch listings whenever filters or page change
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.city) params.city = filters.city;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    params.page = page;
    params.limit = limit;

    getPublishedListings(params)
      .then((data) => {
        // Handle both paginated response { data, meta } and plain array
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
        setListings([]);
        setTotalCount(0);
      })
      .finally(() => setLoading(false));
  }, [filters, page]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1); // Reset to page 1 on filter change
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    // Sync URL params for shareability
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

  return (
    <div className="services-page">
      <div className="services-page__hero">
        <div className="container">
          <h1>Nos Annonces</h1>
          <p>Parcourez tous les biens vérifiés et validés par notre équipe</p>
        </div>
      </div>

      <div className="container services-page__content">
        {/* ─── Sidebar Filters ─────────────────────────── */}
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

        {/* ─── Listings Grid ──────────────────────────── */}
        <div className="services-grid">
          <div className="services-grid__header">
            <p className="services-grid__count">
              <strong>{totalCount}</strong> annonce{totalCount !== 1 ? 's' : ''} trouvée{totalCount !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="services-grid__loading">
              <div className="spinner" />
              <p>Chargement des annonces...</p>
            </div>
          ) : listings.length > 0 ? (
            <>
              <div className="services-grid__cards">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination__btn"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ← Précédent
                  </button>
                  <div className="pagination__pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`pagination__page ${p === page ? 'pagination__page--active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    className="pagination__btn"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="services-grid__empty">
              <div className="services-grid__empty-icon">🏠</div>
              <h3>Aucune annonce trouvée</h3>
              <p>Essayez de modifier vos filtres ou revenez plus tard.</p>
              <button className="btn btn-secondary" onClick={handleClearFilters}>
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
