import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import './AdminLayout.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // ─── NOTIFICATION POLLING (10s) ───────────────────────────────
  const fetchUnread = useCallback(async () => {
    if (!user || user.userType !== 'ADMIN') return;
    try {
      const res = await axiosInstance.get('/notifications/unread-count');
      setUnreadCount(res.data);
    } catch {
      // Silently fail
    }
  }, [user]);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  const navItems = [
    { to: '/admin/dashboard', label: 'Tableau de bord', icon: '📊', permission: null },
    { to: '/admin/providers', label: 'Fournisseurs', icon: '👥', permission: 'manage:providers' },
    { to: '/admin/listings', label: 'Annonces', icon: '🏠', permission: 'manage:listings' },
    { to: '/admin/categories', label: 'Catégories', icon: '📂', permission: 'manage:categories' },
    { to: '/admin/users', label: 'Utilisateurs', icon: '🔑', permission: 'manage:admins' },
    { to: '/admin/notifications', label: 'Notifications', icon: '🔔', permission: 'view:notifications' },
    { to: '/admin/permissions', label: 'Permissions', icon: '🛡️', permission: 'manage:permissions' },
  ];

  // Filter nav items by permission
  const visibleNavItems = navItems.filter(
    item => !item.permission || hasPermission(item.permission)
  );

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'AD';

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'admin-layout--collapsed' : ''} ${mobileSidebarOpen ? 'admin-layout--mobile-open' : ''}`}>
      {/* ─── SIDEBAR ─────────────────────────────────────────── */}
      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'admin-sidebar--mobile-open' : ''}`}>
        <div className="admin-sidebar__header">
          <Link to="/admin/dashboard" className="admin-sidebar__logo">
            <div className="admin-sidebar__logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <span className="admin-sidebar__logo-text">
                Immo<span>Lamis</span>
              </span>
            )}
          </Link>
          <button
            className="admin-sidebar__toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {visibleNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-sidebar__link ${location.pathname === item.to ? 'admin-sidebar__link--active' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <span className="admin-sidebar__link-icon">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="admin-sidebar__link-label">
                  {item.label}
                  {item.to === '/admin/notifications' && unreadCount > 0 && (
                    <span className="admin-sidebar__badge">{unreadCount}</span>
                  )}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/admin/profile" className={`admin-sidebar__link ${location.pathname === '/admin/profile' ? 'admin-sidebar__link--active' : ''}`} title="Mon profil">
            <span className="admin-sidebar__link-icon">⚙️</span>
            {!sidebarCollapsed && <span className="admin-sidebar__link-label">Mon Profil</span>}
          </Link>
          <Link to="/" className="admin-sidebar__link" title="Retour au site">
            <span className="admin-sidebar__link-icon">🌐</span>
            {!sidebarCollapsed && <span className="admin-sidebar__link-label">Voir le site</span>}
          </Link>
          <button className="admin-sidebar__link admin-sidebar__link--danger" title="Déconnexion" onClick={handleLogout}>
            <span className="admin-sidebar__link-icon">🚪</span>
            {!sidebarCollapsed && <span className="admin-sidebar__link-label">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* ─── MAIN CONTENT ────────────────────────────────────── */}
      <div className={`admin-content ${mobileSidebarOpen ? 'admin-content--shifted' : ''}`}>
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button className="admin-topbar__mobile-toggle" onClick={() => setMobileSidebarOpen(true)}>
              ☰
            </button>
            <h2 className="admin-topbar__title">
              {visibleNavItems.find(i => location.pathname.startsWith(i.to))?.label || 'Admin'}
            </h2>
          </div>
          <div className="admin-topbar__right">
            <button className="admin-topbar__notif" onClick={() => navigate('/admin/notifications')}>
              🔔 {unreadCount > 0 && <span className="admin-topbar__notif-badge">{unreadCount}</span>}
            </button>
            <div className="admin-topbar__user">
              <div className="admin-topbar__avatar">{initials}</div>
              <div className="admin-topbar__user-info">
                <span className="admin-topbar__user-name">{user?.firstName} {user?.lastName}</span>
                <span className="admin-topbar__user-role">{user?.isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
