'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faClock, faCheck, faShieldAlt, faCalculator, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function PriceEstimator() {
  const [vehicleType, setVehicleType] = useState('citadine');
  const [selectedService, setSelectedService] = useState('visite');
  const [options, setOptions] = useState({
    freins: false,
    clim: false,
    points50: false,
  });

  const vehicleTypes = [
    { id: 'citadine', label: 'Citadine', sub: 'Clio, 208, Logan...', multiplier: 1.0 },
    { id: 'berline', label: 'Berline', sub: 'Golf, Megane, C-Class...', multiplier: 1.12 },
    { id: 'suv', label: 'SUV & 4x4', sub: 'Duster, RAV4, Touareg...', multiplier: 1.25 },
    { id: 'utilitaire', label: 'Utilitaire', sub: 'Kangoo, Transit, Partner...', multiplier: 1.35 },
  ];

  const services = [
    {
      id: 'visite',
      name: 'Visite Technique Réglementaire',
      basePrice: 370,
      duration: '45 min',
      checks: ['Contrôle freinage & suspension', 'Émissions polluantes & échappement', 'Éclairage & signalisation', 'Direction & châssis'],
    },
    {
      id: 'vidange',
      name: 'Vidange Complète & 3 Filtres',
      basePrice: 280,
      duration: '40 min',
      checks: ['Huile moteur 5W40 certifiée', 'Remplacement filtre à huile', 'Nettoyage filtre à air', 'Mise à niveau des fluides'],
    },
    {
      id: 'pneus',
      name: 'Pack Pneumatiques & Géométrie',
      basePrice: 420,
      duration: '50 min',
      checks: ['Vérification usure & pression', 'Équilibrage électronique 4 roues', 'Réglage parallélisme', 'Contrôle rotules & roulements'],
    },
  ];

  const currentVehicle = vehicleTypes.find((v) => v.id === vehicleType) || vehicleTypes[0];
  const currentService = services.find((s) => s.id === selectedService) || services[0];

  const optionsCost =
    (options.freins ? 80 : 0) +
    (options.clim ? 120 : 0) +
    (options.points50 ? 150 : 0);

  const totalPrice = Math.round(currentService.basePrice * currentVehicle.multiplier + optionsCost);

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section style={{ background: '#0a0a0a', padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="va-label">Estimation Rapide</span>
            <h2 className="va-title">
              Simulateur de <span>Tarif en Ligne</span>
            </h2>
            <p style={{ color: '#888', fontSize: '0.92rem', maxWidth: '580px', margin: '0 auto' }}>
              Estimez le coût précis de votre contrôle technique ou de votre entretien selon votre type de véhicule avant même de vous déplacer.
            </p>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Options Column */}
          <div className="col-lg-7">
            <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '28px' }}>
              {/* Step 1: Vehicle type */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>
                  1. Choisissez votre catégorie de véhicule
                </label>
                <div className="row g-2">
                  {vehicleTypes.map((v) => {
                    const active = vehicleType === v.id;
                    return (
                      <div key={v.id} className="col-6 col-sm-3">
                        <button
                          onClick={() => setVehicleType(v.id)}
                          style={{
                            width: '100%',
                            background: active ? 'rgba(231,76,60,0.15)' : '#1a1a1a',
                            border: `1.5px solid ${active ? '#E74C3C' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '10px',
                            padding: '12px 8px',
                            color: '#fff',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s',
                          }}
                        >
                          <FontAwesomeIcon icon={faCar} style={{ color: active ? '#E74C3C' : '#666', fontSize: '1.2rem', marginBottom: '6px' }} />
                          <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{v.label}</div>
                          <div style={{ fontSize: '0.68rem', color: '#777', marginTop: '2px' }}>{v.sub}</div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Service */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>
                  2. Sélectionnez la prestation
                </label>
                <div className="row g-2">
                  {services.map((s) => {
                    const active = selectedService === s.id;
                    return (
                      <div key={s.id} className="col-12">
                        <button
                          onClick={() => setSelectedService(s.id)}
                          style={{
                            width: '100%',
                            background: active ? 'rgba(231,76,60,0.12)' : '#1a1a1a',
                            border: `1.5px solid ${active ? '#E74C3C' : 'rgba(255,255,255,0.06)'}`,
                            borderRadius: '10px',
                            padding: '14px 18px',
                            color: '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s',
                            textAlign: 'left',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: active ? '#fff' : '#ddd' }}>{s.name}</div>
                            <div style={{ fontSize: '0.74rem', color: '#777', marginTop: '2px' }}>
                              <FontAwesomeIcon icon={faClock} style={{ marginRight: '4px' }} />
                              Durée estimée : {s.duration}
                            </div>
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#E74C3C', fontFamily: "'Barlow Condensed', sans-serif" }}>
                            dès {s.basePrice} MAD
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Optional extras */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>
                  3. Options &amp; Diagnostics complémentaires
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { key: 'freins', label: 'Diagnostic approfondi freinage & liquide de frein', price: '+80 MAD' },
                    { key: 'clim', label: 'Traitement antibactérien & recharge climatisation', price: '+120 MAD' },
                    { key: 'points50', label: 'Bilan complet 50 points de sécurité pré-visite', price: '+150 MAD' },
                  ].map((opt) => (
                    <label
                      key={opt.key}
                      onClick={() => toggleOption(opt.key)}
                      style={{
                        background: options[opt.key] ? 'rgba(46,204,113,0.1)' : '#1a1a1a',
                        border: `1px solid ${options[opt.key] ? 'rgba(46,204,113,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        borderRadius: '8px',
                        padding: '10px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        userSelect: 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: options[opt.key] ? '#fff' : '#bbb' }}>
                        <input
                          type="checkbox"
                          checked={options[opt.key]}
                          onChange={() => {}}
                          style={{ accentColor: '#2ecc71', width: '16px', height: '16px' }}
                        />
                        {opt.label}
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: options[opt.key] ? '#2ecc71' : '#777' }}>
                        {opt.price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Result Summary Card */}
          <div className="col-lg-5">
            <div
              style={{
                background: 'linear-gradient(145deg, #161616 0%, #1a0f0f 100%)',
                border: '1.5px solid rgba(192,57,43,0.3)',
                borderRadius: '14px',
                padding: '28px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <FontAwesomeIcon icon={faCalculator} style={{ color: '#E74C3C', fontSize: '1rem' }} />
                  <span style={{ fontSize: '0.78rem', color: '#E74C3C', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Devis Indicatif Immédiat
                  </span>
                </div>

                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: '1.4rem', marginBottom: '4px' }}>
                  {currentService.name}
                </h3>
                <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '20px' }}>
                  Véhicule : <strong style={{ color: '#fff' }}>{currentVehicle.label}</strong> • Durée : <strong style={{ color: '#fff' }}>{currentService.duration}</strong>
                </div>

                {/* Price Display */}
                <div
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Montant Total Estimé (TTC)</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '3rem', fontWeight: 900, color: '#E74C3C', lineHeight: 1.1, margin: '6px 0' }}>
                    {totalPrice} <span style={{ fontSize: '1.4rem' }}>MAD</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#2ecc71', fontWeight: 600 }}>
                    <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '4px' }} />
                    Tarif garanti sans frais cachés • Centre Fès
                  </div>
                </div>

                {/* Included Checks List */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#777', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '10px' }}>
                    Contrôles inclus dans la formule :
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {currentService.checks.map((chk, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#ccc' }}>
                        <FontAwesomeIcon icon={faCheck} style={{ color: '#2ecc71', fontSize: '0.7rem' }} />
                        {chk}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href="/rendezvous"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: 'linear-gradient(135deg,#C0392B,#E74C3C)',
                  color: '#fff',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 8px 25px rgba(192,57,43,0.4)',
                  transition: 'all 0.3s',
                }}
              >
                Réserver à ce tarif
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
