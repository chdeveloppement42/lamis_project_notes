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
  const [images, setImages] = useState([]); // Fichiers compressés
  const [previews, setPreviews] = useState([]); // URLs pour affichage local
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
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    try {
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          const compressedFile = await imageCompression(file, options);
          // Créer une URL locale pour la prévisualisation
          const previewUrl = URL.createObjectURL(compressedFile);
          return { file: compressedFile, url: previewUrl };
        })
      );

      setImages((prev) => [...prev, ...compressedFiles.map(c => c.file)]);
      setPreviews((prev) => [...prev, ...compressedFiles.map(c => c.url)]);
    } catch (error) {
      console.error('Error compressing images:', error);
      alert('Erreur lors de la compression.');
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidated) return alert('Compte non validé.');
    if (images.length === 0) return alert('Ajoutez au moins une photo.');

    setUploading(true);
    try {
      const formData = new FormData();
      images.forEach((image, i) => {
        formData.append('images', image, `img_${i}.webp`);
      });

      const mediaRes = await axiosInstance.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const payload = {
        ...listing,
        price: parseFloat(listing.price),
        categoryId: parseInt(listing.categoryId, 10),
        images: mediaRes.data.urls,
      };

      await axiosInstance.post('/listings', payload);
      alert(`Annonce créée avec succès !`);
      
      // Reset
      setListing({ title: '', description: '', price: '', city: '', district: '', categoryId: '', status: 'DRAFT' });
      setImages([]);
      setPreviews([]);
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de l\'envoi.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="provider-page">
      <div className="header-mobile">
        <h1>Publier une annonce</h1>
        <p className="provider-page__subtitle">Remplissez les détails de votre bien</p>
      </div>

      {!isValidated && (
        <div className="provider-alert provider-alert--error">
          ⚠️ Votre compte est en attente de validation.
        </div>
      )}

      <form className="provider-form-mobile" onSubmit={handleSubmit}>
        <div className="provider-card">
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input type="text" className="form-input" required placeholder="Ex: Appartement F3" value={listing.title} onChange={update('title')} />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="4" required placeholder="Détails du bien..." value={listing.description} onChange={update('description')} />
          </div>

          <div className="provider-card__row">
            <div className="form-group">
              <label className="form-label">Prix (DA)</label>
              <input type="number" className="form-input" required value={listing.price} onChange={update('price')} />
            </div>
            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <select className="form-input" required value={listing.categoryId} onChange={update('categoryId')}>
                <option value="">Sélectionner...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="provider-card__row">
            <div className="form-group">
              <label className="form-label">Ville</label>
              <input type="text" className="form-input" required value={listing.city} onChange={update('city')} />
            </div>
            <div className="form-group">
              <label className="form-label">Quartier</label>
              <input type="text" className="form-input" required value={listing.district} onChange={update('district')} />
            </div>
          </div>
        </div>

        <div className="provider-card" style={{ marginTop: '1.5rem' }}>
          <label className="form-label">Photos ({images.length})</label>
          
          {/* Zone d'affichage des miniatures avant envoi */}
          <div className="mobile-previews-grid">
            {previews.map((url, index) => (
              <div key={index} className="preview-thumb">
                <img src={url} alt="Aperçu" />
                <button type="button" onClick={() => removeImage(index)} className="btn-remove">×</button>
              </div>
            ))}
            <label className="add-photo-btn">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} hidden />
              <span className="plus">+</span>
            </label>
          </div>
          <p className="provider-upload__hint">Auto-compressé en WebP</p>
        </div>

        <div className="provider-card__footer-mobile">
          <button type="submit" disabled={uploading || !isValidated} className="btn-provider-secondary" onClick={() => setListing(prev => ({ ...prev, status: 'DRAFT' }))}>
            Brouillon
          </button>
          <button type="submit" disabled={uploading || !isValidated} className="btn-provider-primary" onClick={() => setListing(prev => ({ ...prev, status: 'PUBLISHED' }))}>
            {uploading ? 'Envoi...' : 'Publier'}
          </button>
        </div>
      </form>
    </div>
  );
}