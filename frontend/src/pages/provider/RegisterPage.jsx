import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '', address: '',
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      const target = user.userType === 'ADMIN' ? '/admin/dashboard' : '/provider/listings';
      navigate(target, { replace: true });
    }
  }, [user, navigate]);

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux (max 5Mo)');
      e.target.value = '';
      return;
    }
    setDocumentFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentFile) {
      setError('Veuillez sélectionner un document justificatif.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('document', documentFile);
      const res = await register(data);
      setSuccessMsg(res.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        {/* Côté Gauche - Visuel Bleu */}
        <div className="auth-card__left">
          <div className="auth-visual__content">
            <Link to="/" className="auth-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h1>Immo<span style={{ color: '#D9B48F' }}>Lamis</span></h1>
            </Link>
            <div style={{ marginTop: '2rem' }}>
              <h1>Devenez Partenaire</h1>
              <p>Rejoignez le premier réseau immobilier à Alger et commencez à publier vos annonces dès aujourd'hui.</p>
            </div>
          </div>
          <div className="auth-visual__footer">
            Propulsé par CH-PUB
          </div>
        </div>

        {/* Côté Droit - Formulaire Blanc */}
        <div className="auth-card__right">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__header">
              <h2>Inscription</h2>
              <p>Créez votre espace fournisseur</p>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {successMsg && <div className="auth-success" style={{ color: '#2f855a', background: '#f0fff4', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{successMsg}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Prénom</label>
                <input type="text" required placeholder="Ahmed" value={formData.firstName} onChange={update('firstName')} />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" required placeholder="Benali" value={formData.lastName} onChange={update('lastName')} />
              </div>
            </div>

            <div className="form-group">
              <label>Email professionnel</label>
              <input type="email" required placeholder="contact@agence.com" value={formData.email} onChange={update('email')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Téléphone</label>
                <input type="tel" required placeholder="0555..." value={formData.phone} onChange={update('phone')} />
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" required placeholder="••••••••" value={formData.password} onChange={update('password')} />
              </div>
            </div>

            <div className="form-group">
              <label>Adresse du bureau / agence</label>
              <input type="text" required placeholder="Alger, Algérie" value={formData.address} onChange={update('address')} />
            </div>

            <div className="form-group">
              <label>Justificatif d'activité (PDF/Image)</label>
              <input type="file" required accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} style={{ padding: '0.5rem' }} />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Traitement..." : 'Créer mon compte partenaire'}
            </button>

            <div className="auth-form__footer" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: '#5a7184' }}>Déjà partenaire ? <Link to="/login" style={{ color: '#D9B48F', fontWeight: '700', textDecoration: 'none' }}>Se connecter</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}