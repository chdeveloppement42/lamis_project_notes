import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Mail, Phone, MapPin, Send, Loader2, ChevronDown, ChevronUp, User, Building2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './ContactPage.css';

const FAQ_CONTENT = {
  acheteur: [
    { q: "Comment planifier une visite ?", a: "Cliquez sur 'Contacter l'agent' sur l'annonce du bien. Vous pourrez choisir un créneau horaire directement." },
    { q: "Y a-t-il des frais de dossier ?", a: "La consultation et la mise en relation sur Immo Lamis sont entièrement gratuites pour les acheteurs." },
    { q: "Les prix sont-ils négociables ?", a: "Oui, la plupart des vendeurs acceptent la négociation. Nous vous conseillons d'en discuter lors de la visite." }
  ],
  fournisseur: [
    { q: "Comment publier mon catalogue ?", a: "Créez un compte 'Partenaire', remplissez votre profil entreprise et commencez à uploader vos produits ou biens." },
    { q: "Quelle est la visibilité de mes annonces ?", a: "Vos annonces sont diffusées auprès de milliers de visiteurs ciblés en Algérie chaque jour." },
    { q: "Puis-je modifier une annonce publiée ?", a: "Absolument. Votre tableau de bord vous permet de modifier prix, photos et descriptions en temps réel." }
  ]
};

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ submitted: false, error: null, loading: false });
  const [activeTab, setActiveTab] = useState('acheteur');
  const [activeIndex, setActiveIndex] = useState(null);

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
    } catch {
      setStatus({ submitted: false, error: "Erreur réseau. Réessayez.", loading: false });
    }
  };

  return (
    <div className="aymen-contact-wrapper">
      <section className="contact-hero-luxe">
        <div className="hero-overlay-dark" style={{ backgroundImage: `url('/local.png')` }} />
        <div className="container hero-content-luxe" data-aos="zoom-out">
          <span className="gold-badge">Support Immo Lamis</span>
          <h1 className="massive-title">BESOIN D'AIDE ? <span className="text-gold">CONTACTEZ-NOUS</span></h1>
        </div>
      </section>

      <section className="contact-main-section container">
        <div className="contact-grid-luxe">
          
          {/* SIDEBAR : RESTAURÉE COMME AVANT */}
          <div className="contact-sidebar-luxe" data-aos="fade-right">
            <div className="info-stack-luxe">
              <a href="mailto:contact@immolamis.com" className="modern-card-luxe clickable-card">
                <div className="icon-circle-gold"><Mail size={22} /></div>
                <div className="card-details">
                  <h3>Email</h3>
                  <p>contact@immolamis.com</p>
                </div>
              </a>

              <a href="tel:+213555123456" className="modern-card-luxe clickable-card">
                <div className="icon-circle-gold"><Phone size={22} /></div>
                <div className="card-details">
                  <h3>Téléphone</h3>
                  <p>+213 555 123 456</p>
                </div>
              </a>
            </div>

            <div className="map-container-luxe">
              <iframe title="Map" src="https://www.openstreetmap.org/export/embed.html?bbox=2.9%2C36.7%2C3.1%2C36.8&layer=mapnik"></iframe>
            </div>
          </div>

          {/* FORMULAIRE */}
          <div className="form-container-luxe" data-aos="fade-left">
            <div className="form-header">
              <h2>Message Direct</h2>
              <div className="gold-divider"></div>
            </div>
            <form onSubmit={handleSubmit} className="aymen-form">
              <div className="input-row">
                <div className="input-group-luxe">
                  <label>Nom</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="input-group-luxe">
                  <label>Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>
              <div className="input-group-luxe">
                <label>Sujet</label>
                <input type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required />
              </div>
              <div className="input-group-luxe">
                <label>Message</label>
                <textarea rows="4" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required></textarea>
              </div>
              <button type="submit" className="btn-gold-luxe" disabled={status.loading}>
                {status.loading ? <Loader2 className="spinner" /> : <><Send size={18} /> ENVOYER LE MESSAGE</>}
              </button>
            </form>
          </div>
        </div>

        <div className="section-spacer"></div>

        {/* TITRE FAQ HARMONISÉ */}
        <p className="cursive-accent centered" data-aos="fade-up">Questions Fréquentes</p>

        <div className="faq-tabs-container" data-aos="fade-up">
          <div className="faq-tabs-nav">
            <button className={`tab-btn ${activeTab === 'acheteur' ? 'active' : ''}`} onClick={() => { setActiveTab('acheteur'); setActiveIndex(null); }}>
              <User size={18} /> Je suis un Acheteur
            </button>
            <button className={`tab-btn ${activeTab === 'fournisseur' ? 'active' : ''}`} onClick={() => { setActiveTab('fournisseur'); setActiveIndex(null); }}>
              <Building2 size={18} /> Je suis un Fournisseur
            </button>
          </div>

          <div className="faq-content-box">
            {FAQ_CONTENT[activeTab].map((item, index) => (
              <div key={index} className={`faq-accordion-item ${activeIndex === index ? 'open' : ''}`} onClick={() => setActiveIndex(activeIndex === index ? null : index)}>
                <div className="faq-question-row">
                  <span>{item.q}</span>
                  {activeIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                <div className="faq-answer-row">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}