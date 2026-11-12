'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setVisible(window.scrollY > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  const strokeDashoffset = 100 - scrollProgress;

  return (
    <button
      onClick={scrollToTop}
      title="Remonter en haut de la page"
      style={{
        position: 'fixed',
        bottom: '26px',
        left: '26px',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: '#141414',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 9990,
        boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
        transition: 'all 0.3s ease',
        padding: 0,
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(231,76,60,0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)';
      }}
    >
      {/* Circular SVG Progress Ring */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '48px',
          height: '48px',
          transform: 'rotate(-90deg)',
          pointerEvents: 'none'
        }}
        viewBox="0 0 36 36"
      >
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2.5"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#E74C3C"
          strokeWidth="2.5"
          strokeDasharray="100, 100"
          style={{ strokeDashoffset: strokeDashoffset, transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>

      <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '0.85rem', color: '#E74C3C' }} />
    </button>
  );
}
