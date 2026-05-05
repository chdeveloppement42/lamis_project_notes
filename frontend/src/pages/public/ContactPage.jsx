import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ submitted: false, error: null, loading: false });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ ...status, loading: true, error: null });

    try {
      await axiosInstance.post('/contact', formData);
      setStatus({ submitted: true, error: null, loading: false });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(s => ({ ...s, submitted: false })), 5000);
    } catch  {
      setStatus({ submitted: false, error: "Une erreur est survenue. Veuillez réessayer.", loading: false });
    }
  };

  return (
    <div className="aymen-contact-wrapper">
      {/* HERO SECTION */}
      <section className="contact-hero-luxe">
        <div className="hero-overlay-dark" style={{ backgroundImage: `url('/local.png')` }} />
        <div className="container hero-content-luxe" data-aos="zoom-out">
          <span className="gold-badge">Contactez-nous</span>
          <h1 className="massive-title">UNE QUESTION ? <span className="text-gold">NOUS SOMMES LÀ</span></h1>
          <p className="hero-subtitle-luxe">L'expertise Immo Lamis à votre écoute pour vos projets en Algérie.</p>
        </div>
      </section>

      <section className="contact-main-section container">
        <div className="contact-grid-luxe">
          
          {/* SIDEBAR INFO */}
          <div className="contact-sidebar-luxe" data-aos="fade-right">
            <div className="info-stack-luxe">
              <div className="modern-card-luxe">
                <div className="icon-circle-gold"><Mail size={24} /></div>
                <div className="card-details">
                  <h3>Email Officiel</h3>
                  <p>contact@immolamis.com</p>
                </div>
              </div>

              <div className="modern-card-luxe">
                <div className="icon-circle-gold"><Phone size={24} /></div>
                <div className="card-details">
                  <h3>Ligne Directe</h3>
                  <p>+213 555 123 456</p>
                </div>
              </div>

              <div className="modern-card-luxe">
                <div className="icon-circle-gold"><MapPin size={24} /></div>
                <div className="card-details">
                  <h3>Siège Social</h3>
                  <p>Alger, Algérie</p>
                </div>
              </div>
            </div>

            <div className="map-container-luxe">
              <iframe
                title="Localisation Immo Lamis"
                src="https://www.openstreetmap.org/export/embed.html?bbox=2.9%2C36.7%2C3.1%2C36.8&layer=mapnik"
              ></iframe>
            </div>
          </div>

          {/* FORMULAIRE */}
          <div className="form-container-luxe" data-aos="fade-left">
            <div className="form-header">
              <h2>Envoyez-nous un message</h2>
              <div className="gold-divider"></div>
            </div>

            {status.submitted && <div className="alert-luxe success">✨ Votre message a été transmis avec succès.</div>}
            {status.error && <div className="alert-luxe error">⚠️ {status.error}</div>}

            <form onSubmit={handleSubmit} className="aymen-form">
              <div className="input-row">
                <div className="input-group-luxe">
                  <label>Nom Complet</label>
                  <input
                    type="text"
                    placeholder="Ex: Mohamed Alami"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group-luxe">
                  <label>Adresse Email</label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="input-group-luxe">
                <label>Sujet de votre demande</label>
                <input
                  type="text"
                  placeholder="Ex: Information sur un bien"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="input-group-luxe">
                <label>Votre Message</label>
                <textarea
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-gold-luxe" disabled={status.loading}>
                {status.loading ? (
                  <><Loader2 className="spinner" size={20} /> ENVOI EN COURS...</>
                ) : (
                  <><Send size={18} /> ENVOYER LE MESSAGE</>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}