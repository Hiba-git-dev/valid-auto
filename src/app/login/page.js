"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

      router.push("/rendezvous");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || submitting) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <FontAwesomeIcon style={{ color: "#d81313" }} icon={faCar} size="5x" spin />
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="w-full py-10" style={{ backgroundImage: 'url("img/carousel-bg-3.jpg")', backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="text-center mb-5">
          <FontAwesomeIcon icon={faCar} size="4x" color="red" style={{ marginTop: "15px" }}/>
          <h3 className="mt-2 text-black">Connectez-vous pour accéder aux rendez-vous</h3>
        </div>

        <div className="h-100 d-flex flex-column justify-content-center text-center p-5 rounded mx-auto" style={{ backgroundColor: "#d81313", maxWidth: "600px" }}>
          <h2 className="text-white mb-4">Se connecter</h2>
          <form onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="form-control mb-3" required />
            <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} className="form-control mb-3" required />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="btn w-100 py-3" style={{ backgroundColor: "black", color: "white" }}>Se connecter</button>
          </form>

          <p className="text-white mt-4">
            Pas encore de compte ?{" "}
            <span onClick={() => router.push("/register")} className="text-blue-200 cursor-pointer underline">
              S’inscrire ici
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
