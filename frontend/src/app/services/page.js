'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faCarSide, faCog, faOilCan, faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const tabs = [
  {
    id: 'tab-1',
    icon: faCarSide,
    label: 'Test diagnostic',
    img: '/img/service-1.jpg',
    title: "15 ans d'expérience dans le diagnostic automobile",
    desc: "En tant que société d'inspection neutre et indépendante, ValidAuto vérifie le bon état des véhicules pour la sécurité des conducteurs et mesure la pollution des gaz d'échappement pour protéger l'environnement.",
  },
  {
    id: 'tab-2',
    icon: faCar,
    label: 'Entretien moteur',
    img: '/img/service-2.jpg',
    title: "Entretien moteur par des experts certifiés",
    desc: "Avec des années d'expertise, nous offrons des services de vérification et réparation de tous les composants essentiels. Votre moteur fonctionne de manière optimale grâce à nos interventions spécialisées.",
  },
  {
    id: 'tab-3',
    icon: faCog,
    label: 'Changement de pneus',
    img: '/img/service-3.jpg',
    title: "Montage et équilibrage de pneus professionnels",
    desc: "Nous vous aidons à remplacer vos pneus usés ou endommagés pour garantir une conduite en toute sécurité. Montage, équilibrage et conseil sur le choix des pneus adaptés à votre véhicule.",
  },
  {
    id: 'tab-4',
    icon: faOilCan,
    label: 'Vidange',
    img: '/img/service-4.jpg',
    title: "Vidange rapide et changement de filtre",
    desc: "Maintenez votre moteur en parfait état avec notre service de vidange. Nous changeons l'huile moteur et remplaçons le filtre pour assurer une performance optimale et prolonger la durée de vie de votre moteur.",
  },
];

const checks = ['Service de qualité', 'Mécaniciens experts', 'Équipement moderne'];

export default function Service() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="va-loader">
        <FontAwesomeIcon icon={faCar} className="va-loader-icon" />
        <span className="va-loader-text">VALIDAUTO</span>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <div style={{
        position: 'relative', minHeight: '260px', display: 'flex', alignItems: 'center',
        backgroundImage: 'url(/img/carousel-bg-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.88), rgba(10,10,10,0.97))' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '70px 0 50px' }}>
          <span className="va-label">Centre ValidAuto</span>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: 'clamp(2.4rem,5vw,4rem)', marginBottom: '16px' }}>
            Nos <span style={{ background: 'linear-gradient(135deg,#E74C3C,#FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Services</span>
          </h1>
          <nav>
            <ol style={{ display: 'flex', justifyContent: 'center', gap: '8px', listStyle: 'none', padding: 0, margin: 0, alignItems: 'center' }}>
              <li><a href="/accueil" style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>Accueil</a></li>
              <li style={{ color: '#444', fontSize: '0.75rem' }}>›</li>
              <li><a href="/rendezvous" style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>Réservation</a></li>
              <li style={{ color: '#444', fontSize: '0.75rem' }}>›</li>
              <li style={{ color: '#E74C3C', fontSize: '0.78rem', fontWeight: 600 }}>Services</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Services Section */}
      <section style={{ background: '#0d0d0d', padding: '80px 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="va-label">Ce que nous proposons</span>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: 'clamp(1.9rem,4vw,3rem)' }}>
              Explorer nos <span style={{ background: 'linear-gradient(135deg,#E74C3C,#FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>services</span>
            </h2>
          </div>

          <div className="row g-4">
            {/* Tab sidebar */}
            <div className="col-lg-4">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tabs.map((tab, i) => {
                  const active = activeTab === i;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(i)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '16px 20px', borderRadius: '8px', cursor: 'pointer',
                        border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        background: active
                          ? 'linear-gradient(135deg,#C0392B,#E74C3C)'
                          : 'rgba(255,255,255,0.03)',
                        boxShadow: active ? '0 6px 24px rgba(192,57,43,0.35)' : 'none',
                        transition: 'all 0.3s',
                        textAlign: 'left', width: '100%',
                      }}
                    >
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '7px', flexShrink: 0,
                        background: active ? 'rgba(255,255,255,0.18)' : 'rgba(192,57,43,0.12)',
                        border: `1px solid ${active ? 'rgba(255,255,255,0.2)' : 'rgba(192,57,43,0.25)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: active ? '#fff' : '#E74C3C', fontSize: '1.05rem',
                      }}>
                        <FontAwesomeIcon icon={tab.icon} />
                      </div>
                      <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '1.05rem', fontWeight: 700,
                        color: active ? '#fff' : '#bbb',
                      }}>
                        {tab.label}
                      </span>
                      {active && (
                        <FontAwesomeIcon icon={faArrowRight} style={{ color: '#fff', fontSize: '0.8rem', marginLeft: 'auto', opacity: 0.7 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <div className="col-lg-8">
              <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
                <div className="row g-0">
                  {/* Image */}
                  <div className="col-md-5" style={{ position: 'relative', minHeight: '320px' }}>
                    <Image
                      src={tabs[activeTab].img}
                      alt={tabs[activeTab].label}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    {/* Gradient overlay on image */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, #141414)' }} className="d-none d-md-block" />
                  </div>

                  {/* Text */}
                  <div className="col-md-7" style={{ padding: '36px 32px' }}>
                    <div style={{ width: '36px', height: '3px', background: 'linear-gradient(90deg,#C0392B,#FF6B35)', borderRadius: '2px', marginBottom: '18px' }} />
                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: '#fff', fontSize: 'clamp(1.25rem,2.5vw,1.6rem)', marginBottom: '14px', lineHeight: 1.2 }}>
                      {tabs[activeTab].title}
                    </h3>
                    <p style={{ color: '#888', fontSize: '0.87rem', lineHeight: 1.8, marginBottom: '22px' }}>
                      {tabs[activeTab].desc}
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px' }}>
                      {checks.map((c, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#aaa', fontSize: '0.85rem', marginBottom: '8px' }}>
                          <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FontAwesomeIcon icon={faCheck} style={{ color: '#2ecc71', fontSize: '0.6rem' }} />
                          </span>
                          {c}
                        </li>
                      ))}
                    </ul>
                    <a href="/rendezvous" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: 'linear-gradient(135deg,#C0392B,#E74C3C)',
                      color: '#fff', padding: '11px 22px', borderRadius: '6px',
                      fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em',
                      textTransform: 'uppercase', textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(192,57,43,0.35)',
                    }}>
                      Réserver un rendez-vous
                      <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}