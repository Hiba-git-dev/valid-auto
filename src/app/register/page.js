"use client";
import { useState } from "react";
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
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");

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

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/rendezvous"); // redirect after success
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      {/* Full-width background */}
      <div
        className="w-full py-10"
        style={{
          backgroundImage: 'url("img/carousel-bg-3.jpg")', // <-- change to your image or color
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center mb-5">
          <FontAwesomeIcon icon={faCar} size="4x" color="red" />
        </div>

        {/* Red card centered */}
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
