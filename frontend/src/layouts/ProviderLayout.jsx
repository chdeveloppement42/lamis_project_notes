import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProviderLayout.css';

export default function ProviderLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const status = user?.status || 'PENDING';
  const isBlocked = status !== 'VALIDATED';

  const navLinks = [
    { 
      to: '/provider/listings', 
      label: 'Annonces', 
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9h18M3 15h18M3 21h18M3 3h18"/></svg> 
    },
    { 
      to: '/provider/post', 
      label: 'Publier', 
      icon: isBlocked ? 
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> : 
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y2="12" x2="19" y2="12"/></svg>,
      disabled: isBlocked 
    },
    { 
      to: '/provider/profile', 
      label: 'Profil', 
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> 
    },
  ];

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'P';

  return (
    <div className="provider-layout">
      {/* Bannières de Statut */}
      <div className="provider-layout__banners">
        {status === 'PENDING' && (
          <div className="provider-banner provider-banner--warning">
            <div className="container banner-inner">
              <span className="banner-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </span>
              <p><strong>Compte en attente.</strong> La publication sera activée après validation.</p>
            </div>
          </div>
        )}
      </div>

      {/* Header Desktop */}
      <header className="provider-header">
        <div className="provider-header__inner">
          <Link to="/" className="provider-logo">
            <div className="provider-logo__icon">IL</div>
            <span className="provider-logo__text">Immo<span className="accent">Lamis</span></span>
          </Link>

          <nav className="provider-desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.disabled ? '#' : link.to}
                className={`nav-item ${location.pathname === link.to ? 'active' : ''} ${link.disabled ? 'disabled' : ''}`}
                onClick={(e) => link.disabled && e.preventDefault()}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="provider-header__actions">
            <div className="user-profile">
              <div className="avatar">{initials}</div>
              <div className="user-details">
                <span className="user-name">{user?.firstName || 'Prestataire'}</span>
                <span className={`status-badge status--${status.toLowerCase()}`}>{status}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout} title="Déconnexion">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="provider-main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* Navigation Mobile (Bottom Bar) */}
      <nav className="provider-mobile-nav">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.disabled ? '#' : link.to}
            className={`mobile-nav-item ${location.pathname === link.to ? 'active' : ''} ${link.disabled ? 'disabled' : ''}`}
            onClick={(e) => link.disabled && e.preventDefault()}
          >
            <span className="mobile-icon">{link.icon}</span>
            <span className="mobile-label">{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}