import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import './ProviderLayout.css';

export default function ProviderLayout() {
  const location = useLocation();
  const { user, logout, setUser } = useAuth();

  useEffect(() => {
    if (user?.userType === 'PROVIDER') {
      axiosInstance.get('/providers/profile')
        .then((res) => {
          if (res.data.status && res.data.status !== user.status) {
            const updatedUser = { ...user, status: res.data.status };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        })
        .catch(() => {});
    }
  }, [location.pathname, user, setUser]);

  const status = user?.status || 'PENDING';
  const statusLabel =
    status === 'VALIDATED' ? 'Vérifié' :
    status === 'PENDING' ? 'En attente' :
    'Restreint';

  const navLinks = [
    { to: '/provider/listings', label: 'Mes annonces', icon: '📋' },
    { to: '/provider/post', label: 'Publier', icon: '📝', disabled: false },
    { to: '/provider/profile', label: 'Mon profil', icon: '👤' },
  ];

  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'F';

  return (
    <div className="provider-layout">
      <div className="provider-layout__topbar">
        <div className="provider-layout__hero">
          <div>
            <span className="eyebrow">Espace fournisseur</span>
            <h1 className="section-title">Bienvenue, {user?.firstName || 'partenaire'}</h1>
            <p className="section-copy">Gérez vos annonces et suivez votre validation en un seul endroit.</p>
          </div>
          <div className="provider-status-card">
            <span className="badge badge--accent">{statusLabel}</span>
            <p>Statut du compte</p>
          </div>
        </div>
      </div>

      <aside className="provider-sidebar">
        <div className="provider-brand">
          <img src="/branding/logo-horizontal.svg" alt="Immo Lamis" className="provider-brand__logo" />
        </div>

        <nav className="provider-sidebar__nav">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.disabled ? '#' : item.to}
              className={`provider-sidebar__link ${location.pathname === item.to ? 'provider-sidebar__link--active' : ''} ${item.disabled ? 'provider-sidebar__link--disabled' : ''}`}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="provider-sidebar__meta">
          <div className="provider-sidebar__avatar">{initials}</div>
          <div>
            <p className="provider-sidebar__name">{user?.firstName} {user?.lastName}</p>
            <p className="provider-sidebar__email">{user?.email}</p>
          </div>
        </div>

        <button className="btn btn-outline provider-logout-btn" onClick={logout}>Déconnexion</button>
      </aside>

      <main className="provider-main">
        <Outlet />
      </main>

      <nav className="provider-mobile-nav" aria-label="Provider navigation">
        {navLinks.map((item) => (
          <Link
            key={item.to}
            to={item.disabled ? '#' : item.to}
            className={`provider-mobile-nav__link ${location.pathname === item.to ? 'provider-mobile-nav__link--active' : ''} ${item.disabled ? 'provider-mobile-nav__link--disabled' : ''}`}
            onClick={(e) => item.disabled && e.preventDefault()}
          >
            <span className="provider-mobile-nav__icon" aria-hidden="true">{item.icon}</span>
            <span className="provider-mobile-nav__label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
