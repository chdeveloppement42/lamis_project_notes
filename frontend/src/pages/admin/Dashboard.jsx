import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingProviders: 0,
    publishedListings: 0,
    activeCategories: 0,
    unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/admin/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Dashboard stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Fournisseurs en attente', value: stats.pendingProviders, icon: '👥', color: '#fef3c7' },
    { label: 'Annonces publiées', value: stats.publishedListings, icon: '🏠', color: '#d1fae5' },
    { label: 'Catégories actives', value: stats.activeCategories, icon: '📂', color: '#dbeafe' },
    { label: 'Notifications non lues', value: stats.unreadNotifications, icon: '🔔', color: '#fce7f3' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__welcome">
        <h1>Bienvenue sur votre espace Admin 👋</h1>
        <p>Voici un aperçu de l'activité de votre plateforme</p>
      </div>

      <div className="dashboard__stats">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card" style={{ borderLeftColor: card.color }}>
            <div className="stat-card__icon" style={{ backgroundColor: card.color }}>{card.icon}</div>
            <div className="stat-card__info">
              <span className="stat-card__value">{loading ? '…' : card.value}</span>
              <span className="stat-card__label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard__actions">
        <h3>Actions rapides</h3>
        <div className="dashboard__actions-grid">
          <button className="dashboard__action-btn dashboard__action-btn--primary" onClick={() => navigate('/admin/providers')}>
            Gérer les fournisseurs
          </button>
          <button className="dashboard__action-btn" onClick={() => navigate('/admin/listings')}>
            Modérer les annonces
          </button>
          <button className="dashboard__action-btn" onClick={() => navigate('/admin/categories')}>
            Gérer les catégories
          </button>
        </div>
      </div>
    </div>
  );
}
