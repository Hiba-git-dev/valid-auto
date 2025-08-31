"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    telephone: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        body: JSON.stringify({
          nom: form.name, // map frontend name -> backend nom
          email: form.email,
          telephone: form.telephone,
          password: form.password,
          password_confirmation: form.password_confirmation,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/rendezvous");
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || submitting) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <FontAwesomeIcon style={{ color: "#d81313" }} icon={faCar} size="5x" spin />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className="w-full py-10"
        style={{
          backgroundImage: 'url("img/carousel-bg-3.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center mb-5">
          <FontAwesomeIcon icon={faCar} size="4x" color="red" style={{ marginTop: "15px" }} />
          <h3 className="mt-2 text-black">Inscrivez-vous et réservez votre rendez-vous dès maintenant</h3>
        </div>

        <div
          className="h-100 d-flex flex-column justify-content-center text-center p-5 rounded mx-auto"
          style={{ backgroundColor: "#d81313", maxWidth: "600px" }}
        >
          <h2 className="text-white mb-4">Inscription</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Nom"
              value={form.name}
              onChange={handleChange}
              className="form-control mb-3"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="form-control mb-3"
              required
            />
            <input
              name="telephone"
              type="text"
              placeholder="Telephone"
              value={form.telephone}
              onChange={handleChange}
              className="form-control mb-3"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              className="form-control mb-3"
              required
            />
            <input
              name="password_confirmation"
              type="password"
              placeholder="Confirmez le mot de passe"
              value={form.password_confirmation}
              onChange={handleChange}
              className="form-control mb-3"
              required
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="btn w-100 py-3"
              style={{ backgroundColor: "black", color: "white" }}
            >
              S'inscrire
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
