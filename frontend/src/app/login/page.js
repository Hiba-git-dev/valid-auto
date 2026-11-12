"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faEnvelope, faLock, faEye, faEyeSlash, faArrowRight, faShieldAlt, faClock, faStar } from "@fortawesome/free-solid-svg-icons";

const InputField = ({ icon, type, name, placeholder, value, onChange, extra }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: '14px' }}>
      {/* Icon */}
      <div style={{
        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
        color: focused ? '#E74C3C' : '#444', fontSize: '0.8rem', transition: 'color 0.3s', zIndex: 1,
        pointerEvents: 'none',
      }}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', background: focused ? '#1e1e1e' : '#161616',
          border: `1.5px solid ${focused ? '#C0392B' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: '8px', color: '#f0f0f0',
          fontSize: '0.85rem', padding: '13px 16px 13px 42px',
          outline: 'none', transition: 'all 0.3s',
          boxShadow: focused ? '0 0 0 3px rgba(192,57,43,0.12)' : 'none',
        }}
      />
      {extra}
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Identifiants invalides");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex' }}>

      {/* ── LEFT PANEL (branding) ── */}
      <div className="d-none d-lg-flex" style={{
        width: '45%', flexShrink: 0,
        background: 'linear-gradient(145deg, #0f0f0f 0%, #1a0a0a 50%, #0f0f0f 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 50px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative glow orbs */}
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(192,57,43,0.18), transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(255,107,53,0.1), transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Logo */}
        <Link href="/accueil" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '52px', position: 'relative' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', boxShadow: '0 8px 24px rgba(192,57,43,0.45)' }}>
            <FontAwesomeIcon icon={faCar} />
          </div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.7rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
            Valid<span style={{ color: '#E74C3C' }}>Auto</span>
          </span>
        </Link>

        {/* Heading */}
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '320px' }}>
          <div style={{ width: '40px', height: '3px', background: 'linear-gradient(90deg,#C0392B,#FF6B35)', borderRadius: '2px', margin: '0 auto 22px' }} />
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: '2.2rem', lineHeight: 1.15, marginBottom: '16px' }}>
            Votre espace<br />
            <span style={{ background: 'linear-gradient(135deg,#E74C3C,#FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>personnel</span>
          </h2>
          <p style={{ color: '#666', fontSize: '0.88rem', lineHeight: 1.75 }}>
            Connectez-vous pour gérer vos rendez-vous et accéder à l'historique de vos véhicules.
          </p>
        </div>

        {/* Trust badges */}
        <div style={{ position: 'relative', marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '280px' }}>
          {[
            { icon: faShieldAlt, text: 'Données sécurisées & confidentielles' },
            { icon: faStar, text: '+150 clients nous font confiance' },
            { icon: faClock, text: 'Réservation rapide en 2 minutes' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '11px 14px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: 'rgba(192,57,43,0.12)', border: '1px solid rgba(192,57,43,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FontAwesomeIcon icon={b.icon} style={{ color: '#E74C3C', fontSize: '0.72rem' }} />
              </div>
              <span style={{ color: '#666', fontSize: '0.78rem' }}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative' }}>

        {/* Mobile logo */}
        <Link href="/accueil" className="d-lg-none" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', marginBottom: '36px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem' }}>
            <FontAwesomeIcon icon={faCar} />
          </div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
            Valid<span style={{ color: '#E74C3C' }}>Auto</span>
          </span>
        </Link>

        {/* Card */}
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ width: '32px', height: '3px', background: 'linear-gradient(90deg,#C0392B,#FF6B35)', borderRadius: '2px', marginBottom: '16px' }} />
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: '2.2rem', marginBottom: '6px' }}>
              Connexion
            </h1>
            <p style={{ color: '#555', fontSize: '0.85rem' }}>
              Pas encore de compte ?{' '}
              <Link href="/register" style={{ color: '#E74C3C', fontWeight: 600, textDecoration: 'none' }}>
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: '8px', padding: '11px 14px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa fa-exclamation-circle" style={{ color: '#E74C3C', fontSize: '0.85rem' }} />
              <span style={{ color: '#E74C3C', fontSize: '0.82rem', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <InputField icon={faEnvelope} type="email" name="email" placeholder="Adresse email" value={form.email} onChange={handleChange} />

            <InputField
              icon={faLock} type={showPass ? 'text' : 'password'} name="password"
              placeholder="Mot de passe" value={form.password} onChange={handleChange}
              extra={
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#444', fontSize: '0.8rem', padding: 0 }}>
                  <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} />
                </button>
              }
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '22px' }}>
              <a href="#" style={{ color: '#555', fontSize: '0.78rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#E74C3C'}
                onMouseLeave={e => e.currentTarget.style.color = '#555'}
              >
                Mot de passe oublié ?
              </a>
            </div>

            <button type="submit" disabled={submitting} style={{
              width: '100%', padding: '14px', borderRadius: '8px', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
              background: submitting ? 'rgba(192,57,43,0.5)' : 'linear-gradient(135deg,#C0392B,#E74C3C)',
              color: '#fff', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: submitting ? 'none' : '0 6px 22px rgba(192,57,43,0.4)',
              transition: 'all 0.3s',
            }}>
              {submitting ? (
                <><i className="fa fa-circle-notch fa-spin" /> Connexion...</>
              ) : (
                <>Se connecter <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.78rem' }} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ color: '#333', fontSize: '0.72rem' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <Link href="/accueil" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '13px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.07)',
            color: '#666', fontSize: '0.82rem', fontWeight: 500, textDecoration: 'none',
            background: 'transparent', transition: 'all 0.25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(192,57,43,0.3)'; e.currentTarget.style.color = '#ccc'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#666'; }}
          >
            Continuer sans compte
          </Link>
        </div>
      </div>
    </div>
  );
}
