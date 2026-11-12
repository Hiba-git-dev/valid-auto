"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import PaymentModal from "../components/PaymentModal";

// Scroll animation hook
function useAnimateOnScroll(ref, className, delay = 0) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => element.classList.add(className), delay);
          observer.unobserve(element);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, className, delay]);
}

export default function Rendezvous() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);

  const initialFormData = {
    nom: "",
    email: "",
    service: "",
    date: null,
    time: "",
    requete: "",
    marque: "",
    year: "",
    matricule: "",
    kilometrage: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  // Protect page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; } else { setLoadingAuth(false); try { const u = JSON.parse(localStorage.getItem("user") || "{}"); if (u) setFormData(p => ({ ...p, nom: p.nom || u.nom || "", email: p.email || u.email || "" })); } catch {} }

  }, [router]);

  // Load available dates
  useEffect(() => {
    if (!loadingAuth) {
      import("bootstrap/dist/js/bootstrap.bundle.min.js");
      axios
        .get("http://127.0.0.1:8000/api/available-dates")
        .then((res) =>
          setAvailableDates(
            res.data.map((d) => {
              const date = new Date(d);
              return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
              );
            })
          )
        )
        .catch((err) => console.error("Erreur chargement dates:", err));
    }
  }, [loadingAuth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const envoyerRendezVous = async (data) => {
    if (!data.nom?.trim()) { setToast({ type: "error", title: "Nom obligatoire", message: "Veuillez renseigner votre nom." }); setTimeout(() => setToast(null), 3500); return; }
    if (!data.email?.trim()) { setToast({ type: "error", title: "Email obligatoire", message: "Veuillez renseigner votre email." }); setTimeout(() => setToast(null), 3500); return; }
    if (!data.date) { setToast({ type: "error", title: "Date requise", message: "Veuillez choisir une date dans le calendrier." }); setTimeout(() => setToast(null), 3500); return; }
    if (!data.time) { setToast({ type: "error", title: "Heure requise", message: "Veuillez choisir une heure disponible." }); setTimeout(() => setToast(null), 3500); return; }
    if (!data.service) { setToast({ type: "error", title: "Service requis", message: "Veuillez sélectionner un service." }); setTimeout(() => setToast(null), 3500); return; }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
  ...data,
  date: data.date
    ? `${data.date.getFullYear()}-${String(data.date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(data.date.getDate()).padStart(2, "0")}`
    : "",
  hour: data.time || "", // <- renamed from time to hour
};

      const res = await axios.post(
        "http://127.0.0.1:8000/api/rendezvous",
        payload,
        {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }
      );
      setToast({ type: "success", title: "Rendez-vous Confirmé !", message: "Votre réservation a été validée avec succès. Redirection vers votre espace..." }); setTimeout(() => router.push('/dashboard'), 1900);
// redirect is in setTimeout
    } catch (error) {
            setIsSubmitting(false); const errData = error.response?.data; let errMsg = "Une erreur est survenue lors de l'enregistrement."; if (errData?.errors) { errMsg = Object.values(errData.errors).flat().join(" "); } else if (errData?.message) { errMsg = errData.message; } else if (error.message) { errMsg = error.message; } console.error("Détail de l'erreur :", errMsg, error);
      setToast({ type: "error", title: "Erreur de réservation", message: errMsg }); setTimeout(() => setToast(null), 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = formData;
    if (!data.nom?.trim())   { setToast({ type: "error", title: "Nom obligatoire",   message: "Veuillez renseigner votre nom."   }); setTimeout(() => setToast(null), 3500); return; }
    if (!data.email?.trim()) { setToast({ type: "error", title: "Email obligatoire", message: "Veuillez renseigner votre email." }); setTimeout(() => setToast(null), 3500); return; }
    if (!data.date)          { setToast({ type: "error", title: "Date requise",      message: "Veuillez choisir une date."       }); setTimeout(() => setToast(null), 3500); return; }
    if (!data.time)          { setToast({ type: "error", title: "Heure requise",     message: "Veuillez choisir une heure."      }); setTimeout(() => setToast(null), 3500); return; }
    if (!data.service)       { setToast({ type: "error", title: "Service requis",    message: "Veuillez s�lectionner un service."}); setTimeout(() => setToast(null), 3500); return; }
    setPendingData(data);
    setShowPayment(true);
  };

  // Refs for scroll animations
  const headerRef = useRef();
  const leftColRef = useRef();
  const formRef = useRef();
  useAnimateOnScroll(headerRef, "animate-slide-up");
  useAnimateOnScroll(leftColRef, "animate-slide-up", 200);
  useAnimateOnScroll(formRef, "animate-zoom-in", 400);

  if (loadingAuth) return <p className="text-center mt-10">Vérification de l’authentification...</p>;

  return (
    <>
      <Navbar />

      {/* ── TOAST DE NOTIFICATION VISUELLE FLOTTANT ── */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            minWidth: '320px',
            maxWidth: '90vw',
            background: toast.type === 'success' ? 'rgba(16, 28, 20, 0.96)' : 'rgba(38, 16, 16, 0.96)',
            border: `1.5px solid ${toast.type === 'success' ? '#2ecc71' : '#e74c3c'}`,
            borderRadius: '12px',
            padding: '16px 22px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.6), 0 0 25px rgba(46,204,113,0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            animation: 'fadeInDown 0.3s ease-out',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: toast.type === 'success' ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: toast.type === 'success' ? '#2ecc71' : '#e74c3c',
              fontSize: '18px',
              flexShrink: 0,
            }}
          >
            <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.96rem', letterSpacing: '0.3px' }}>
              {toast.title}
            </div>
            <div style={{ color: '#bbb', fontSize: '0.82rem', marginTop: '2px' }}>
              {toast.message}
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div
        className="container-fluid page-header mb-5 p-0"
        style={{ backgroundImage: 'url(img/carousel-bg-1.jpg)' }}
      >
        <div className="container-fluid page-header-inner py-5">
          <div className="container text-center">
            <h1 ref={headerRef} className="display-3 text-white">
              Booking
            </h1>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="container-fluid bg-secondary booking my-5">
        <div className="container">
          <div className="row gx-5">
            {/* Left Text */}
            <div className="col-lg-6 py-5">
              <div ref={leftColRef} className="py-5">
                <h1 className="text-white mb-4">
                  Fournisseur de services de réparation automobile certifié et primé
                </h1>
              </div>
            </div>

            {/* Form */}
            <div className="col-lg-6">
              <div
                ref={formRef}
                className="h-100 d-flex flex-column justify-content-center text-center p-5"
                style={{ backgroundColor: "#d81313" }}
              >
                <h2 className="text-white mb-4">Demander un rendez-vous</h2>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {[
                      { type: "text", name: "nom", placeholder: "Nom" },
                      { type: "email", name: "email", placeholder: "Email" },
                      { type: "text", name: "marque", placeholder: "Marque et modèle" },
                      { type: "number", name: "year", placeholder: "Année modèle" },
                      { type: "text", name: "matricule", placeholder: "Matricule" },
                      { type: "number", name: "kilometrage", placeholder: "Kilométrage" },
                    ].map((input, idx) => (
                      <div className="col-12 col-sm-6" key={idx}>
                        <input
                          type={input.type}
                          className="form-control border-0"
                          placeholder={input.placeholder}
                          style={{ height: "55px" }}
                          name={input.name}
                          value={formData[input.name] || ""}
                          onChange={handleChange}
                        />
                      </div>
                    ))}

                    {/* Date Picker */}
                    <div className="col-12 col-sm-6">
                      <DatePicker
                        selected={formData.date}
                        onChange={async (date) => {
                          setFormData(prev => ({ ...prev, date, time: "" }));
                          if (!date) return;

                          try {
                            const token = localStorage.getItem("token");
                            const res = await axios.get(
                              `http://127.0.0.1:8000/api/available-hours?date=${date.toISOString().split('T')[0]}`,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            setAvailableHours(res.data);
                          } catch (err) {
                            console.error("Erreur chargement heures:", err);
                            setAvailableHours([]);
                          }
                        }}
                        includeDates={availableDates}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Sélectionner une date disponible"
                        className="form-control border-0"
                        style={{ height: '55px' }}
                      />
                    </div>

                    {/* Hour select */}
                    <div className="col-12 col-sm-6" style={{ position: 'relative' }}>
                      <select
  className="form-select border-0"
  style={{ height: "55px" }}
  name="time"
  value={formData.time}
  onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
  disabled={!availableHours.length}
>
  <option value="">Sélectionner une heure</option>
  {availableHours.map((hour) => (
    <option key={hour} value={hour}>
      {hour}
    </option>
  ))}
</select>


                    </div>

                    {/* Service */}
                    <div className="col-12 col-sm-6">
                      <select
                        className="form-select border-0"
                        style={{ height: "55px" }}
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                      >
                        <option value="">Selectionner un service</option>
                        <option value="Visite technique">Visite technique</option>
                        <option value="Vidange">Vidange</option>
                        <option value="Pneumatiques">Pneumatiques</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <textarea
                        className="form-control border-0"
                        placeholder="Requete spéciale"
                        name="requete"
                        value={formData.requete}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-secondary w-100 py-3"
                        style={{ backgroundColor: "black" }}
                      >
                        {isSubmitting ? "Enregistrement en cours..." : "Réserver maintenant"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL DE PAIEMENT ── */}
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        service={pendingData?.service}
        rdvData={pendingData}
        onSuccess={async () => {
          setShowPayment(false);
          if (pendingData) await envoyerRendezVous(pendingData);
        }}
      />
    </>
  );
}
