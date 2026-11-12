"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faMapMarkerAlt, faClock, faPhone, faBars, faTimes, faTachometerAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentMin = hours * 60 + minutes;
      const open = day !== 0 && currentMin >= 510 && currentMin < 1110;
      setIsOpen(open);
    };
    checkOpenStatus();
    const timer = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const links = [
    { href: '/accueil', label: 'Accueil' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  const socials = [
    { iconClass: 'fab fa-facebook-f', href: 'https://web.facebook.com/' },
    { iconClass: 'fab fa-instagram', href: 'https://www.instagram.com/ali.mejber/' },
    { iconClass: 'fab fa-twitter', href: 'https://x.com/' },
    { iconClass: 'fab fa-linkedin-in', href: 'https://www.linkedin.com/in/ali-mejber-52845033b' },
  ];

  return (
    <>
      {/* TOP BAR */}
      <div className="d-none d-lg-block" style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '6px 0' }}>
        <div className="container-fluid px-5">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#C0392B', fontSize: '0.65rem' }} />
                Route Ain Chkef, Fès
              </span>
              <span style={{ color: '#666', fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FontAwesomeIcon icon={faClock} style={{ color: '#C0392B', fontSize: '0.65rem' }} />
                Lun – Sam : 08h30 – 18h30
              </span>
              {/* Statut Centre En Direct */}
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '2px 9px',
                borderRadius: '20px',
                background: isOpen ? 'rgba(46,204,113,0.12)' : 'rgba(243,156,18,0.12)',
                border: `1px solid ${isOpen ? 'rgba(46,204,113,0.35)' : 'rgba(243,156,18,0.35)'}`,
                color: isOpen ? '#2ecc71' : '#f39c12',
                fontSize: '0.68rem',
                fontWeight: 700
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isOpen ? '#2ecc71' : '#f39c12',
                  boxShadow: isOpen ? '0 0 8px #2ecc71' : 'none'
                }} />
                {isOpen ? 'Centre Ouvert (Fermeture 18h30)' : 'Centre Fermé (Ouverture 08h30)'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ color: '#999', fontSize: '0.73rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FontAwesomeIcon icon={faPhone} style={{ color: '#C0392B', fontSize: '0.65rem' }} />
                +212 770 145 404
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {socials.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer"
                    style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.58rem', textDecoration: 'none', transition: 'all 0.25s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#C0392B'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#555'; }}
                  >
                    <i className={s.iconClass} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: scrolled ? 'rgba(6,6,6,0.98)' : 'rgba(10,10,10,0.96)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.6)' : 'none',
        transition: 'all 0.35s',
      }}>
        <div className="container-fluid px-4 px-lg-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '62px' }}>

            {/* Brand */}
            <Link href="/accueil" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', boxShadow: '0 3px 12px rgba(192,57,43,0.4)', flexShrink: 0 }}>
                <FontAwesomeIcon icon={faCar} />
              </div>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.35rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                Valid<span style={{ color: '#E74C3C' }}>Auto</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="d-none d-lg-flex" style={{ alignItems: 'center', gap: '2px' }}>
              {links.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} style={{
                    padding: '7px 13px', borderRadius: '5px',
                    fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
                    color: isActive ? '#fff' : '#777',
                    background: isActive ? 'rgba(192,57,43,0.1)' : 'transparent',
                    borderBottom: `2px solid ${isActive ? '#E74C3C' : 'transparent'}`,
                    textDecoration: 'none', transition: 'all 0.25s',
                  }}>
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTAs — auth-aware */}
            <div className="d-none d-lg-flex" style={{ alignItems: 'center', gap: '8px' }}>
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '5px', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#ccc', border: '1px solid rgba(255,255,255,0.12)', textDecoration: 'none', transition: 'all 0.25s' }}>
                    <FontAwesomeIcon icon={faTachometerAlt} style={{ fontSize: '0.7rem', color: '#E74C3C' }} />
                    Mon Espace
                  </Link>
                  <button onClick={handleLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '5px', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#888', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer', transition: 'all 0.25s' }}>
                    <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '0.7rem' }} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" style={{ padding: '8px 14px', borderRadius: '5px', fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#888', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', transition: 'all 0.25s' }}>
                    Connexion
                  </Link>
                  <Link href="/rendezvous" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', color: '#fff', padding: '8px 16px', borderRadius: '5px', fontSize: '0.73rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 3px 12px rgba(192,57,43,0.35)', transition: 'all 0.3s' }}>
                    <FontAwesomeIcon icon={faCar} style={{ fontSize: '0.7rem' }} />
                    Prendre RDV
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button className="d-lg-none" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '5px', padding: '6px 10px', color: '#aaa', cursor: 'pointer', fontSize: '0.9rem' }}>
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
            </button>
          </div>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 0 14px' }}>
              {links.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 4px', color: pathname === link.href ? '#E74C3C' : '#999', fontSize: '0.83rem', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {link.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'block', marginTop: '12px', padding: '10px 16px', textAlign: 'center', background: 'rgba(192,57,43,0.1)', color: '#E74C3C', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(192,57,43,0.25)' }}>
                    Mon Espace
                  </Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{ display: 'block', width: '100%', marginTop: '8px', padding: '10px 16px', textAlign: 'center', background: 'transparent', color: '#888', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link href="/rendezvous" onClick={() => setMenuOpen(false)} style={{ display: 'block', marginTop: '12px', padding: '10px 16px', textAlign: 'center', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', color: '#fff', borderRadius: '5px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                  Prendre un rendez-vous
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
