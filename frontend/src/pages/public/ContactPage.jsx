import { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axiosInstance.post('/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError('Erreur lors de l\'envoi. Veuillez réessayer.');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-page__hero">
        <div className="container">
          <h1>Contactez-nous</h1>
          <p>Une question ? N'hésitez pas à nous écrire</p>
        </div>
      </div>

      <section className="section">
        <div className="container contact-content">
          <div className="contact-left">
            {/* Info cards */}
            <div className="contact-info">
              <div className="contact-info__card">
                <span className="contact-info__icon">📧</span>
                <h3>Email</h3>
                <p>contact@immolamis.com</p>
              </div>
              <div className="contact-info__card">
                <span className="contact-info__icon">📞</span>
                <h3>Téléphone</h3>
                <p>+213 555 123 456</p>
              </div>
              <div className="contact-info__card">
                <span className="contact-info__icon">📍</span>
                <h3>Adresse</h3>
                <p>Alger, Algérie</p>
              </div>
            </div>

            {/* OpenStreetMap embed */}
            <div className="contact-map">
              <iframe
                title="Localisation Immo Lamis"
                src="https://www.openstreetmap.org/export/embed.html?bbox=2.9%2C36.7%2C3.1%2C36.8&layer=mapnik&marker=36.7538%2C3.0588"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: 'var(--radius-xl)' }}
                loading="lazy"
              />
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted && (
              <div className="contact-form__success">
                ✅ Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
              </div>
            )}

            <div className="contact-form__row">
              <div className="form-group">
                <label className="form-label">Nom complet</label>
                <input
                  type="text" className="form-input" required
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email" className="form-input" required
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Sujet</label>
              <input
                type="text" className="form-input" required
                placeholder="Sujet de votre message"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-input" rows="6" required
                placeholder="Votre message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg">
              Envoyer le message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
