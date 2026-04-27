import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const target = user.userType === 'ADMIN' ? '/admin/dashboard' : '/provider/listings';
      navigate(target, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      // login method automatically handles routing and state updates!
    } catch (err) {
      if (err.response?.status === 401) {
        setError(err.response.data.message || 'Identifiants invalides');
      } else {
        setError('Une erreur est survenue lors de la connexion.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <div className="auth-page__brand">
          <Link to="/" className="auth-page__logo">
            <span className="auth-page__logo-icon">🏠</span>
            Immo<span style={{ color: 'var(--color-primary-light)' }}>Lamis</span>
          </Link>
          <h1>Bon retour !</h1>
          <p>Connectez-vous pour accéder à votre espace</p>
        </div>
      </div>

      <div className="auth-page__right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Connexion</h2>
          <p className="auth-form__subtitle">Entrez vos identifiants pour continuer</p>

          {error && <div style={{ color: 'var(--color-danger)', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email" className="form-input" required
              placeholder="votre@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password" className="form-input" required
              placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <p className="auth-form__footer">
            Pas encore de compte ? <Link to="/register">Créer un compte fournisseur</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
