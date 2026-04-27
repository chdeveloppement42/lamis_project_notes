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

  // Redirect if already logged in
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
      setError('Veuillez sélectionner un document justificatif (PDF, JPG, PNG).');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('document', documentFile);

      const res = await register(data);
      setSuccessMsg(res.message);
      // Optional: redirect to login after a few seconds
      setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
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
          <h1>Rejoignez-nous</h1>
          <p>Créez votre compte fournisseur et publiez vos biens immobiliers</p>
        </div>
      </div>

      <div className="auth-page__right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Inscription Fournisseur</h2>
          <p className="auth-form__subtitle">Remplissez le formulaire pour créer votre compte</p>

          {error && <div style={{ color: 'var(--color-danger)', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
          {successMsg && <div style={{ color: 'var(--color-success)', backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{successMsg}</div>}

          <div className="auth-form__row">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input type="text" className="form-input" required placeholder="Prénom" value={formData.firstName} onChange={update('firstName')} />
            </div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input type="text" className="form-input" required placeholder="Nom" value={formData.lastName} onChange={update('lastName')} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" required placeholder="votre@email.com" value={formData.email} onChange={update('email')} />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input type="password" className="form-input" required placeholder="Min. 6 caractères" value={formData.password} onChange={update('password')} />
          </div>

          <div className="auth-form__row">
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input type="tel" className="form-input" required placeholder="+213 555..." value={formData.phone} onChange={update('phone')} />
            </div>
            <div className="form-group">
              <label className="form-label">Adresse</label>
              <input type="text" className="form-input" required placeholder="Votre adresse" value={formData.address} onChange={update('address')} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Document justificatif (Registre, Carte ID, etc.)</label>
            <input 
              type="file" 
              className="form-input" 
              accept=".pdf,.jpg,.jpeg,.png" 
              required 
              onChange={handleFileChange} 
            />
            <small style={{ color: '#64748b', fontSize: '0.8rem' }}>Format PDF, JPG ou PNG. Max 5Mo.</small>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>

          <p className="auth-form__footer">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
