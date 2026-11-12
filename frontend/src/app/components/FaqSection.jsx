'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faChevronUp, 
  faQuestionCircle, 
  faFileAlt, 
  faClock, 
  faExclamationTriangle, 
  faFilePdf, 
  faCreditCard,
  faCalendarCheck,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = [
    {
      id: 1,
      category: 'documents',
      icon: faFileAlt,
      categoryLabel: 'Documents requis',
      question: 'Quels documents dois-je obligatoirement présenter lors de la visite technique ?',
      answer: 'Pour passer votre contrôle technique en toute conformité, vous devez présenter l\'original de la Carte Grise (ou récépissé provisoire en cours de validité), ainsi que votre attestation d\'assurance automobile valide. Si le conducteur n\'est pas le propriétaire légal désigné, une procuration légalisée accompagnée d\'une copie de la CIN du propriétaire peut être requise.',
      badge: 'Essentiel'
    },
    {
      id: 2,
      category: 'visite',
      icon: faClock,
      categoryLabel: 'Déroulement & Délais',
      question: 'Combien de temps dure l\'intervention dans votre centre de contrôle ?',
      answer: 'L\'inspection standard dure en moyenne entre 35 et 45 minutes. Ce temps permet à nos techniciens certifiés de tester rigoureusement l\'ensemble des organes de sécurité (freinage, suspension, direction, feux, carrosserie et mesures d\'émissions polluantes). Vous pouvez patienter confortablement dans notre espace client équipé de Wi-Fi.',
      badge: '40 min'
    },
    {
      id: 3,
      category: 'visite',
      icon: faExclamationTriangle,
      categoryLabel: 'Contre-visite',
      question: 'Que se passe-t-il si mon véhicule présente des défaillances (Contre-visite) ?',
      answer: 'Si une anomalie majeure ou critique est détectée sur vos organes de sécurité, vous bénéficiez d\'un délai légal de 15 jours calendaires pour effectuer les réparations nécessaires dans le garage de votre choix et vous représenter dans notre centre pour valider la contre-visite.',
      badge: 'Réglementation'
    },
    {
      id: 4,
      category: 'rapports',
      icon: faFilePdf,
      categoryLabel: 'Rapports & Bilans',
      question: 'Comment consulter et télécharger mon rapport technique d\'inspection ?',
      answer: 'Dès la clôture du contrôle, votre procès-verbal et bilan technique sont numérisés. Vous pouvez les télécharger directement en format PDF sécurisé depuis votre Espace Client ValidAuto ou immédiatement via notre barre de Suivi Express en renseignant simplement votre numéro d\'immatriculation.',
      badge: 'Format PDF'
    },
    {
      id: 5,
      category: 'paiement',
      icon: faCreditCard,
      categoryLabel: 'Paiement & Tarifs',
      question: 'Quels sont les modes de paiement acceptés au centre ?',
      answer: 'Nous acceptons les règlements en espèces (avec délivrance immédiate d\'une facture conforme), par Carte Bancaire nationale et internationale (TPE sécurisé CMI), ainsi que par virement bancaire pour nos clients professionnels ou flottes d\'entreprises.',
      badge: 'Flexible'
    },
    {
      id: 6,
      category: 'rendezvous',
      icon: faCalendarCheck,
      categoryLabel: 'Réservation en ligne',
      question: 'Puis-je annuler ou déplacer un rendez-vous déjà réservé ?',
      answer: 'Oui, la modification ou l\'annulation de votre rendez-vous est totalement gratuite. Connectez-vous simplement à votre Espace Client et ajustez votre créneau horaire jusqu\'à 2 heures avant l\'heure prévue. Notre équipe sera automatiquement notifiée de votre changement.',
      badge: 'Sans frais'
    }
  ];

  const categories = [
    { key: 'all', label: 'Toutes les questions' },
    { key: 'documents', label: 'Documents' },
    { key: 'visite', label: 'Contrôle & Délais' },
    { key: 'rapports', label: 'Bilans & PDF' },
    { key: 'paiement', label: 'Paiement' },
  ];

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

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
            <FontAwesomeIcon icon={faQuestionCircle} style={{ marginRight: '6px' }} />
            Aide & Informations Pratiques
          </span>
          <h2 className="va-title" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', color: '#fff', fontWeight: 800 }}>
            Questions <span>Fréquentes</span>
          </h2>
          <div style={{ width: '50px', height: '3px', background: 'linear-gradient(90deg, #C0392B, #FF6B35)', margin: '12px auto 20px', borderRadius: '2px' }} />
          <p style={{ color: '#aaa', maxWidth: '620px', margin: '0 auto', fontSize: '0.95rem' }}>
            Retrouvez les réponses claires aux questions les plus courantes sur le contrôle technique, les documents exigés et nos services.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="row g-3 justify-content-between align-items-center mb-4">
          {/* Category Pills */}
          <div className="col-lg-8 d-flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setOpenIndex(0); }}
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

          {/* Search Input */}
          <div className="col-lg-4">
            <div style={{ position: 'relative' }}>
              <FontAwesomeIcon 
                icon={faSearch} 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: '0.85rem' }} 
              />
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 16px 9px 42px',
                  background: '#141414',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '30px',
                  color: '#fff',
                  fontSize: '0.84rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#E74C3C'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
          </div>
        </div>

        {/* Accordion List */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {filteredFaqs.length === 0 ? (
              <div style={{
                background: '#141414',
                padding: '40px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px dashed rgba(255,255,255,0.1)'
              }}>
                <FontAwesomeIcon icon={faQuestionCircle} style={{ fontSize: '2rem', color: '#555', marginBottom: '12px' }} />
                <p style={{ color: '#888', margin: 0 }}>Aucune question ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {filteredFaqs.map((item, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: '#141414',
                        border: isOpen ? '1px solid rgba(231,76,60,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        boxShadow: isOpen ? '0 8px 30px rgba(231,76,60,0.08)' : 'none'
                      }}
                    >
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleAccordion(idx)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                          padding: '20px 24px',
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: isOpen ? 'linear-gradient(135deg, #C0392B, #E74C3C)' : 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isOpen ? '#fff' : '#E74C3C',
                            flexShrink: 0,
                            transition: 'all 0.3s ease'
                          }}>
                            <FontAwesomeIcon icon={item.icon} style={{ fontSize: '0.9rem' }} />
                          </div>
                          <div>
                            <span style={{
                              display: 'inline-block',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              color: '#E74C3C',
                              marginBottom: '2px'
                            }}>
                              {item.categoryLabel}
                            </span>
                            <h4 style={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              margin: 0,
                              color: isOpen ? '#fff' : '#ddd',
                              lineHeight: 1.4
                            }}>
                              {item.question}
                            </h4>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            color: '#aaa',
                            display: 'none',
                            '@media (min-width: 576px)': { display: 'inline-block' }
                          }}>
                            {item.badge}
                          </span>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: isOpen ? 'rgba(231,76,60,0.15)' : 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isOpen ? '#E74C3C' : '#888',
                            transition: 'all 0.2s'
                          }}>
                            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} style={{ fontSize: '0.75rem' }} />
                          </div>
                        </div>
                      </button>

                      {/* Accordion Body */}
                      {isOpen && (
                        <div style={{
                          padding: '0 24px 22px 74px',
                          color: '#aaa',
                          fontSize: '0.92rem',
                          lineHeight: 1.75,
                          borderTop: '1px solid rgba(255,255,255,0.04)',
                          marginTop: '4px',
                          paddingTop: '16px'
                        }}>
                          <p style={{ margin: 0 }}>
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Contact Footer Note */}
        <div className="text-center mt-5" style={{ color: '#777', fontSize: '0.88rem' }}>
          Vous ne trouvez pas la réponse à votre interrogation ?{' '}
          <a href="/contact" style={{ color: '#E74C3C', fontWeight: 600, textDecoration: 'none' }}>
            Contactez directement notre assistance technique &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
