import { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '../../components/Toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/contact', formData);
      showToast({ type: 'success', message: 'Merci pour votre message ! Nous vous répondrons sous 24h.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      showToast({ type: 'error', message: 'Erreur lors de l\'envoi. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="about-hero-prestige prestige-navy-bg">
        <div className="hero-overlay" style={{ backgroundImage: `url('/services.webp')` }} />
        <div className="container about-hero-content" data-aos="zoom-out">
          <p className="cursive-accent">Nous Contacter</p>
          <h1 className="massive-title">UNE QUESTION ?</h1>
          <p className="hero-subtitle-prestige">
            Nos experts sont à votre écoute 7j/7.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="contact-layout-prestige">
          
          <div className="contact-info-prestige" data-aos="fade-right">
             <div className="info-card-prestige">
                <div className="info-icon text-prestige-gold"><Mail size={24}/></div>
                <h4>Email</h4>
                <p>contact@immolamis.com</p>
             </div>
             <div className="info-card-prestige">
                <div className="info-icon text-prestige-gold"><Phone size={24}/></div>
                <h4>Téléphone</h4>
                <p>+213 555 123 456</p>
             </div>
             <div className="info-card-prestige">
                <div className="info-icon text-prestige-gold"><MapPin size={24}/></div>
                <h4>Bureau</h4>
                <p>Alger, Algérie</p>
             </div>
             
             <div className="map-wrapper-prestige">
                <iframe
                  title="Localisation Immo Lamis"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=2.9%2C36.7%2C3.1%2C36.8&layer=mapnik&marker=36.7538%2C3.0588"
                  loading="lazy"
                />
             </div>
          </div>

          <div className="contact-form-wrapper glass-card" data-aos="fade-left">
            <form className="prestige-form" onSubmit={handleSubmit}>
               <div className="form-row">
                  <div className="form-group-prestige">
                    <label>NOM COMPLET</label>
                    <input 
                      type="text" required placeholder="Ex: Ahmed Benali" 
                      value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group-prestige">
                    <label>EMAIL</label>
                    <input 
                      type="email" required placeholder="Ex: ahmed@email.com"
                      value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
               </div>

               <div className="form-group-prestige">
                 <label>SUJET</label>
                 <input 
                    type="text" required placeholder="Comment pouvons-nous vous aider ?"
                    value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                 />
               </div>

               <div className="form-group-prestige">
                 <label>MESSAGE</label>
                 <textarea 
                    required rows="5" placeholder="Décrivez votre projet ou votre question..."
                    value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                 />
               </div>

               <button type="submit" className="btn-discover-gold" disabled={loading}>
                  {loading ? 'ENVOI EN COURS...' : 'ENVOYER LE MESSAGE →'}
               </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
