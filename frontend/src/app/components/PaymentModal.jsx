'use client';
import { useState, useEffect } from 'react';

/* ── Prix par service ── */
const SERVICE_PRICES = {
  'Visite technique': 350,
  'Vidange':          280,
  'Pneumatiques':     450,
  'default':          300,
};

/* ── Formatteur numéro de carte (XXXX XXXX XXXX XXXX) ── */
function formatCard(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

/* ── Détection réseau carte ── */
function detectNetwork(num) {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n))   return { name: 'VISA',       color: '#1a1f71' };
  if (/^5[1-5]/.test(n)) return { name: 'MASTERCARD', color: '#eb001b' };
  if (/^3[47]/.test(n))  return { name: 'AMEX',       color: '#2e77bc' };
  return { name: 'CARTE',       color: '#334155' };
}

export default function PaymentModal({ open, onClose, onSuccess, service, rdvData }) {
  const price = SERVICE_PRICES[service] || SERVICE_PRICES['default'];

  const [step, setStep]         = useState('form');   // form | processing | success | error
  const [flipped, setFlipped]   = useState(false);
  const [card, setCard]         = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [errors, setErrors]     = useState({});
  const [progress, setProgress] = useState(0);

  /* Reset quand modal s'ouvre */
  useEffect(() => {
    if (open) {
      setStep('form');
      setCard({ number: '', name: '', expiry: '', cvv: '' });
      setErrors({});
      setProgress(0);
      setFlipped(false);
    }
  }, [open]);

  /* Animation progress bar pendant processing */
  useEffect(() => {
    if (step !== 'processing') return;
    let val = 0;
    const interval = setInterval(() => {
      val += Math.random() * 18 + 5;
      if (val >= 100) {
        val = 100;
        clearInterval(interval);
        setTimeout(() => setStep('success'), 400);
      }
      setProgress(Math.min(val, 100));
    }, 180);
    return () => clearInterval(interval);
  }, [step]);

  if (!open) return null;

  const network = detectNetwork(card.number);

  function validate() {
    const e = {};
    const raw = card.number.replace(/\s/g, '');
    if (raw.length < 16)        e.number  = 'Numéro de carte incomplet';
    if (!card.name.trim())      e.name    = 'Nom du titulaire requis';
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = 'Format MM/AA requis';
    if (card.cvv.length < 3)    e.cvv     = 'CVV invalide';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePay() {
    if (!validate()) return;
    setStep('processing');
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '11px 14px',
    background: '#1c1c1c', border: `1.5px solid ${errors[field] ? '#e74c3c' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '8px', color: '#fff', fontSize: '0.9rem',
    outline: 'none', transition: 'border 0.2s', fontFamily: field === 'number' ? 'monospace' : 'inherit',
  });
  const labelStyle = { fontSize: '0.7rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px', display: 'block' };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200000,
      background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }} onClick={() => step === 'form' && onClose()}>
      <div style={{
        background: '#111', borderRadius: '18px', width: '100%', maxWidth: '460px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(192,57,43,0.1)',
        border: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden', animation: 'fadeIn 0.25s ease'
      }} onClick={e => e.stopPropagation()}>

        {/* ── HEADER ── */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'linear-gradient(180deg, #1a1a1a, #141414)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(192,57,43,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
              💳
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Paiement Sécurisé</div>
              <div style={{ fontSize: '0.68rem', color: '#666' }}>🔒 SSL 256-bit • Connexion chiffrée</div>
            </div>
          </div>
          {step === 'form' && (
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#555', fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1 }}>✕</button>
          )}
        </div>

        {/* ── ÉTAPE 1 : FORMULAIRE ── */}
        {step === 'form' && (
          <div style={{ padding: '24px' }}>

            {/* Récap commande */}
            <div style={{
              background: '#1a1a1a', borderRadius: '10px', padding: '14px 16px', marginBottom: '22px',
              border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ color: '#888', fontSize: '0.72rem', marginBottom: '3px' }}>Service réservé</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{service || 'Visite technique'}</div>
                {rdvData?.date && <div style={{ color: '#666', fontSize: '0.72rem', marginTop: '2px' }}>📅 {new Date(rdvData.date).toLocaleDateString('fr-FR')} à {rdvData.time || rdvData.hour}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>Montant total</div>
                <div style={{
                  fontSize: '1.6rem', fontWeight: 900, color: '#E74C3C',
                  fontFamily: "'Barlow Condensed', sans-serif"
                }}>{price} MAD</div>
              </div>
            </div>

            {/* Card Preview (mini) */}
            <div style={{ perspective: '800px', marginBottom: '22px' }}>
              <div style={{
                width: '100%', height: '140px', borderRadius: '12px', position: 'relative',
                transformStyle: 'preserve-3d', transition: 'transform 0.55s ease',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}>
                {/* Front */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '12px', padding: '16px 20px',
                  background: `linear-gradient(135deg, ${network.color} 0%, #0f172a 100%)`,
                  backfaceVisibility: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>ValidAuto Pay</div>
                    <div style={{ fontWeight: 900, color: '#fff', fontSize: '0.9rem', letterSpacing: '1px' }}>{network.name}</div>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: '#fff', letterSpacing: '2px', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
                    {card.number || '•••• •••• •••• ••••'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Titulaire</div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.5px' }}>{card.name || 'NOM PRÉNOM'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Expire</div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>{card.expiry || 'MM/AA'}</div>
                    </div>
                  </div>
                </div>
                {/* Back */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                }}>
                  <div style={{ height: '34px', background: '#000', margin: '0 0 12px' }} />
                  <div style={{ margin: '0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '32px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px' }} />
                    <div style={{ background: '#fff', color: '#0f172a', fontWeight: 900, fontSize: '0.85rem', padding: '6px 12px', borderRadius: '4px', fontFamily: 'monospace', minWidth: '50px', textAlign: 'center' }}>
                      {card.cvv || '•••'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '10px', marginRight: '16px', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>CVV</div>
                </div>
              </div>
            </div>

            {/* Champs carte */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Numéro */}
              <div>
                <label style={labelStyle}>Numéro de carte</label>
                <input
                  type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
                  value={card.number} maxLength={19}
                  style={inputStyle('number')}
                  onChange={e => setCard(p => ({ ...p, number: formatCard(e.target.value) }))}
                  onFocus={() => setFlipped(false)}
                />
                {errors.number && <div style={{ color: '#e74c3c', fontSize: '0.7rem', marginTop: '4px' }}>⚠ {errors.number}</div>}
              </div>

              {/* Nom */}
              <div>
                <label style={labelStyle}>Nom du titulaire</label>
                <input
                  type="text" placeholder="PRÉNOM NOM"
                  value={card.name}
                  style={{ ...inputStyle('name'), textTransform: 'uppercase' }}
                  onChange={e => setCard(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                  onFocus={() => setFlipped(false)}
                />
                {errors.name && <div style={{ color: '#e74c3c', fontSize: '0.7rem', marginTop: '4px' }}>⚠ {errors.name}</div>}
              </div>

              {/* Expiry + CVV */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Date d'expiration</label>
                  <input
                    type="text" placeholder="MM/AA" maxLength={5}
                    value={card.expiry}
                    style={inputStyle('expiry')}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                      setCard(p => ({ ...p, expiry: v }));
                    }}
                    onFocus={() => setFlipped(false)}
                  />
                  {errors.expiry && <div style={{ color: '#e74c3c', fontSize: '0.7rem', marginTop: '4px' }}>⚠ {errors.expiry}</div>}
                </div>
                <div>
                  <label style={labelStyle}>CVV / CVC</label>
                  <input
                    type="text" inputMode="numeric" placeholder="•••" maxLength={4}
                    value={card.cvv}
                    style={inputStyle('cvv')}
                    onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    onFocus={() => setFlipped(true)}
                    onBlur={() => setFlipped(false)}
                  />
                  {errors.cvv && <div style={{ color: '#e74c3c', fontSize: '0.7rem', marginTop: '4px' }}>⚠ {errors.cvv}</div>}
                </div>
              </div>
            </div>

            {/* Modes de paiement acceptés */}
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', margin: '18px 0 16px', opacity: 0.55 }}>
              {['VISA', 'MC', 'AMEX', 'CMI', 'PayPal'].map(m => (
                <span key={m} style={{ fontSize: '0.6rem', fontWeight: 800, background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '3px 8px', color: '#aaa', letterSpacing: '0.5px' }}>{m}</span>
              ))}
            </div>

            <button
              onClick={handlePay}
              style={{
                width: '100%', padding: '14px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                color: '#fff', border: 'none', fontWeight: 800, fontSize: '1rem',
                cursor: 'pointer', boxShadow: '0 6px 20px rgba(192,57,43,0.45)',
                letterSpacing: '0.3px', transition: 'all 0.2s',
              }}
            >
              🔒 Payer {price} MAD maintenant
            </button>
          </div>
        )}

        {/* ── ÉTAPE 2 : TRAITEMENT ── */}
        {step === 'processing' && (
          <div style={{ padding: '50px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⚙️</span>
            </div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>Traitement en cours…</div>
            <div style={{ color: '#888', fontSize: '0.82rem', marginBottom: '28px' }}>Vérification auprès de votre banque</div>
            <div style={{ background: '#1a1a1a', borderRadius: '100px', height: '8px', overflow: 'hidden', marginBottom: '14px' }}>
              <div style={{
                height: '100%', borderRadius: '100px',
                background: 'linear-gradient(90deg, #C0392B, #E74C3C, #FF6B35)',
                width: `${progress}%`, transition: 'width 0.2s ease'
              }} />
            </div>
            <div style={{ color: '#555', fontSize: '0.75rem' }}>{Math.round(progress)}% • Ne pas fermer cette fenêtre</div>
          </div>
        )}

        {/* ── ÉTAPE 3 : SUCCÈS ── */}
        {step === 'success' && (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(46,204,113,0.12)', border: '2px solid #2ecc71',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', margin: '0 auto 20px', animation: 'bounceIn 0.5s ease'
            }}>
              ✅
            </div>
            <div style={{ fontWeight: 900, color: '#fff', fontSize: '1.3rem', marginBottom: '6px' }}>Paiement validé !</div>
            <div style={{ color: '#2ecc71', fontWeight: 700, fontSize: '0.95rem', marginBottom: '18px' }}>{price} MAD débité avec succès</div>
            <div style={{ background: '#1a1a1a', borderRadius: '10px', padding: '14px 16px', textAlign: 'left', marginBottom: '22px', border: '1px solid rgba(46,204,113,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                <span style={{ color: '#777' }}>Référence transaction :</span>
                <strong style={{ color: '#fff', fontFamily: 'monospace' }}>VA-{Date.now().toString().slice(-8)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                <span style={{ color: '#777' }}>Service :</span>
                <span style={{ color: '#bbb' }}>{service}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#777' }}>Carte utilisée :</span>
                <span style={{ color: '#bbb', fontFamily: 'monospace' }}>•••• {card.number.slice(-4) || '****'}</span>
              </div>
            </div>
            <button
              onClick={onSuccess}
              style={{
                width: '100%', padding: '13px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.95rem',
                cursor: 'pointer', boxShadow: '0 6px 20px rgba(16,185,129,0.3)'
              }}
            >
              Confirmer et accéder à mon espace →
            </button>
          </div>
        )}

        {/* Sécurité footer */}
        {step === 'form' && (
          <div style={{ padding: '10px 24px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#3a3a3a' }}>
              🔐 Paiement sécurisé par chiffrement SSL/TLS 256-bit • ValidAuto SARL © {new Date().getFullYear()}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounceIn {
          0%   { transform: scale(0.4); opacity:0; }
          60%  { transform: scale(1.1); opacity:1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
