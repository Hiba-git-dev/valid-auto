'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faDirections, 
  faCompass, 
  faParking, 
  faWifi, 
  faCoffee, 
  faWheelchair,
  faPhone,
  faClock,
  faCheckCircle,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

export default function LocationMapSection() {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Centre+Visite+Technique+Fes+Route+Ain+Chkef";
  const wazeUrl = "https://waze.com/ul?q=Fes+Route+Ain+Chkef&navigate=yes";

  const amenities = [
    { icon: faParking, text: "Parking gratuit 40 places" },
    { icon: faWifi, text: "Wi-Fi haut débit client" },
    { icon: faCoffee, text: "Espace détente climatisé" },
    { icon: faWheelchair, text: "Accès adapté PMR" },
  ];

  return (
    <section style={{ background: '#0a0a0a', padding: '90px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container">
        {/* Header */}
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
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '6px' }} />
            Accès &amp; Stationnement
          </span>
          <h2 className="va-title" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', color: '#fff', fontWeight: 800 }}>
            Venir à notre centre de <span>contrôle à Fès</span>
          </h2>
          <div style={{ width: '50px', height: '3px', background: 'linear-gradient(90deg, #C0392B, #FF6B35)', margin: '12px auto 20px', borderRadius: '2px' }} />
          <p style={{ color: '#aaa', maxWidth: '620px', margin: '0 auto', fontSize: '0.95rem' }}>
            Idéalement situé sur l'axe principal Route Ain Chkef / Saïss avec accès rapide, voies de circulation dédiées et parking privé réservé.
          </p>
        </div>

        <div className="row g-4 align-items-stretch">
          {/* Left Column: Infos & Actions */}
          <div className="col-lg-5 d-flex flex-column justify-content-between">
            <div className="d-flex flex-column gap-3">
              {/* Card 1: Adresse */}
              <div style={{
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '22px 24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0
                  }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <div>
                    <h5 style={{ color: '#fff', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Adresse Principale</h5>
                    <div style={{ color: '#E74C3C', fontSize: '0.75rem', fontWeight: 600 }}>Centre Homologué NARSA n° 45/FE</div>
                  </div>
                </div>
                <p style={{ color: '#bbb', fontSize: '0.88rem', margin: '10px 0 6px', lineHeight: 1.5 }}>
                  <strong>Route Ain Chkef (Axe Saïss)</strong>, 30000 Fès, Maroc.<br />
                  <span style={{ color: '#777', fontSize: '0.8rem' }}>À 3 minutes du rond-point Al Qods, en face du pôle artisanal.</span>
                </p>
              </div>

              {/* Card 2: Horaires */}
              <div style={{
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '22px 24px'
              }}>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'rgba(231,76,60,0.15)',
                    border: '1px solid rgba(231,76,60,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E74C3C',
                    flexShrink: 0
                  }}>
                    <FontAwesomeIcon icon={faClock} />
                  </div>
                  <div>
                    <h5 style={{ color: '#fff', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Horaires d'Ouverture</h5>
                    <div style={{ color: '#2ecc71', fontSize: '0.75rem', fontWeight: 600 }}>Lignes d'inspection actives</div>
                  </div>
                </div>
                <div style={{ color: '#ccc', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  <div><strong>Du Lundi au Samedi :</strong> 08h30 – 18h30 (Continu)</div>
                  <div style={{ color: '#888', fontSize: '0.78rem' }}>Dimanche : Fermé (Réservation en ligne ouverte 24/7)</div>
                </div>
              </div>

              {/* Card 3: Commodités */}
              <div style={{
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '20px 24px'
              }}>
                <div style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  Commodités &amp; Confort sur place
                </div>
                <div className="row g-2">
                  {amenities.map((item, idx) => (
                    <div key={idx} className="col-6">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '0.78rem' }}>
                        <FontAwesomeIcon icon={item.icon} style={{ color: '#E74C3C', fontSize: '0.8rem', width: '14px' }} />
                        <span>{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap gap-2 mt-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                  color: '#fff',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(231,76,60,0.3)',
                  whiteSpace: 'nowrap'
                }}
              >
                <FontAwesomeIcon icon={faDirections} />
                Google Maps
              </a>

              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <FontAwesomeIcon icon={faCompass} style={{ color: '#38bdf8' }} />
                Itinéraire Waze
              </a>

              <a
                href="tel:+212770145404"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  textDecoration: 'none'
                }}
                title="Appeler le centre"
              >
                <FontAwesomeIcon icon={faPhone} style={{ color: '#2ecc71' }} />
              </a>
            </div>
          </div>

          {/* Right Column: Stylized Interactive Map Card */}
          <div className="col-lg-7">
            <div style={{
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              overflow: 'hidden',
              height: '100%',
              minHeight: '440px',
              position: 'relative',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
            }}>
              {/* Map Iframe */}
              <iframe
                title="Localisation ValidAuto Fès"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105884.2838706373!2d-5.068159672656247!3d34.02088230000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f8b484d4b577b%3A0xb3933c4109f3e494!2sFes%2C%20Morocco!5e0!3m2!1sen!2sma!4v1700000000000!5m2!1sen!2sma"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'grayscale(0.85) invert(0.9) contrast(1.15)',
                  minHeight: '440px'
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Center Overlay Badge */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(10,10,10,0.92)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(231,76,60,0.4)',
                borderRadius: '10px',
                padding: '12px 18px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#C0392B,#E74C3C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}>
                  <FontAwesomeIcon icon={faShieldAlt} />
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.88rem' }}>Centre ValidAuto Fès Saïss</div>
                  <div style={{ color: '#2ecc71', fontSize: '0.74rem', fontWeight: 600 }}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '4px' }} />
                    2 Lignes de contrôle VL &amp; Utilitaires
                  </div>
                </div>
              </div>

              {/* Coordinates Pill Bottom Right */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                background: 'rgba(10,10,10,0.85)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                padding: '5px 12px',
                color: '#aaa',
                fontSize: '0.72rem',
                fontFamily: 'monospace'
              }}>
                GPS: 34.0208° N, 4.9982° W
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
