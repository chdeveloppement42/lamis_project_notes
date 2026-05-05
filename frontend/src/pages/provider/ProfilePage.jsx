import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import './ProviderPages.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwErr, setPwErr] = useState(null);

  useEffect(() => {
    axiosInstance.get('/providers/profile')
      .then((res) => setProfile(res.data))
      .catch(() => setError('Erreur lors du chargement du profil.'))
      .finally(() => setLoading(false));
  }, []);

  const update = (field) => (e) => setProfile({ ...profile, [field]: e.target.value });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await axiosInstance.patch('/providers/profile', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        address: profile.address,
      });
      setProfile({ ...profile, ...res.data });
      setMessage('Profil mis à jour avec succès !');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    setPwErr(null);

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwErr('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const res = await axiosInstance.patch('/providers/profile/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg(res.data.message);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwErr(err.response?.data?.message || 'Erreur lors du changement.');
    }
  };

  if (loading) return (
    <div className="provider-page">
      <div className="loading-container">
        <p>Chargement de votre profil...</p>
      </div>
    </div>
  );

  return (
    <div className="provider-page animate-fade-in">
      <div className="header-mobile">
        <h1>Mon Profil</h1>
        <p className="provider-page__subtitle">Gérez vos informations personnelles</p>
      </div>

      {message && <div className="provider-alert provider-alert--success">✅ {message}</div>}
      {error && <div className="provider-alert provider-alert--error">❌ {error}</div>}

      <div className="provider-page__grid">
        {/* Section 1: Infos Générales */}
        <form className="provider-card" onSubmit={handleSaveProfile}>
          <h3>Informations personnelles</h3>
          <div className="provider-card__row">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input type="text" className="form-input" value={profile?.firstName || ''} onChange={update('firstName')} />
            </div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input type="text" className="form-input" value={profile?.lastName || ''} onChange={update('lastName')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <input type="tel" className="form-input" value={profile?.phone || ''} onChange={update('phone')} />
          </div>
          <div className="form-group">
            <label className="form-label">Adresse</label>
            <input type="text" className="form-input" value={profile?.address || ''} onChange={update('address')} />
          </div>
          <button className="btn-provider-primary w-full" type="submit" disabled={saving}>
            {saving ? 'Sauvegarde...' : 'Sauvegarder le profil'}
          </button>
        </form>

        {/* Section 2: Sécurité */}
        <form className="provider-card" onSubmit={handlePasswordChange}>
          <h3>🔒 Sécurité</h3>
          {pwMsg && <div className="provider-alert provider-alert--success">✅ {pwMsg}</div>}
          {pwErr && <div className="provider-alert provider-alert--error">❌ {pwErr}</div>}

          <div className="form-group">
            <label className="form-label">Mot de passe actuel</label>
            <input type="password" className="form-input" required placeholder="••••••••"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
          </div>
          <div className="provider-card__row">
            <div className="form-group">
              <label className="form-label">Nouveau</label>
              <input type="password" className="form-input" required placeholder="Min. 4 car."
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmation</label>
              <input type="password" className="form-input" required placeholder="Retapez"
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
            </div>
          </div>
          <button className="btn-provider-secondary w-full" type="submit">Modifier le mot de passe</button>
        </form>

        {/* Section 3: Zone Critique */}
        <div className="provider-card provider-card--warning">
          <h3>⚠️ Données sensibles</h3>
          <p className="provider-card__warning-text">
            Votre compte est lié à l'email : <strong>{profile?.email}</strong>. 
            Toute modification nécessite une re-validation administrative.
          </p>
          <div className="form-group">
            <label className="form-label">Nouveau document justificatif</label>
            <input type="file" className="form-input-file" />
          </div>
          <button className="btn-provider-warning w-full" type="button">
            Soumettre pour re-validation
          </button>
        </div>
      </div>
    </div>
  );
}