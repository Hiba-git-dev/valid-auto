"use client";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
      {/* Top accent line */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #C0392B, #E74C3C, #FF6B35, #C0392B)', backgroundSize: '200%' }} />

      {/* Main footer content */}
      <div className="container" style={{ padding: '48px 0 32px' }}>
        <div className="row g-4">

          {/* Brand column */}
          <div className="col-lg-3 col-md-6">
            <Link href="/accueil" style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', textDecoration: 'none', marginBottom: '14px' }}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.85rem' }}>
                <FontAwesomeIcon icon={faCar} />
              </div>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                Valid<span style={{ color: '#E74C3C' }}>Auto</span>
              </span>
            </Link>
            <p style={{ color: '#666', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '16px' }}>
              Centre de contrôle technique agréé à Fès. 15 ans d'expérience au service de votre sécurité routière.
            </p>
            {/* Socials */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { cls: 'fab fa-facebook-f', href: 'https://web.facebook.com/' },
                { cls: 'fab fa-instagram', href: 'https://www.instagram.com/ali.mejber/' },
                { cls: 'fab fa-twitter', href: 'https://x.com/' },
                { cls: 'fab fa-linkedin-in', href: 'https://www.linkedin.com/in/ali-mejber-52845033b' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer"
                  style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#181818', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.65rem', textDecoration: 'none', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#C0392B'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#C0392B'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#181818'; e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  <i className={s.cls} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div className="col-lg-3 col-md-6">
            <h6 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              Contact
            </h6>
            {[
              { icon: faMapMarkerAlt, text: 'Route Ain Chkef, Fès' },
              { icon: faPhone, text: '+212 770 145 404' },
              { icon: faEnvelope, text: 'validauto@gmail.com' },
              { icon: faClock, text: 'Lun–Ven : 09h – 21h' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                <FontAwesomeIcon icon={item.icon} style={{ color: '#C0392B', fontSize: '0.72rem', marginTop: '3px', flexShrink: 0 }} />
                <span style={{ color: '#666', fontSize: '0.82rem' }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Links column */}
          <div className="col-lg-3 col-md-6">
            <h6 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              Services
            </h6>
            {[
              { label: 'Test diagnostique', href: '/services' },
              { label: 'Entretien moteur', href: '/services' },
              { label: 'Pneumatiques', href: '/services' },
              { label: 'Vidange', href: '/services' },
              { label: 'Prendre RDV', href: '/rendezvous' },
            ].map((link, i) => (
              <Link key={i} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#666', fontSize: '0.82rem', marginBottom: '8px', textDecoration: 'none', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#E74C3C'; e.currentTarget.style.paddingLeft = '4px'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.paddingLeft = '0'; }}
              >
                <i className="fa fa-angle-right" style={{ fontSize: '0.65rem', color: '#C0392B' }} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Newsletter column */}
          <div className="col-lg-3 col-md-6">
            <h6 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              Newsletter
            </h6>
            <p style={{ color: '#666', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '14px' }}>
              Recevez nos offres et actualités directement dans votre boîte mail.
            </p>
            <div style={{ display: 'flex', background: '#181818', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
              <input
                type="email"
                placeholder="Votre email"
                style={{ flex: 1, background: 'transparent', border: 'none', padding: '10px 12px', color: '#ccc', fontSize: '0.78rem', outline: 'none' }}
              />
              <button style={{ background: 'linear-gradient(135deg,#C0392B,#E74C3C)', border: 'none', padding: '10px 14px', color: '#fff', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.25s' }}>
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 0' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <span style={{ color: '#444', fontSize: '0.75rem' }}>
                © {new Date().getFullYear()} <a href="#" style={{ color: '#C0392B', textDecoration: 'none' }}>ValidAuto</a>. Tous droits réservés.
              </span>
            </div>
            <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {[
                  { label: 'Accueil', href: '/accueil' },
                  { label: 'Services', href: '/services' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'FAQs', href: '/contact' },
                ].map((l, i) => (
                  <a key={i} href={l.href} style={{ color: '#444', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#E74C3C'}
                    onMouseLeave={e => e.currentTarget.style.color = '#444'}
                  >{l.label}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
