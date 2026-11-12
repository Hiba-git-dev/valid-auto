"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faEnvelope, faLock, faEye, faEyeSlash, faUser, faPhone, faArrowRight, faCheckCircle, faStar, faClock } from "@fortawesome/free-solid-svg-icons";

const InputField = ({ icon, type, name, placeholder, value, onChange, required = true, extra }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: '12px' }}>
      <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: focused ? '#E74C3C' : '#3a3a3a', fontSize: '0.78rem', transition: 'color 0.3s', zIndex: 1, pointerEvents: 'none' }}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <input
        type={type} name={name} placeholder={placeholder}
        value={value} onChange={onChange} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', background: focused ? '#1e1e1e' : '#161616',
          border: `1.5px solid ${focused ? '#C0392B' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: '8px', color: '#f0f0f0', fontSize: '0.84rem',
          padding: '12px 16px 12px 42px', outline: 'none', transition: 'all 0.3s',
          boxShadow: focused ? '0 0 0 3px rgba(192,57,43,0.1)' : 'none',
        }}
      />
      {extra}
    </div>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", telephone: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password_confirmation) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/register-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: form.name, email: form.email, telephone: form.telephone, password: form.password, password_confirmation: form.password_confirmation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Inscription échouée");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const passStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['transparent', '#E74C3C', '#FF6B35', '#2ecc71'];
  const strengthLabels = ['', 'Faible', 'Moyen', 'Fort'];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex' }}>

      {/* ── LEFT PANEL ── */}
      <div className="d-none d-lg-flex" style={{
        width: '42%', flexShrink: 0,
        background: 'linear-gradient(145deg, #0f0f0f 0%, #1a0a0a 50%, #0f0f0f 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(192,57,43,0.15), transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(255,107,53,0.08), transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Logo */}
        <Link href="/accueil" style={{ display: 'flex', alignItems: 'center', gap: '11px', textDecoration: 'none', marginBottom: '48px', position: 'relative' }}>
          <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem', boxShadow: '0 6px 20px rgba(192,57,43,0.4)' }}>
            <FontAwesomeIcon icon={faCar} />
          </div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
            Valid<span style={{ color: '#E74C3C' }}>Auto</span>
          </span>
        </Link>

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '300px' }}>
          <div style={{ width: '38px', height: '3px', background: 'linear-gradient(90deg,#C0392B,#FF6B35)', borderRadius: '2px', margin: '0 auto 20px' }} />
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: '2rem', lineHeight: 1.2, marginBottom: '14px' }}>
            Rejoignez<br />
            <span style={{ background: 'linear-gradient(135deg,#E74C3C,#FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ValidAuto</span>
          </h2>
          <p style={{ color: '#555', fontSize: '0.85rem', lineHeight: 1.75 }}>
            Créez votre compte gratuitement et bénéficiez d'un accès rapide à nos services de contrôle technique.
          </p>
        </div>

        {/* Avantages */}
        <div style={{ position: 'relative', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
          {[
            'Réservation en ligne 24h/24',
            'Rappel automatique de rendez-vous',
            'Historique complet de vos véhicules',
            'Équipe disponible & réactive',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#2ecc71', fontSize: '0.75rem', flexShrink: 0 }} />
              <span style={{ color: '#666', fontSize: '0.8rem' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>

        {/* Mobile logo */}
        <Link href="/accueil" className="d-lg-none" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', marginBottom: '30px' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.85rem' }}>
            <FontAwesomeIcon icon={faCar} />
          </div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
            Valid<span style={{ color: '#E74C3C' }}>Auto</span>
          </span>
        </Link>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ width: '30px', height: '3px', background: 'linear-gradient(90deg,#C0392B,#FF6B35)', borderRadius: '2px', marginBottom: '14px' }} />
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: '2rem', marginBottom: '5px' }}>
              Créer un compte
            </h1>
            <p style={{ color: '#555', fontSize: '0.83rem' }}>
              Déjà inscrit ?{' '}
              <Link href="/login" style={{ color: '#E74C3C', fontWeight: 600, textDecoration: 'none' }}>
                Se connecter
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: '8px', padding: '10px 13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '9px' }}>
              <i className="fa fa-exclamation-circle" style={{ color: '#E74C3C', fontSize: '0.82rem' }} />
              <span style={{ color: '#E74C3C', fontSize: '0.8rem', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <InputField icon={faUser} type="text" name="name" placeholder="Nom complet" value={form.name} onChange={handleChange} />
            <InputField icon={faEnvelope} type="email" name="email" placeholder="Adresse email" value={form.email} onChange={handleChange} />
            <InputField icon={faPhone} type="text" name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} />

            <InputField
              icon={faLock} type={showPass ? 'text' : 'password'} name="password"
              placeholder="Mot de passe" value={form.password} onChange={handleChange}
              extra={
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#3a3a3a', fontSize: '0.78rem', padding: 0 }}>
                  <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} />
                </button>
              }
            />

            {/* Password strength */}
            {form.password.length > 0 && (
              <div style={{ marginBottom: '12px', marginTop: '-6px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= passStrength ? strengthColors[passStrength] : 'rgba(255,255,255,0.06)', transition: 'background 0.3s' }} />
                  ))}
                </div>
                <span style={{ color: strengthColors[passStrength], fontSize: '0.7rem', fontWeight: 600 }}>{strengthLabels[passStrength]}</span>
              </div>
            )}

            <InputField
              icon={faLock} type={showConfirm ? 'text' : 'password'} name="password_confirmation"
              placeholder="Confirmer le mot de passe" value={form.password_confirmation} onChange={handleChange}
              extra={
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#3a3a3a', fontSize: '0.78rem', padding: 0 }}>
                  <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
                </button>
              }
            />

            {/* Match indicator */}
            {form.password_confirmation.length > 0 && (
              <div style={{ marginBottom: '12px', marginTop: '-6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FontAwesomeIcon icon={faCheckCircle} style={{ color: form.password === form.password_confirmation ? '#2ecc71' : '#E74C3C', fontSize: '0.72rem' }} />
                <span style={{ color: form.password === form.password_confirmation ? '#2ecc71' : '#E74C3C', fontSize: '0.7rem', fontWeight: 600 }}>
                  {form.password === form.password_confirmation ? 'Mots de passe identiques' : 'Ne correspondent pas'}
                </span>
              </div>
            )}

            <button type="submit" disabled={submitting} style={{
              width: '100%', marginTop: '8px', padding: '13px', borderRadius: '8px', border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              background: submitting ? 'rgba(192,57,43,0.5)' : 'linear-gradient(135deg,#C0392B,#E74C3C)',
              color: '#fff', fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: submitting ? 'none' : '0 5px 20px rgba(192,57,43,0.38)',
              transition: 'all 0.3s',
            }}>
              {submitting ? (
                <><i className="fa fa-circle-notch fa-spin" /> Inscription...</>
              ) : (
                <>Créer mon compte <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.75rem' }} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#333', fontSize: '0.72rem', marginTop: '20px', lineHeight: 1.6 }}>
            En vous inscrivant, vous acceptez nos{' '}
            <a href="#" style={{ color: '#555', textDecoration: 'underline' }}>conditions d'utilisation</a>
            {' '}et notre{' '}
            <a href="#" style={{ color: '#555', textDecoration: 'underline' }}>politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
