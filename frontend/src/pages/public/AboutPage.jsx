import './AboutPage.css';
import { useEffect, useState } from 'react';
import { getCategories } from '../../api/categories.api';
import { getPublishedListings } from '../../api/listings.api';
// Icônes Lucide (assure-toi d'avoir fait : npm install lucide-react)
import { Target, ShieldCheck, BarChart3, Heart, Zap, Lock } from 'lucide-react';

export default function AboutPage() {
  const [stats, setStats] = useState({ listings: 0, categories: 0 });

  useEffect(() => {
    getCategories().then((cats) => setStats((s) => ({ ...s, categories: cats.length })));
    getPublishedListings({ limit: 1 }).then((res) => {
      if (Array.isArray(res)) setStats((s) => ({ ...s, listings: res.length }));
      else if (res && res.meta) setStats((s) => ({ ...s, listings: res.meta.total || 0 }));
    });
  }, []);

  return (
    <div className="about-page">
      {/* 1. HERO SECTION */}
      <div className="about-page__hero">
        <img src="/appartement.png" alt="Immo Lamis" className="hero-bg-img" />
        <div className="hero-content-wrapper">
          <h1>À propos d'Immo Lamis</h1>
          <p className="hero-description">
            Plus qu'une agence, une garantie de sécurité pour vos projets immobiliers.
          </p>
        </div>
      </div>

      {/* 2. PRÉSENTATION (TEXTE + IMAGE) */}
      <section className="section container">
        <div className="presentation-flex">
          <div className="presentation-text">
            <h2 className="section-title">Notre Engagement</h2>
            <p>
              Immo Lamis est née d'une vision simple : rendre l'immobilier accessible, 
              honnête et sécurisé pour tous en Algérie. Nous ne nous contentons pas de lister des biens, 
              nous bâtissons un réseau de confiance.
            </p>
            <p>
              Grâce à notre processus de vérification unique, nous garantissons que chaque 
              annonce répond à nos critères de qualité les plus stricts, éliminant ainsi les risques de fraude.
            </p>
          </div>
          <div className="presentation-image">
  <img 
    src="/about.png" 
    alt="Engagement Immo Lamis" 
    className="img-reveal" 
    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
  />
</div>
        </div>
      </section>

      {/* 3. NOS MISSIONS (ICÔNES) */}
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title centered">Nos Missions</h2>
          <div className="mission-grid">
            <div className="mission-card-new">
              <div className="icon-box"><Target color="#7c3aed" size={32} /></div>
              <h3>Vision Claire</h3>
              <p>Devenir la référence numéro 1 en Algérie pour la fiabilité des annonces immobilières.</p>
            </div>
            <div className="mission-card-new">
              <div className="icon-box"><ShieldCheck color="#7c3aed" size={32} /></div>
              <h3>Sécurité Totale</h3>
              <p>Chaque fournisseur est rigoureusement contrôlé avant de pouvoir publier sur notre site.</p>
            </div>
            <div className="mission-card-new">
              <div className="icon-box"><BarChart3 color="#7c3aed" size={32} /></div>
              <h3>Innovation</h3>
              <p>Utiliser les dernières technologies pour simplifier votre recherche de logement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION PROPOSÉE : NOS VALEURS (POURQUOI NOUS ?) */}
      <section className="section container">
        <h2 className="section-title centered">Pourquoi nous faire confiance ?</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon"><Heart size={24} /></div>
            <div className="value-content">
              <h4>La Proximité</h4>
              <p>Nous restons à l'écoute de chaque utilisateur pour améliorer nos services au quotidien.</p>
            </div>
          </div>
          <div className="value-item">
            <div className="value-icon"><Lock size={24} /></div>
            <div className="value-content">
              <h4>Transparence</h4>
              <p>Pas de frais cachés, pas d'annonces fantômes. Tout est clair dès le départ.</p>
            </div>
          </div>
          <div className="value-item">
            <div className="value-icon"><Zap size={24} /></div>
            <div className="value-content">
              <h4>Rapidité</h4>
              <p>Un système fluide pour trouver votre bien ou contacter un vendeur en un clic.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STATISTIQUES (COMPTEURS) */}
      <section className="section stats-footer">
        <div className="container">
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">+{stats.listings}</span>
              <span className="stat-label">Annonces Vérifiées</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">+{stats.categories}</span>
              <span className="stat-label">Types de Biens</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}