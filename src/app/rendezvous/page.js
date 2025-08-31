"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

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

  // Protect page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else setLoadingAuth(false);
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
      alert(res.data.message || "Rendez-vous enregistré avec succès !");
      setFormData(initialFormData);
      setAvailableHours([]);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error.response?.data || error.message);
      alert(error.response?.data?.message || "Erreur lors de l’enregistrement.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await envoyerRendezVous(formData);
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
                        Réserver maintenant
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
