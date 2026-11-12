'use client';
import { useState } from 'react';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);

  // Numéro du centre ValidAuto (Fès, Maroc)
  const phone = '212661234567';
  const message = encodeURIComponent('Bonjour ValidAuto, je souhaite avoir des informations concernant vos services de visite technique automobile à Fès.');
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '26px',
        right: '26px',
        zIndex: 9995,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'auto',
      }}
    >
      {/* Tooltip / Message d'accueil */}
      {showTooltip && (
        <div
          style={{
            marginBottom: '12px',
            background: '#181818',
            color: '#fff',
            border: '1px solid rgba(37,211,102,0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            maxWidth: '240px',
            fontSize: '0.82rem',
            lineHeight: 1.4,
            animation: 'fadeInUp 0.3s ease-out',
            position: 'relative',
          }}
        >
          <div style={{ fontWeight: 700, color: '#25D366', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#25D366', display: 'inline-block' }} />
            Support ValidAuto Fès
          </div>
          <div style={{ color: '#bbb' }}>Une question sur votre RDV ? Discutez en direct avec nos experts.</div>
        </div>
      )}

      {/* Bouton principal WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '28px',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45)',
          textDecoration: 'none',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: showTooltip ? 'scale(1.08)' : 'scale(1)',
        }}
        title="Contactez-nous sur WhatsApp"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <i className="fab fa-whatsapp" />
      </a>
    </div>
  );
}
