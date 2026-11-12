'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faQuoteLeft, 
  faCheckCircle, 
  faCar, 
  faUserCheck, 
  faThumbsUp,
  faPenAlt,
  faTimes,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

export default function TestimonialsSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({
    nom: '',
    ville: 'Fès',
    vehicule: '',
    service: 'Visite technique',
    note: 5,
    commentaire: ''
  });
  const [successToast, setSuccessToast] = useState(false);

  const initialReviews = [
    {
      id: 1,
      nom: 'Yassine El Amrani',
      ville: 'Fès (Route d\'Imouzzer)',
      initials: 'YA',
      vehicule: 'Volkswagen Golf 8',
      serviceKey: 'visite',
      serviceLabel: 'Visite technique périodique',
      note: 5,
      date: 'Il y a 3 jours',
      commentaire: 'Rendez-vous pris en ligne à 10h, pris en charge dès mon arrivée sans aucune file d\'attente. L\'équipe est très professionnelle et j\'ai téléchargé mon bilan technique complet en PDF directement sur mon téléphone. Bravo ValidAuto !',
      verified: true
    },
    {
      id: 2,
      nom: 'Fatima-Zahra Benjelloun',
      ville: 'Fès (Narjiss)',
      initials: 'FB',
      vehicule: 'Peugeot 208 (2021)',
      serviceKey: 'vidange',
      serviceLabel: 'Contrôle Technique + Vidange',
      note: 5,
      date: 'Il y a 1 semaine',
      commentaire: 'Le simulateur de prix en ligne m\'a donné le tarif exact en Dirhams sans mauvaise surprise. Salle d\'attente propre et climatisée avec Wi-Fi. Les techniciens m\'ont expliqué chaque point vérifié. Je recommande à 100%.',
      verified: true
    },
    {
      id: 3,
      nom: 'Karim Tazi',
      ville: 'Fès (Ville Nouvelle)',
      initials: 'KT',
      vehicule: 'Dacia Duster 4x4',
      serviceKey: 'contre_visite',
      serviceLabel: 'Contre-visite de sécurité',
      note: 5,
      date: 'Il y a 2 semaines',
      commentaire: 'Après avoir réparé mes plaquettes de freins dans le délai réglementaire de 15 jours, la contre-visite a été validée en moins de 20 minutes. Gain de temps énorme grâce à la réservation horaire en ligne.',
      verified: true
    },
    {
      id: 4,
      nom: 'Driss Mansouri',
      ville: 'Fès (Atlas)',
      initials: 'DM',
      vehicule: 'Renault Clio 5',
      serviceKey: 'visite',
      serviceLabel: 'Bilan Sécurité & Antipollution',
      note: 5,
      date: 'Il y a 3 semaines',
      commentaire: 'Le suivi en direct par matricule sur le site est une idée géniale ! J\'ai pu suivre l\'avancement de l\'inspection de ma voiture depuis mon bureau. Service client très réactif sur WhatsApp.',
      verified: true
    }
  ];

  const [reviews, setReviews] = useState(initialReviews);

  const categories = [
    { key: 'all', label: 'Tous les avis (148)' },
    { key: 'visite', label: 'Visite Technique' },
    { key: 'vidange', label: 'Vidange & Entretien' },
    { key: 'contre_visite', label: 'Contre-visite' },
  ];

  const filteredReviews = reviews.filter(rev => {
    if (activeCategory === 'all') return true;
    return rev.serviceKey === activeCategory;
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.nom || !newReview.commentaire) return;

    const initials = newReview.nom
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const created = {
      id: Date.now(),
      nom: newReview.nom,
      ville: `${newReview.ville}`,
      initials: initials || 'CL',
      vehicule: newReview.vehicule || 'Véhicule particulier',
      serviceKey: newReview.service === 'Visite technique' ? 'visite' : newReview.service === 'Vidange' ? 'vidange' : 'contre_visite',
      serviceLabel: newReview.service,
      note: Number(newReview.note),
      date: 'À l\'instant',
      commentaire: newReview.commentaire,
      verified: true
    };

    setReviews([created, ...reviews]);
    setShowModal(false);
    setSuccessToast(true);
    setNewReview({ nom: '', ville: 'Fès', vehicule: '', service: 'Visite technique', note: 5, commentaire: '' });
    setTimeout(() => setSuccessToast(false), 5000);
  };

  return (
    <section style={{ background: '#0d0d0d', padding: '90px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container">

        {/* Success Toast */}
        {successToast && (
          <div style={{
            position: 'fixed',
            top: '30px',
            right: '30px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '1.2rem' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Merci pour votre avis !</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Votre retour d'expérience a été publié avec succès.</div>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="row align-items-end justify-content-between mb-5 gy-4">
          <div className="col-lg-7">
            <span className="va-label" style={{ 
              color: '#E74C3C', 
              fontSize: '0.85rem', 
              letterSpacing: '2px', 
              textTransform: 'uppercase', 
              fontWeight: 700, 
              display: 'inline-block',
              marginBottom: '8px'
            }}>
              <FontAwesomeIcon icon={faUserCheck} style={{ marginRight: '6px' }} />
              Retours d'Expérience Réels
            </span>
            <h2 className="va-title" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', color: '#fff', fontWeight: 800, margin: 0 }}>
              Ce que disent nos <span>clients vérifiés</span>
            </h2>
            <div style={{ width: '50px', height: '3px', background: 'linear-gradient(90deg, #C0392B, #FF6B35)', margin: '14px 0 16px', borderRadius: '2px' }} />
            <p style={{ color: '#aaa', margin: 0, fontSize: '0.95rem', maxWidth: '580px' }}>
              Plus de 150 automobilistes et gestionnaires de flottes à Fès nous font confiance pour leur sécurité automobile.
            </p>
          </div>

          {/* Rating Summary Widget */}
          <div className="col-lg-5 text-lg-end">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '20px',
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '16px 24px',
              borderRadius: '14px',
              textAlign: 'left'
            }}>
              <div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', lineHeight: 1, fontFamily: "'Barlow Condensed', sans-serif" }}>
                  4.9<span style={{ fontSize: '1.2rem', color: '#E74C3C' }}>/5</span>
                </div>
                <div style={{ display: 'flex', gap: '3px', color: '#FFB800', fontSize: '0.8rem', marginTop: '4px' }}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} />
                  ))}
                </div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '18px' }}>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>98.5% Recommandation</div>
                <div style={{ fontSize: '0.75rem', color: '#777', marginTop: '2px' }}>Basé sur 148 avis contrôlés</div>
                <div style={{ fontSize: '0.72rem', color: '#2ecc71', fontWeight: 600, marginTop: '3px' }}>
                  <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '4px' }} />
                  Certifié Agréé Fès
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills + Add Review Button */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div className="d-flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  padding: '7px 18px',
                  borderRadius: '30px',
                  border: activeCategory === cat.key ? '1px solid #E74C3C' : '1px solid rgba(255,255,255,0.12)',
                  background: activeCategory === cat.key ? 'linear-gradient(135deg, rgba(231,76,60,0.2), rgba(255,107,53,0.1))' : '#141414',
                  color: activeCategory === cat.key ? '#fff' : '#888',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '8px',
              background: 'rgba(231,76,60,0.15)',
              border: '1px solid rgba(231,76,60,0.4)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <FontAwesomeIcon icon={faPenAlt} style={{ color: '#E74C3C', fontSize: '0.8rem' }} />
            Donner mon avis
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="row g-4">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="col-lg-6">
              <div style={{
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                padding: '28px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, border-color 0.3s ease'
              }}>
                {/* Decorative Quote Watermark */}
                <FontAwesomeIcon 
                  icon={faQuoteLeft} 
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '24px',
                    fontSize: '2.4rem',
                    color: 'rgba(255,255,255,0.03)',
                    pointerEvents: 'none'
                  }} 
                />

                <div>
                  {/* Top line: stars + date */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ display: 'flex', gap: '3px', color: '#FFB800', fontSize: '0.85rem' }}>
                      {[...Array(rev.note)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} />
                      ))}
                    </div>
                    <span style={{ color: '#666', fontSize: '0.75rem', fontWeight: 500 }}>
                      {rev.date}
                    </span>
                  </div>

                  {/* Comment */}
                  <p style={{
                    color: '#ddd',
                    fontSize: '0.92rem',
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                    marginBottom: '22px'
                  }}>
                    « {rev.commentaire} »
                  </p>
                </div>

                {/* Bottom Author Info */}
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      {rev.initials}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{rev.nom}</span>
                        {rev.verified && (
                          <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#2ecc71', fontSize: '0.75rem' }} title="Client vérifié" />
                        )}
                      </div>
                      <div style={{ color: '#777', fontSize: '0.75rem' }}>{rev.ville}</div>
                    </div>
                  </div>

                  {/* Vehicle & Service Tag */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      color: '#bbb',
                      fontWeight: 600
                    }}>
                      <FontAwesomeIcon icon={faCar} style={{ color: '#E74C3C', fontSize: '0.7rem' }} />
                      {rev.vehicule}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#E74C3C', fontWeight: 600, marginTop: '3px' }}>
                      {rev.serviceLabel}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Déposer un avis */}
        {showModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(5px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '520px',
              padding: '30px',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              <h4 style={{ color: '#fff', fontWeight: 800, marginBottom: '6px' }}>Partagez votre expérience</h4>
              <p style={{ color: '#777', fontSize: '0.85rem', marginBottom: '20px' }}>
                Votre avis aide les autres conducteurs et contribue à l'amélioration continue de nos contrôles.
              </p>

              <form onSubmit={handleSubmitReview}>
                <div className="mb-3">
                  <label style={{ color: '#aaa', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Votre nom complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Anas Benali"
                    value={newReview.nom}
                    onChange={(e) => setNewReview({ ...newReview, nom: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1c1c1c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label style={{ color: '#aaa', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Modèle Véhicule</label>
                    <input
                      type="text"
                      placeholder="Ex: Dacia Logan"
                      value={newReview.vehicule}
                      onChange={(e) => setNewReview({ ...newReview, vehicule: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1c1c1c',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <label style={{ color: '#aaa', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Prestation</label>
                    <select
                      value={newReview.service}
                      onChange={(e) => setNewReview({ ...newReview, service: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#1c1c1c',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.88rem'
                      }}
                    >
                      <option value="Visite technique">Visite technique</option>
                      <option value="Vidange">Vidange & Filtres</option>
                      <option value="Contre-visite">Contre-visite</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label style={{ color: '#aaa', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Note globale</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[5, 4, 3, 2, 1].map((note) => (
                      <button
                        type="button"
                        key={note}
                        onClick={() => setNewReview({ ...newReview, note })}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: newReview.note === note ? '1px solid #FFB800' : '1px solid rgba(255,255,255,0.1)',
                          background: newReview.note === note ? 'rgba(255,184,0,0.15)' : '#1c1c1c',
                          color: newReview.note === note ? '#FFB800' : '#888',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        {note} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label style={{ color: '#aaa', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Votre commentaire d'évaluation *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Partagez votre avis sur l'accueil, les techniciens, les délais..."
                    value={newReview.commentaire}
                    onChange={(e) => setNewReview({ ...newReview, commentaire: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#1c1c1c',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      resize: 'none'
                    }}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: '9px 18px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#888',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '9px 22px',
                      background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(231,76,60,0.35)'
                    }}
                  >
                    Publier mon avis
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
