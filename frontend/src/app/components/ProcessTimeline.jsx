'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, 
  faTools, 
  faFilePdf, 
  faArrowRight, 
  faShieldAlt,
  faClock,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

export default function ProcessTimeline() {
  const steps = [
    {
      num: '01',
      icon: faCalendarCheck,
      badge: 'Gain de temps',
      title: 'Réservation en Ligne 24h/24',
      desc: 'Choisissez votre prestation, le jour et votre heure en moins de 2 minutes. Confirmation instantanée avec rappel officiel par WhatsApp.',
      detail: 'Sans file d\'attente physique'
    },
    {
      num: '02',
      icon: faTools,
      badge: 'Contrôle agréé',
      title: 'Passage sur Ligne de Test',
      desc: 'Présentez votre véhicule au centre. Nos 20 techniciens certifiés inspectent les 6 organes de sécurité sur bancs informatisés haute précision.',
      detail: 'Intervention en 35 à 45 minutes'
    },
    {
      num: '03',
      icon: faFilePdf,
      badge: 'Conforme NARSA',
      title: 'Bilan Numérique & QR Code',
      desc: 'Votre procès-verbal officiel et votre vignette sont délivrés. Téléchargez votre rapport technique en PDF avec signature numérique infalsifiable.',
      detail: '100% Numérisé & Dématérialisé'
    }
  ];

  return (
    <section style={{ background: '#0b0b0b', padding: '90px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="va-label" style={{ 
            color: '#E74C3C', 
            fontSize: '0.85rem', 
            letterSpacing: '2px', 
            textTransform: 'uppercase', 
            fontWeight: 700, 
            display: 'inline-block',
            marginBottom: '8px'
          }}>
            <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '6px' }} />
            Parcours Client Sans Friction
          </span>
          <h2 className="va-title" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', color: '#fff', fontWeight: 800 }}>
            Votre contrôle technique en <span>3 étapes simples</span>
          </h2>
          <div style={{ width: '50px', height: '3px', background: 'linear-gradient(90deg, #C0392B, #FF6B35)', margin: '12px auto 20px', borderRadius: '2px' }} />
          <p style={{ color: '#aaa', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
            De la prise de rendez-vous en ligne jusqu'à la délivrance du procès-verbal certifié, profitez d'une expérience fluide et sans stress.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="row g-4 position-relative">
          {/* Subtle Horizontal Connector Line behind cards on desktop */}
          <div 
            className="d-none d-lg-block"
            style={{
              position: 'absolute',
              top: '46px',
              left: '12%',
              right: '12%',
              height: '2px',
              background: 'linear-gradient(90deg, rgba(231,76,60,0.1), rgba(231,76,60,0.6), rgba(231,76,60,0.1))',
              zIndex: 0
            }}
          />

          {steps.map((step, idx) => (
            <div key={idx} className="col-lg-4 position-relative" style={{ zIndex: 1 }}>
              <div 
                style={{
                  background: 'linear-gradient(145deg, #141414 0%, #0f0f0f 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '34px 28px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'rgba(231,76,60,0.4)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(231,76,60,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)';
                }}
              >
                {/* Giant Faded Step Number in Background */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '18px',
                  fontSize: '5rem',
                  fontWeight: 900,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: 'rgba(255,255,255,0.03)',
                  lineHeight: 1,
                  pointerEvents: 'none'
                }}>
                  {step.num}
                </div>

                <div>
                  {/* Top: Icon + Badge */}
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '1.25rem',
                      boxShadow: '0 4px 18px rgba(231,76,60,0.35)'
                    }}>
                      <FontAwesomeIcon icon={step.icon} />
                    </div>

                    <span style={{
                      background: 'rgba(231,76,60,0.12)',
                      border: '1px solid rgba(231,76,60,0.3)',
                      color: '#ff6b35',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em'
                    }}>
                      {step.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 style={{
                    color: '#fff',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '12px',
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p style={{
                    color: '#aaa',
                    fontSize: '0.88rem',
                    lineHeight: 1.65,
                    marginBottom: '24px'
                  }}>
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Highlight */}
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#2ecc71',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '0.78rem' }} />
                  <span>{step.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button below */}
        <div className="text-center mt-5">
          <a 
            href="/rendezvous"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 6px 25px rgba(231,76,60,0.35)',
              transition: 'all 0.3s ease'
            }}
          >
            Réserver mon créneau maintenant
            <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} />
          </a>
        </div>
      </div>
    </section>
  );
}
