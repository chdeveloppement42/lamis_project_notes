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
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <img src="/local.png" alt="Hero" className="hero-bg" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="badge">Contactez-nous</span>
          <h1>Une question? <span>Nous sommes là</span></h1>
          <p>Notre équipe d'experts est là pour vous accompagner dans vos recherches immobilières.</p>
        </div>
      </div>

      <section className="contact-section">
        <div className="contact-grid">
          
          <div className="contact-sidebar">
            <div className="info-grid">
              <div className="modern-card">
                <div className="icon-box">✉️</div>
                <div>
                  <h3>Email</h3>
                  <p>contact@immolamis.com</p>
                </div>
              </div>
              <div className="modern-card">
                <div className="icon-box">📞</div>
                <div>
                  <h3>Téléphone</h3>
                  <p>+213 555 123 456</p>
                </div>
              </div>
              <div className="modern-card">
                <div className="icon-box">📍</div>
                <div>
                  <h3>Adresse</h3>
                  <p>Alger, Algérie</p>
                </div>
              </div>
            </div>

            <div className="modern-map">
              <iframe
                title="Localisation"
                src="https://www.openstreetmap.org/export/embed.html?bbox=2.9%2C36.7%2C3.1%2C36.8&layer=mapnik"
                width="100%"
                height="100%"
              ></iframe>
            </div>
          </div>

          <div className="form-container-glass">
            <h2>Envoyez-nous un message</h2>
            {submitted && <div className="status-msg success">✨ Message envoyé avec succès !</div>}
            {error && <div className="status-msg error">⚠️ {error}</div>}
            
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Votre Nom"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Votre Email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Sujet"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <textarea
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-modern">
                <span>Envoyer le message</span>
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}