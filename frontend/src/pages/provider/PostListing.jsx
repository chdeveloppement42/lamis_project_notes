import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import axiosInstance from '../../api/axiosInstance';
import { getCategories } from '../../api/categories.api';
import { useAuth } from '../../context/AuthContext';
import './ProviderPages.css';

export default function PostListing() {
  const { user } = useAuth();
  const [listing, setListing] = useState({
    title: '', description: '', price: '', city: '', district: '', categoryId: '', status: 'DRAFT',
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  const isValidated = user?.status === 'VALIDATED';

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const update = (field) => (e) => setListing({ ...listing, [field]: e.target.value });

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const options = {
      maxSizeMB: 0.8, // 800KB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    try {
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          const compressedFile = await imageCompression(file, options);
          return compressedFile;
        })
      );
      setImages((prev) => [...prev, ...compressedFiles]);
    } catch (error) {
      console.error('Error compressing images:', error);
      alert('Erreur lors de la compression des images.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidated) {
      alert('Votre compte doit être validé par un administrateur avant de pouvoir publier des annonces.');
      return;
    }

    if (images.length === 0) {
      alert('Veuillez ajouter au moins une image.');
      return;
    }

    setUploading(true);

    try {
      // 1. Upload images first
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image, image.name.replace(/\.[^/.]+$/, "") + ".webp");
      });

      const mediaRes = await axiosInstance.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrls = mediaRes.data.urls;

      // 2. Submit listing data with URLs
      const payload = {
        ...listing,
        price: parseFloat(listing.price),
        categoryId: parseInt(listing.categoryId, 10),
        images: imageUrls,
      };

      await axiosInstance.post('/listings', payload);
      
      alert(`Annonce "${listing.title}" créée avec succès !`);
      
      // Reset form
      setListing({ title: '', description: '', price: '', city: '', district: '', categoryId: '', status: 'DRAFT' });
      setImages([]);
    } catch (error) {
      console.error('Error submitting listing:', error);
      const msg = error.response?.data?.message || 'Erreur lors de la création de l\'annonce.';
      alert(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="provider-page">
      <h1>Publier une annonce</h1>
      <p className="provider-page__subtitle">Remplissez les détails de votre bien immobilier</p>

      {!isValidated && (
        <div className="admin-badge admin-badge--warning" style={{ marginBottom: '1.5rem', width: '100%', padding: '1rem' }}>
          ⚠️ Votre compte est en attente de validation. Vous pouvez remplir ce formulaire, mais vous ne pourrez pas le soumettre tant qu'un administrateur n'aura pas validé votre profil.
        </div>
      )}

      <form className="provider-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Titre de l'annonce</label>
          <input type="text" className="form-input" required placeholder="Ex: Appartement F3 lumineux" value={listing.title} onChange={update('title')} />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows="5" required placeholder="Décrivez votre bien en détail..." value={listing.description} onChange={update('description')} style={{ resize: 'vertical' }} />
        </div>

        <div className="provider-card__row">
          <div className="form-group">
            <label className="form-label">Prix (DA)</label>
            <input type="number" className="form-input" required placeholder="12 000 000" value={listing.price} onChange={update('price')} />
          </div>
          <div className="form-group">
            <label className="form-label">Catégorie</label>
            <select className="form-input" required value={listing.categoryId} onChange={update('categoryId')}>
              <option value="">Sélectionner...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="provider-card__row">
          <div className="form-group">
            <label className="form-label">Ville</label>
            <input type="text" className="form-input" required placeholder="Ex: Alger" value={listing.city} onChange={update('city')} />
          </div>
          <div className="form-group">
            <label className="form-label">Quartier / Commune</label>
            <input type="text" className="form-input" required placeholder="Ex: Hydra" value={listing.district} onChange={update('district')} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Photos ({images.length} sélectionnées)</label>
          <div className="provider-upload">
            <label className="provider-upload__zone" style={{ cursor: 'pointer', display: 'block' }}>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              <span>📷</span>
              <p>Cliquez pour sélectionner vos photos</p>
              <span className="provider-upload__hint">Max 800KB par image • Auto-compressé en WebP</span>
            </label>
          </div>
        </div>

        <div className="provider-card__footer">
          <button type="submit" disabled={uploading || !isValidated} className="btn btn-secondary" onClick={() => setListing({ ...listing, status: 'DRAFT' })}>
            Sauvegarder en brouillon
          </button>
          <button type="submit" disabled={uploading || !isValidated} className="btn btn-primary" onClick={() => setListing({ ...listing, status: 'PUBLISHED' })}>
            {uploading ? 'Envoi en cours...' : 'Demander la publication'}
          </button>
        </div>
      </form>
    </div>
  );
}
