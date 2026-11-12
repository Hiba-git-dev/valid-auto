'use client';

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import QuickTracker from "../components/QuickTracker";
import PriceEstimator from "../components/PriceEstimator";
import FaqSection from "../components/FaqSection";
import TestimonialsSection from "../components/TestimonialsSection";
import LocationMapSection from "../components/LocationMapSection";
import CertificationsMarquee from "../components/CertificationsMarquee";
import ProcessTimeline from "../components/ProcessTimeline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faCheck, faUsersCog, faUsers, faArrowRight, faStar, faShieldAlt, faClock } from "@fortawesome/free-solid-svg-icons";

export default function Accueil() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const animatedRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }
  }, []);

  // Auto-slide hero
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', entry.target.dataset.animate);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    animatedRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="va-loader">
        <FontAwesomeIcon icon={faCar} className="va-loader-icon" />
        <span className="va-loader-text">VALIDAUTO</span>
      </div>
    );
  }

  const slides = [
    {
      bg: "/img/carousel-bg-1.jpg",
      badge: "✦ Centre Agréé Maroc",
      title: "Votre voiture mérite",
      highlight: "le meilleur.",
      sub: "Contrôle technique rapide, précis et certifié. 15 ans d'excellence à votre service à Fès.",
      car: "/img/carousel-1.png",
    },
    {
      bg: "/img/carousel-bg-2.jpg",
      badge: "✦ +150 Clients satisfaits",
      title: "Des experts à",
      highlight: "votre service.",
      sub: "Diagnostic complet, entretien moteur, pneumatiques et vidange réalisés par nos 20 techniciens certifiés.",
      car: "/img/carousel-2.png",
    },
  ];

  const services = [
    {
      icon: "fa-certificate",
      title: "Service de qualité",
      desc: "Contrôle rapide, précis et conforme aux normes pour assurer votre sécurité sur la route.",
    },
    {
      icon: "fa-users-cog",
      title: "Staff expert",
      desc: "20 techniciens qualifiés mettent leur expertise à votre service pour un contrôle fiable.",
    },
    {
      icon: "fa-tools",
      title: "Équipement moderne",
      desc: "Équipements de pointe pour des diagnostics précis et des contrôles techniques fiables.",
    },
  ];

  const stats = [
    { icon: faCheck, value: "15+", label: "Années d'expérience" },
    { icon: faUsersCog, value: "20", label: "Techniciens certifiés" },
    { icon: faUsers, value: "150+", label: "Clients satisfaits" },
    { icon: faCar, value: "120+", label: "Projets réalisés" },
  ];

  const aboutFeatures = [
    { num: "01", title: "Professionnalisme & Expertise", desc: "Tout notre équipement est conforme aux nouvelles réglementations" },
    { num: "02", title: "Centre de service de qualité", desc: "Que le meilleur pour votre voiture" },
    { num: "03", title: "Staff expérimenté", desc: "20 techniciens à votre disposition" },
  ];

  return (
    <>
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#0a0a0a' }}>
        {/* Background images with crossfade */}
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${slide.bg})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: activeSlide === i ? 1 : 0,
              transition: 'opacity 1.2s ease',
              zIndex: 0,
            }}
          />
        ))}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(105deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.4) 100%)',
        }} />
        {/* Red accent line left */}
        <div style={{
          position: 'absolute', left: 0, top: '15%', bottom: '15%', width: '3px', zIndex: 2,
          background: 'linear-gradient(to bottom, transparent, #C0392B, #E74C3C, transparent)',
        }} />

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 3, minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', paddingBottom: '60px' }}>
          <div className="row align-items-center w-100 gy-5">
            {/* Left text */}
            <div className="col-lg-6">
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.4)',
                borderRadius: '50px', padding: '7px 16px', marginBottom: '28px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E74C3C', display: 'inline-block', animation: 'pulse-phone 1.5s infinite' }} />
                <span style={{ color: '#E74C3C', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {slides[activeSlide].badge}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800, lineHeight: 1.05,
                fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
                color: '#fff', marginBottom: '6px',
              }}>
                {slides[activeSlide].title}
              </h1>
              <h1 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800, lineHeight: 1.05,
                fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
                marginBottom: '24px',
                background: 'linear-gradient(135deg, #E74C3C, #FF6B35)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {slides[activeSlide].highlight}
              </h1>

              {/* Divider */}
              <div style={{ width: '50px', height: '3px', background: 'linear-gradient(90deg,#C0392B,#FF6B35)', borderRadius: '2px', marginBottom: '22px' }} />

              <p style={{ color: '#aaa', fontSize: '1rem', lineHeight: 1.75, maxWidth: '460px', marginBottom: '36px' }}>
                {slides[activeSlide].sub}
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
                <a href="/rendezvous" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(135deg,#C0392B,#E74C3C)',
                  color: '#fff', padding: '13px 26px', borderRadius: '6px',
                  fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  boxShadow: '0 6px 24px rgba(192,57,43,0.4)',
                  transition: 'all 0.3s',
                }}>
                  <FontAwesomeIcon icon={faCar} style={{ fontSize: '0.85rem' }} />
                  Prendre RDV
                </a>
                <a href="/services" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'transparent', color: '#fff',
                  padding: '13px 26px', borderRadius: '6px',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s',
                }}>
                  Nos services
                  <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} />
                </a>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {[
                  { icon: faShieldAlt, text: 'Certifié agréé' },
                  { icon: faStar, text: 'Avis 5 étoiles' },
                  { icon: faClock, text: 'Rapide & ponctuel' },
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <FontAwesomeIcon icon={b.icon} style={{ color: '#E74C3C', fontSize: '0.8rem' }} />
                    <span style={{ color: '#888', fontSize: '0.78rem', fontWeight: 500 }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — car image */}
            <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
              <div style={{ position: 'relative', width: '100%', maxWidth: '540px' }}>
                {/* Glow behind car */}
                <div style={{
                  position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)',
                  width: '70%', height: '60px',
                  background: 'rgba(192,57,43,0.25)', filter: 'blur(30px)', borderRadius: '50%',
                }} />
                <Image
                  src={slides[activeSlide].car}
                  alt="Véhicule"
                  width={540} height={380}
                  style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.7))' }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll down mouse indicator */}
        <div 
          className="va-scroll-indicator d-none d-md-flex"
          onClick={() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })}
        >
          <div className="va-mouse-icon">
            <div className="va-mouse-wheel" />
          </div>
          <span className="va-scroll-text">Découvrir</span>
        </div>

        {/* Slide dots */}
        <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 4 }}>
          {[0, 1].map(i => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              style={{
                width: activeSlide === i ? '28px' : '8px', height: '8px',
                borderRadius: '4px', border: 'none', cursor: 'pointer',
                background: activeSlide === i ? '#E74C3C' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.4s', padding: 0,
              }}
            />
          ))}
        </div>
      </section>

      {/* ── BANDEAU MARQUEE DES CERTIFICATIONS ── */}
      <CertificationsMarquee />

      {/* ── SUIVI EXPRESS PAR MATRICULE ── */}
      <QuickTracker />

      {/* ── SERVICES PREVIEW ── */}
      <section style={{ background: '#0d0d0d', padding: '80px 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="va-label">Ce que nous offrons</span>
            <h2 className="va-title">Nos <span>services</span></h2>
          </div>
          <div className="row g-4">
            {services.map((s, i) => (
              <div
                key={i}
                className="col-lg-4 col-md-6"
                data-animate="animate__fadeInUp"
                style={{ animationDelay: `${0.15 * i}s` }}
                ref={el => animatedRefs.current.push(el)}
              >
                <div className="va-card" style={{ height: '100%' }}>
                  <div className="va-icon-box mb-4">
                    <i className={`fa ${s.icon}`} />
                  </div>
                  <h5 className="va-title" style={{ fontSize: '1.15rem', marginBottom: '12px' }}>{s.title}</h5>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '20px' }}>{s.desc}</p>
                  <a href="/services" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    color: '#E74C3C', fontSize: '0.78rem', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
                    transition: 'gap 0.3s',
                  }}>
                    En savoir plus <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VOTRE CONTRÔLE EN 3 ÉTAPES SIMPLES ── */}
      <ProcessTimeline />

      {/* ── SIMULATEUR DE TARIF EN LIGNE ── */}
      <PriceEstimator />

      {/* ── ABOUT ── */}
      <section style={{ background: '#111', padding: '80px 0' }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* Image */}
            <div
              className="col-lg-6"
              data-animate="animate__fadeInLeft"
              ref={el => animatedRefs.current.push(el)}
            >
              <div className="va-about-img-wrapper" style={{ minHeight: '420px' }}>
                <Image
                  src="/img/about.jpg"
                  alt="À propos de ValidAuto"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 992px) 100vw, 50vw"
                />
                <div className="va-experience-badge">
                  <span className="number">15</span>
                  <span className="label">Ans d'expérience</span>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="col-lg-6">
              <span className="va-label">À propos</span>
              <h2 className="va-title">
                <span>ValidAuto</span>, le meilleur endroit pour votre véhicule
              </h2>
              <div className="va-divider" />
              <p style={{ marginBottom: '28px' }}>
                Chez ValidAuto, votre véhicule bénéficie d'un contrôle de qualité, réalisé par des experts avec un équipement de pointe pour une sécurité optimale.
              </p>

              <div style={{ marginBottom: '32px' }}>
                {aboutFeatures.map((item, i) => (
                  <div
                    key={i}
                    className="va-feature-item"
                    data-animate="animate__fadeInRight"
                    style={{ animationDelay: `${0.15 * i}s` }}
                    ref={el => animatedRefs.current.push(el)}
                  >
                    <span className="va-feature-num">{item.num}</span>
                    <div className="va-feature-text">
                      <h6>{item.title}</h6>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href="/services" className="va-btn va-btn-primary">
                Découvrir nos offres
                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="va-stats">
        <div className="container">
          <div className="row g-0">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="col-6 col-lg-3 va-stat-item"
                data-animate="animate__fadeInUp"
                style={{ animationDelay: `${0.1 * i}s` }}
                ref={el => animatedRefs.current.push(el)}
              >
                <div className="va-stat-icon">
                  <FontAwesomeIcon icon={stat.icon} />
                </div>
                <div className="va-stat-number">{stat.value}</div>
                <div className="va-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVIS & TÉMOIGNAGES CLIENTS VÉRIFIÉS ── */}
      <TestimonialsSection />

      {/* ── FAQ INTERACTIVE AUTOMOBILE ── */}
      <FaqSection />

      {/* ── ACCÈS & ITINÉRAIRE AU CENTRE DE FÈS ── */}
      <LocationMapSection />

      {/* ── CTA ── */}
      <section style={{ background: '#0d0d0d', padding: '80px 0' }}>
        <div className="container">
          <div
            className="va-cta-section"
            data-animate="animate__fadeInUp"
            ref={el => animatedRefs.current.push(el)}
          >
            {/* Decorative glow */}
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(192,57,43,0.15), transparent 70%)', borderRadius: '50%' }} />

            <div className="row align-items-center gy-4">
              <div className="col-lg-7">
                <span className="va-label">Appelez dès maintenant</span>
                <h2 className="va-title" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)' }}>
                  Des questions avant de <span>réserver ?</span>
                </h2>
                <p style={{ maxWidth: '480px' }}>
                  Notre équipe répond à toutes vos questions — documents, tarifs, délais. N'hésitez pas à nous contacter.
                </p>
              </div>
              <div className="col-lg-5 text-lg-end">
                <a href="tel:+212770145404" className="va-cta-phone-box" style={{ textDecoration: 'none', display: 'inline-flex', marginBottom: '16px' }}>
                  <div className="va-phone-icon">
                    <i className="fa fa-phone-alt" />
                  </div>
                  <div style={{ marginLeft: '14px', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>Appelez-nous</div>
                    <div className="va-phone-number">+212 770 145 404</div>
                  </div>
                </a>
                <br />
                <a href="/contact" className="va-btn va-btn-outline">
                  Contactez-nous
                  <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.8rem' }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
