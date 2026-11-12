import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: '' // ✅ renamed to match backend
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi.");

      // ✅ success
      setSuccessMessage("Votre message a été envoyé avec succès !");
      setErrorMessage("");
      setFormData({ nom: "", email: "", telephone: "", message: "" });

      // Optional: auto-hide success after 5s
      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (err) {
      console.error(err);
      setErrorMessage("Erreur lors de l'envoi.");
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {successMessage && (
        <div className="alert alert-success mb-3">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="alert alert-danger mb-3">{errorMessage}</div>
      )}

      <div className="form-group mb-3">
        <input
          type="text"
          name="nom"
          className="form-control"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group mb-3">
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group mb-3">
        <input
          type="text"
          name="telephone"
          className="form-control"
          placeholder="Téléphone"
          value={formData.telephone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group mb-3">
        <textarea
          name="message"
          className="form-control"
          rows="5"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <center>
        <button
          type="submit"
          className="btn btn-primary w-100 py-3"
          style={{ backgroundColor: 'red' }}
        >
          Envoyer
        </button>
      </center>
    </form>
  );
}
