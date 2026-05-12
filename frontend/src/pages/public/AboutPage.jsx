import './AboutPage.css';
import { Target, ShieldCheck, BarChart3, Heart, Zap, Lock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* 1. HERO SECTION LUXE */}
      <section className="about-hero-prestige prestige-navy-bg">
        <div className="hero-overlay" style={{ backgroundImage: `url('/bureau.webp')` }} />
        <div className="container about-hero-content" data-aos="zoom-out">
          <p className="cursive-accent">Notre Histoire</p>
          <h1 className="massive-title">À PROPOS D'IMMO LAMIS</h1>
          <p className="hero-subtitle-prestige">
            L'excellence immobilière au service de votre sécurité en Algérie.
          </p>
        </div>
      </section>

      {/* 2. PRÉSENTATION ÉLÉGANTE */}
      <section className="section container">
        <div className="presentation-layout">
          <div className="presentation-text" data-aos="fade-right">
            <p className="cursive-accent">Notre Engagement</p>
            <div className="gold-divider"></div>
            <p className="p-prestige p-prestige--lead">
              Immo Lamis est née d'une vision simple : rendre l'immobilier 
              Nous ne nous contentons pas de lister des biens, nous bâtissons un réseau de confiance.
            </p>
            <p className="p-prestige p-prestige--secondary">
              Grâce à notre processus de vérification rigoureux, nous garantissons que chaque 
              annonce répond à nos critères de qualité les plus stricts.
            </p>
          </div>
          <div className="presentation-image" data-aos="fade-left">
            <div className="image-wrapper">
              <img src="/about.webp" alt="Engagement Immo Lamis" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSIONS (CARDS SOMBRES) */}
      <section className="section prestige-navy-bg">
        <div className="container">
          <p className="cursive-accent cursive-accent--centered" data-aos="fade-up">Nos Missions</p>
          <div className="mission-grid">
            <div className="mission-card glass-card" data-aos="fade-up" data-aos-delay="100">
              <div className="icon-circle text-prestige-gold"><Target size={32} /></div>
              <h3>Vision Claire</h3>
              <p>Devenir la référence numéro 1 en Algérie pour la fiabilité des annonces immobilières.</p>
            </div>
            <div className="mission-card glass-card" data-aos="fade-up" data-aos-delay="200">
              <div className="icon-circle text-prestige-gold"><ShieldCheck size={32} /></div>
              <h3>Sécurité Totale</h3>
              <p>Chaque fournisseur est rigoureusement contrôlé avant de pouvoir publier.</p>
            </div>
            <div className="mission-card glass-card" data-aos="fade-up" data-aos-delay="300">
              <div className="icon-circle text-prestige-gold"><BarChart3 size={32} /></div>
              <h3>Innovation</h3>
              <p>Utiliser la technologie pour simplifier radicalement votre recherche.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALEURS */}
      <section className="section container">
        <p className="cursive-accent cursive-accent--centered">Pourquoi nous ?</p>
        <div className="values-grid">
          {[
            { icon: <Heart />, title: "La Proximité", text: "À l'écoute de chaque utilisateur pour s'améliorer." },
            { icon: <Lock />, title: "Transparence", text: "Pas de frais cachés, pas d'annonces fantômes." },
            { icon: <Zap />, title: "Rapidité", text: "Un système fluide pour agir en un clic." }
          ].map((item, index) => (
            <div className="value-item" key={index} data-aos="fade-up">
              <div className="value-icon text-prestige-gold">{item.icon}</div>
              <div className="value-content">
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
