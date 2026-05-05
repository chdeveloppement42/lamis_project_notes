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

  // Password state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwErr, setPwErr] = useState(null);

  useEffect(() => {
    axiosInstance.get('/providers/profile')
      .then((res) => {
        setProfile(res.data);
      })
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

  const handleSensitiveUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const body = {};
      if (profile.newEmail) body.email = profile.newEmail;
      const res = await axiosInstance.patch('/providers/profile/sensitive', body);
      setProfile({ ...profile, ...res.data });
      setMessage('Données mises à jour. Votre compte est en attente de re-validation.');
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
      setPwErr(err.response?.data?.message || 'Erreur lors du changement de mot de passe.');
    }
  };

  if (loading) {
    return (
      <div className="provider-page">
        <h1>Mon Profil</h1>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="provider-page">
      <h1>Mon Profil</h1>
      <p className="provider-page__subtitle">Gérez vos informations personnelles</p>

      {message && <div className="provider-alert provider-alert--success">✅ {message}</div>}
      {error && <div className="provider-alert provider-alert--error">❌ {error}</div>}

      <div className="provider-page__grid">
        {/* ─── Personal Info ─────────────────────────── */}
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
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </form>

        {/* ─── Password Change (GAP 2) ──────────────── */}
        <form className="provider-card" onSubmit={handlePasswordChange}>
          <h3>🔒 Changer le mot de passe</h3>

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
              <label className="form-label">Nouveau mot de passe</label>
              <input type="password" className="form-input" required placeholder="Min. 4 caractères"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmer</label>
              <input type="password" className="form-input" required placeholder="Retapez"
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit">Modifier le mot de passe</button>
        </form>

        {/* ─── Sensitive Data ────────────────────────── */}
        <form className="provider-card provider-card--warning" onSubmit={handleSensitiveUpdate}>
          <h3>⚠️ Données sensibles</h3>
          <p className="provider-card__warning-text">
            La modification de votre email ou de votre document justificatif entraînera la suspension temporaire
            de votre compte en attente de re-validation par un administrateur.
          </p>
          <div className="form-group">
            <label className="form-label">Email actuel : {profile?.email}</label>
            <input type="email" className="form-input" placeholder="Nouvel email (optionnel)"
              value={profile?.newEmail || ''}
              onChange={(e) => setProfile({ ...profile, newEmail: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Document justificatif</label>
            <input type="file" className="form-input" />
          </div>
          <button className="btn" type="submit" style={{ background: 'var(--color-warning)', color: '#fff' }}>
            Mettre à jour (Déclenchera une re-validation)
          </button>
        </form>
      </div>
    </div>
  );
}
