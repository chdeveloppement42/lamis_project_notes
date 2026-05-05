import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './PublicLayout.css';

export default function PublicLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ferme le menu mobile lors du changement de page
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/services', label: 'Annonces' },
    { to: '/about', label: 'À propos' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="public-layout">
      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header__inner">
          <Link to="/" className="header__logo">
            <div className="header__logo-icon">IL</div>
            <span className="header__logo-text">
              Immo<span className="header__logo-accent">Lamis</span>
            </span>
          </Link>

          {/* Menu de Navigation */}
          <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`header__nav-link ${location.pathname === link.to ? 'header__nav-link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Actions dans le menu mobile uniquement */}
            <div className="header__mobile-actions">
               {!user && (
                 <Link to="/login" className="header__nav-link">Connexion</Link>
               )}
            </div>
          </nav>

          {/* Boutons Desktop */}
          <div className="header__actions">
            {user ? (
              <Link 
                to={user.userType === 'ADMIN' ? '/admin/dashboard' : '/provider/listings'} 
                className="btn-primary"
              >
                Mon Espace
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">Se connecter</Link>
                <Link to="/register" className="btn-primary">Devenir fournisseur</Link>
              </>
            )}
          </div>

          {/* Burger Button */}
          <button
            className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ───────────────────────────────────────── */}
      <main className="public-main">
        <Outlet />
      </main>

      {/* ─── FOOTER (Style Sombre & Or) ─────────────────────────── */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="header__logo">
              <div className="header__logo-icon">IL</div>
              <span className="header__logo-text">
                Immo<span className="header__logo-accent">Lamis</span>
              </span>
            </div>
            <p className="footer__description">
              Plateforme immobilière de luxe à Alger. Tous les biens sont vérifiés et validés par notre équipe d'experts.
            </p>
          </div>

          <div className="footer__links">
            <h4>Navigation</h4>
            <Link to="/">Accueil</Link>
            <Link to="/services">Annonces</Link>
            <Link to="/about">À propos</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer__links">
            <h4>Espace Pro</h4>
            <Link to="/register">Devenir fournisseur</Link>
            <Link to="/login">Se connecter</Link>
          </div>

          <div className="footer__links">
            <h4>Contact</h4>
            <span>📧 contact@immolamis.com</span>
            <span>📞 +213 555 123 456</span>
            <span>📍 Alger, Algérie</span>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p>© {new Date().getFullYear()} Immo Lamis. Tous droits réservés.</p>
            <p className="footer__credit">
              Propulsé par le groupe <span className="footer__credit-group">CH-PUB</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}