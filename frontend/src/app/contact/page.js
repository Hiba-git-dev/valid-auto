'use client';
import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar, faMapMarkerAlt, faPhone, faEnvelope, faClock,
  faUser, faInbox, faPaperPlane, faArrowRight, faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

/* ── Floating input ── */
const Field = ({ icon, type = "text", name, placeholder, value, onChange, required = true }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: '14px' }}>
      <div style={{
        position: 'absolute', left: '16px', top: type === 'textarea' ? '16px' : '50%',
        transform: type === 'textarea' ? 'none' : 'translateY(-50%)',
        color: focused ? '#E74C3C' : '#3a3a3a', fontSize: '0.78rem',
        transition: 'color 0.3s', pointerEvents: 'none', zIndex: 1,
      }}>
        <FontAwesomeIcon icon={icon} />
      </div>
      {type === 'textarea' ? (
        <textarea
          name={name} placeholder={placeholder} value={value}
          onChange={onChange} required={required} rows={5}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', background: focused ? '#1e1e1e' : '#161616',
            border: `1.5px solid ${focused ? '#C0392B' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: '8px', color: '#f0f0f0', fontSize: '0.84rem',
            padding: '13px 16px 13px 42px', outline: 'none',
            transition: 'all 0.3s', resize: 'vertical',
            boxShadow: focused ? '0 0 0 3px rgba(192,57,43,0.1)' : 'none',
          }}
        />
      ) : (
        <input
          type={type} name={name} placeholder={placeholder} value={value}
          onChange={onChange} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', background: focused ? '#1e1e1e' : '#161616',
            border: `1.5px solid ${focused ? '#C0392B' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: '8px', color: '#f0f0f0', fontSize: '0.84rem',
            padding: '13px 16px 13px 42px', outline: 'none', transition: 'all 0.3s',
            boxShadow: focused ? '0 0 0 3px rgba(192,57,43,0.1)' : 'none',
          }}
        />
      )}
    </div>
  );
};

export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', message: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ nom: '', email: '', telephone: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const infoCards = [
    { icon: faMapMarkerAlt, label: 'Adresse', value: 'Route Ain Chkef, Fès, Maroc', color: '#C0392B' },
    { icon: faPhone,        label: 'Téléphone', value: '+212 770 145 404', color: '#E74C3C' },
    { icon: faEnvelope,     label: 'Email', value: 'validauto@gmail.com', color: '#FF6B35' },
    { icon: faClock,        label: 'Horaires', value: 'Lun–Ven : 09h – 21h\nSam–Dim : 09h – 17h', color: '#C0392B' },
  ];

  const emailCards = [
    { title: 'Réservation', email: 'validautoBooking@gmail.com', icon: faCar },
    { title: 'Général', email: 'validautoGeneral@gmail.com', icon: faInbox },
    { title: 'Technique', email: 'validautoTech@gmail.com', icon: faPhone },
  ];

  return (
    <>
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <div style={{
        position: 'relative', minHeight: '260px', display: 'flex', alignItems: 'center',
        backgroundImage: 'url(/img/carousel-bg-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.88), rgba(10,10,10,0.97))' }} />
        {/* Red accent left */}
        <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3px', background: 'linear-gradient(to bottom, transparent, #C0392B, transparent)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '70px 0 50px' }}>
          <span className="va-label">Nous sommes là pour vous</span>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: 'clamp(2.4rem,5vw,4rem)', marginBottom: '16px' }}>
            Nous <span style={{ background: 'linear-gradient(135deg,#E74C3C,#FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Contacter</span>
          </h1>
          <ol style={{ display: 'flex', justifyContent: 'center', gap: '8px', listStyle: 'none', padding: 0, margin: 0, alignItems: 'center' }}>
            <li><a href="/accueil" style={{ color: '#777', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>Accueil</a></li>
            <li style={{ color: '#444', fontSize: '0.75rem' }}>›</li>
            <li style={{ color: '#E74C3C', fontSize: '0.78rem', fontWeight: 600 }}>Contact</li>
          </ol>
        </div>
      </div>

      {/* ── INFO CARDS ── */}
      <section style={{ background: '#0d0d0d', padding: '60px 0 40px' }}>
        <div className="container">
          <div className="row g-3">
            {infoCards.map((card, i) => (
              <div key={i} className="col-6 col-lg-3">
                <div style={{
                  background: '#141414', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px', padding: '22px 18px', height: '100%',
                  transition: 'all 0.3s', cursor: 'default',
                  position: 'relative', overflow: 'hidden',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(192,57,43,0.35)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Top accent */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
                  <div style={{ width: '40px', height: '40px', borderRadius: '9px', background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <FontAwesomeIcon icon={card.icon} style={{ color: '#E74C3C', fontSize: '0.9rem' }} />
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555', marginBottom: '6px' }}>{card.label}</div>
                  <div style={{ color: '#ccc', fontSize: '0.82rem', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{card.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL CHANNELS ── */}
      <section style={{ background: '#0d0d0d', paddingBottom: '20px' }}>
        <div className="container">
          <div className="row g-3">
            {emailCards.map((card, i) => (
              <div key={i} className="col-md-4">
                <div style={{
                  background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px',
                  padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px',
                  transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(192,57,43,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(192,57,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FontAwesomeIcon icon={card.icon} style={{ color: '#E74C3C', fontSize: '0.82rem' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '3px' }}>{card.title}</div>
                    <div style={{ color: '#aaa', fontSize: '0.8rem' }}>{card.email}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP + FORM ── */}
      <section style={{ background: '#0a0a0a', padding: '60px 0 80px' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="va-label">Envoyez-nous un message</span>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}>
              Comment pouvons-nous<br />
              <span style={{ background: 'linear-gradient(135deg,#E74C3C,#FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>vous aider ?</span>
            </h2>
          </div>

          <div className="row g-4 align-items-start">
            {/* Map */}
            <div className="col-lg-5">
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', height: '100%', minHeight: '420px', position: 'relative' }}>
                {/* Map overlay header */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#E74C3C', fontSize: '0.8rem' }} />
                  <span style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 600 }}>Route Ain Chkef, Fès</span>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.8137443924397!2d-4.9925448254265365!3d33.9973175731777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f8b9a64fab547%3A0xd38556de600a8eeb!2sISTA%20%3A%20Institut%20Sp%C3%A9cialis%C3%A9%20de%20Technologie%20Appliqu%C3%A9e_Route%20Immouzer%20F%C3%A8s!5e0!3m2!1sfr!2sma!4v1745770813921!5m2!1sfr!2sma"
                  width="100%" height="420"
                  style={{ border: 0, display: 'block', filter: 'grayscale(0.3) contrast(1.05)' }}
                  allowFullScreen="" loading="lazy"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '36px 32px', position: 'relative', overflow: 'hidden' }}>
                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,#C0392B,#E74C3C,#FF6B35)' }} />

                <div style={{ marginBottom: '26px' }}>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: '#fff', fontSize: '1.6rem', marginBottom: '6px' }}>
                    Laissez-nous un message
                  </h3>
                  <p style={{ color: '#555', fontSize: '0.83rem', margin: 0 }}>
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>

                {/* Success */}
                {status === 'success' && (
                  <div style={{ background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#2ecc71', fontSize: '0.9rem' }} />
                    <span style={{ color: '#2ecc71', fontSize: '0.83rem', fontWeight: 500 }}>Message envoyé avec succès ! Nous vous répondrons bientôt.</span>
                  </div>
                )}
                {status === 'error' && (
                  <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa fa-exclamation-circle" style={{ color: '#E74C3C', fontSize: '0.85rem' }} />
                    <span style={{ color: '#E74C3C', fontSize: '0.83rem', fontWeight: 500 }}>Une erreur est survenue. Veuillez réessayer.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-1">
                    <div className="col-sm-6">
                      <Field icon={faUser} name="nom" placeholder="Votre nom" value={form.nom} onChange={handleChange} />
                    </div>
                    <div className="col-sm-6">
                      <Field icon={faEnvelope} type="email" name="email" placeholder="Adresse email" value={form.email} onChange={handleChange} />
                    </div>
                  </div>
                  <Field icon={faPhone} name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} />
                  <Field icon={faInbox} type="textarea" name="message" placeholder="Votre message..." value={form.message} onChange={handleChange} />

                  <button type="submit" disabled={submitting} style={{
                    width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    background: submitting ? 'rgba(192,57,43,0.5)' : 'linear-gradient(135deg,#C0392B,#E74C3C)',
                    color: '#fff', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.07em',
                    textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    boxShadow: submitting ? 'none' : '0 6px 22px rgba(192,57,43,0.35)',
                    transition: 'all 0.3s', marginTop: '4px',
                  }}>
                    {submitting ? (
                      <><i className="fa fa-circle-notch fa-spin" /> Envoi en cours...</>
                    ) : (
                      <>Envoyer le message <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: '0.78rem' }} /></>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
