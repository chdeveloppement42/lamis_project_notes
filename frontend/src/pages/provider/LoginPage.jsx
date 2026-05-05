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
    } catch (err) {
      setError(err.response?.status === 401 ? 'Identifiants invalides' : 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Côté Gauche - Visuel Bleu */}
        <div className="auth-card__left">
          <div className="auth-visual__content">
            <Link to="/" className="auth-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1>Immo<span style={{ color: '#D9B48F' }}>Lamis</span></h1>
            </Link>
            <div style={{ marginTop: '2rem' }}>
              <h1>Ravis de vous revoir !</h1>
              <p>Gérez vos annonces et développez votre activité sur la plateforme immobilière de référence.</p>
            </div>
          </div>
          <div className="auth-visual__footer">
            © {new Date().getFullYear()} Immo Lamis — CH-PUB
          </div>
        </div>

        {/* Côté Droit - Formulaire Blanc */}
        <div className="auth-card__right">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__header">
              <h2>Connexion</h2>
              <p>Entrez vos accès pour accéder au tableau de bord</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-form__groups">
              <div className="form-group">
                <label>Email professionnel</label>
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Chargement..." : 'Se connecter au compte'}
            </button>

            <div className="auth-form__footer" style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#5a7184' }}>Pas encore de compte ?</p>
              <Link to="/register" style={{ color: '#D9B48F', fontWeight: '700', textDecoration: 'none' }}>
                Devenir fournisseur partenaire
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}