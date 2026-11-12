'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCar, faCalendarAlt, faClock, faCheckCircle, faHourglassHalf, faTimesCircle, faFileAlt, faTools } from '@fortawesome/free-solid-svg-icons';

export default function QuickTracker() {
  const [matricule, setMatricule] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (plateToSearch) => {
    const query = plateToSearch || matricule;
    if (!query || !query.trim()) {
      setError('Veuillez saisir un matricule.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tracker?matricule=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Aucun dossier trouvé pour ce matricule.');
      } else {
        setResult(data);
        if (plateToSearch) setMatricule(plateToSearch);
      }
    } catch {
      setError('Impossible de joindre le serveur. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'confirmé':
        return {
          bg: 'rgba(46, 204, 113, 0.15)',
          color: '#2ecc71',
          border: 'rgba(46, 204, 113, 0.4)',
          icon: faCheckCircle,
          text: 'Rendez-vous Confirmé',
        };
      case 'annulé':
        return {
          bg: 'rgba(231, 76, 60, 0.15)',
          color: '#e74c3c',
          border: 'rgba(231, 76, 60, 0.4)',
          icon: faTimesCircle,
          text: 'Rendez-vous Annulé',
        };
      default:
        return {
          bg: 'rgba(255, 107, 53, 0.15)',
          color: '#FF6B35',
          border: 'rgba(255, 107, 53, 0.4)',
          icon: faHourglassHalf,
          text: 'En Attente de Validation',
        };
    }
  };

  return (
    <section style={{ background: '#0f0f0f', padding: '70px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9 text-center mb-4">
            <span className="va-label">Service Direct</span>
            <h2 className="va-title">
              Suivi Express <span>par Matricule</span>
            </h2>
            <p style={{ color: '#888', fontSize: '0.92rem', maxWidth: '580px', margin: '0 auto' }}>
              Vérifiez en temps réel l'avancement du contrôle technique et la disponibilité du bilan de votre véhicule sans avoir besoin de vous connecter.
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Input Search Box */}
            <div
              style={{
                background: '#151515',
                border: '1.5px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                transition: 'border-color 0.3s',
              }}
            >
              <div style={{ paddingLeft: '14px', color: '#E74C3C', fontSize: '1.1rem' }}>
                <FontAwesomeIcon icon={faCar} />
              </div>
              <input
                type="text"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                placeholder="Entrez votre matricule (ex: 12345-A-1, 67890-B-2)..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  width: '100%',
                  padding: '10px 6px',
                }}
              />
              <button
                onClick={() => handleTrack()}
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg,#C0392B,#E74C3C)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  padding: '12px 24px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(192,57,43,0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
                {loading ? 'Recherche...' : 'Vérifier'}
              </button>
            </div>

            {/* Helper Note */}
            <div style={{ marginTop: '12px', fontSize: '0.76rem', color: '#666', textAlign: 'center' }}>
              Format d'immatriculation : <strong>12345-A-1</strong> ou équivalent selon votre carte grise.
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  marginTop: '20px',
                  background: 'rgba(231,76,60,0.1)',
                  border: '1px solid rgba(231,76,60,0.3)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  color: '#e74c3c',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            {/* Result Card */}
            {result && (
              <div
                style={{
                  marginTop: '24px',
                  background: '#151515',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  padding: '24px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                  animation: 'fadeInUp 0.35s ease-out',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dossier Véhicule #{result.id}</span>
                    <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: '1.45rem', margin: '2px 0 0' }}>
                      {result.marque} ({result.year}) — <span style={{ color: '#E74C3C' }}>{result.matricule}</span>
                    </h4>
                  </div>
                  {(() => {
                    const badge = getStatusBadge(result.statut);
                    return (
                      <span
                        style={{
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          padding: '6px 14px',
                          borderRadius: '24px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <FontAwesomeIcon icon={badge.icon} />
                        {badge.text}
                      </span>
                    );
                  })()}
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <div style={{ background: '#1c1c1c', padding: '12px 14px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#777', textTransform: 'uppercase', marginBottom: '3px' }}>Prestation</div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                        <FontAwesomeIcon icon={faTools} style={{ color: '#E74C3C', marginRight: '6px' }} />
                        {result.service}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div style={{ background: '#1c1c1c', padding: '12px 14px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#777', textTransform: 'uppercase', marginBottom: '3px' }}>Date du Contrôle</div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                        <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#3498db', marginRight: '6px' }} />
                        {result.date} à {result.hour}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div style={{ background: '#1c1c1c', padding: '12px 14px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#777', textTransform: 'uppercase', marginBottom: '3px' }}>Propriétaire</div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                        {result.nom}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report alert */}
                <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FontAwesomeIcon icon={faFileAlt} style={{ color: result.has_report ? '#2ecc71' : '#888' }} />
                    {result.has_report ? (
                      <span style={{ color: '#2ecc71', fontWeight: 600 }}>Bilan technique complet émis et disponible dans votre Espace Client</span>
                    ) : (
                      <span>Bilan technique en cours de rédaction par nos inspecteurs</span>
                    )}
                  </div>
                  <a
                    href="/dashboard"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: '#fff',
                      padding: '6px 14px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    Accéder à mon espace →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
