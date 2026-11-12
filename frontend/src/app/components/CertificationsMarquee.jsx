'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faCheckCircle, 
  faCertificate, 
  faCar, 
  faClock, 
  faFilePdf,
  faWrench
} from '@fortawesome/free-solid-svg-icons';

export default function CertificationsMarquee() {
  const items = [
    { icon: faShieldAlt, text: 'Centre Agréé NARSA n° 45/FE' },
    { icon: faCertificate, text: 'Homologation Ministère du Transport' },
    { icon: faWrench, text: 'Bancs de Test Informatiques MAHA & Bosch' },
    { icon: faCheckCircle, text: 'Certification Qualité ISO 9001' },
    { icon: faCar, text: '+15 000 Véhicules Contrôlés à Fès' },
    { icon: faClock, text: 'Prise en Charge Express 40 Minutes' },
    { icon: faFilePdf, text: 'Bilan Technique 100% Dématérialisé (PDF)' },
  ];

  // Duplicate items array to make the infinite loop continuous and seamless
  const duplicatedItems = [...items, ...items];

  return (
    <div className="va-marquee-container">
      <div className="va-marquee-track">
        {duplicatedItems.map((item, idx) => (
          <div key={idx} className="va-marquee-badge">
            <FontAwesomeIcon icon={item.icon} style={{ color: '#E74C3C', fontSize: '0.8rem' }} />
            <span>{item.text}</span>
            <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 6px' }}>•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
