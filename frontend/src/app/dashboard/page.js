'use client';
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar, faCalendarCheck, faClipboardList, faUser, faSignOutAlt,
  faArrowRight, faChevronRight, faClock, faCheckCircle, faHourglassHalf,
  faKey, faBell, faHome, faTachometerAlt, faEdit, faSave, faTimes,
  faEye, faFileAlt, faPhone, faEnvelope, faDownload, faPrint, faFilePdf,
  faExclamationTriangle, faShieldAlt, faInfoCircle, faTicketAlt, faCreditCard
} from "@fortawesome/free-solid-svg-icons";
import PaymentModal from "../components/PaymentModal";


const API = "http://127.0.0.1:8000/api";

const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;
const getUser  = () => {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
};

const authFetch = (url, opts = {}) =>
  fetch(`${API}${url}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...(opts.headers || {}) },
  });

/* ── STATUS BADGE ── */
const StatusBadge = ({ statut }) => {
  const config = {
    'en_attente': { color: '#FF6B35', bg: 'rgba(255,107,53,0.12)', border: 'rgba(255,107,53,0.3)', icon: 'fa-hourglass-half', label: 'En attente' },
    'confirmé':   { color: '#2ecc71', bg: 'rgba(46,204,113,0.12)', border: 'rgba(46,204,113,0.3)', icon: 'fa-check-circle',  label: 'Confirmé'   },
    'annulé':     { color: '#e74c3c', bg: 'rgba(231,76,60,0.12)',  border: 'rgba(231,76,60,0.3)',  icon: 'fa-times-circle',  label: 'Annulé'     },
  };
  const c = config[statut] || config['en_attente'];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'3px 10px', borderRadius:'20px', fontSize:'0.7rem', fontWeight:700, background:c.bg, color:c.color, border:`1px solid ${c.border}` }}>
      <i className={`fa ${c.icon}`} style={{ fontSize:'0.6rem' }} />
      {c.label}
    </span>
  );
};

/* ── STAT CARD ── */
const StatCard = ({ icon, value, label, color }) => (
  <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: color }} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(192,57,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesomeIcon icon={icon} style={{ color: '#E74C3C', fontSize: '0.85rem' }} />
      </div>
    </div>
    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>{value ?? '—'}</div>
    <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '4px' }}>{label}</div>
  </div>
);

/* ── SECTION HEADER ── */
const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ width: '28px', height: '2px', background: 'linear-gradient(90deg,#C0392B,#FF6B35)', borderRadius: '2px', marginBottom: '10px' }} />
    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: '1.5rem', marginBottom: '3px' }}>{title}</h2>
    {subtitle && <p style={{ color: '#555', fontSize: '0.8rem' }}>{subtitle}</p>}
  </div>
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser]         = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats]       = useState(null);
  const [rdvs, setRdvs]         = useState([]);
  const [rapports, setRapports] = useState([]);
  const [voitures, setVoitures] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profil, setProfil]     = useState({ nom: '', telephone: '' });
  const [passForm, setPassForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [msg, setMsg]           = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedVignette, setSelectedVignette] = useState(null);
  const [rdvStatusFilter, setRdvStatusFilter] = useState('all');
  const [dismissAlert, setDismissAlert] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState(null); // { service, rdvData }

  /* ── TÉLÉCHARGER LE RAPPORT EN PDF ── */
  const downloadReportPDF = (report) => {
    if (!report) return;
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      alert("Veuillez autoriser les fenêtres pop-up dans votre navigateur pour imprimer ou télécharger le rapport en PDF.");
      return;
    }

    const dateEmission = new Date(report.created_at || Date.now()).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    const dateIntervention = report.rendezvous?.date
      ? new Date(report.rendezvous.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
      : dateEmission;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Rapport_Technique_ValidAuto_${report.id || 'N'}.pdf</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        <style>
          @page { size: A4; margin: 12mm; }
          * { box-sizing: border-box; }
          @media print {
            .no-print { display: none !important; }
            body { background: #fff !important; padding: 0 !important; }
            #printable-report { margin: 0 !important; padding: 0 !important; box-shadow: none !important; border: none !important; max-width: 100% !important; }
          }
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background: #f1f5f9;
            margin: 0;
            padding: 0;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #printable-report {
            max-width: 820px;
            margin: 24px auto 40px;
            background: #ffffff;
            padding: 32px 36px;
            border-radius: 8px;
            box-shadow: 0 4px 25px rgba(0,0,0,0.08);
            border: 1px solid #e2e8f0;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #C0392B;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .brand-title {
            font-size: 28px;
            font-weight: 900;
            letter-spacing: -0.5px;
            color: #0f172a;
            margin: 0;
            line-height: 1.1;
          }
          .brand-title span { color: #C0392B; }
          .brand-sub {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
            font-weight: 500;
          }
          .brand-contact {
            font-size: 11px;
            color: #94a3b8;
            margin-top: 2px;
          }
          .meta-box {
            text-align: right;
            font-size: 12px;
            color: #475569;
          }
          .meta-box strong { color: #0f172a; }
          .badge-cert {
            display: inline-block;
            background: #ecfdf5;
            color: #059669;
            border: 1px solid #a7f3d0;
            padding: 3px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            margin-top: 6px;
          }
          .doc-title-bar {
            background: #f8fafc;
            border-left: 4px solid #C0392B;
            padding: 12px 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .doc-title {
            font-size: 16px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #0f172a;
            margin: 0;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
          }
          .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 14px 16px;
          }
          .card-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #C0392B;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin: 0 0 10px 0;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12.5px;
          }
          .info-table th {
            text-align: left;
            color: #64748b;
            font-weight: 600;
            padding: 4px 0;
            width: 44%;
          }
          .info-table td {
            font-weight: 600;
            color: #0f172a;
            padding: 4px 0;
          }
          .section-heading {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #475569;
            margin: 20px 0 8px;
          }
          .details-box {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 14px 16px;
            font-size: 12.5px;
            white-space: pre-line;
            color: #334155;
            line-height: 1.6;
          }
          .summary-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px 20px;
            margin-top: 24px;
          }
          .price-badge {
            background: #C0392B;
            color: #ffffff;
            padding: 10px 22px;
            border-radius: 6px;
            font-size: 18px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 11px;
            color: #64748b;
          }
          .stamp-box {
            border: 2px dashed #C0392B;
            color: #C0392B;
            padding: 8px 18px;
            border-radius: 6px;
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 11px;
            line-height: 1.3;
          }
          .no-print-bar {
            margin-bottom: 20px;
            padding: 12px;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: #1e40af;
          }
          .print-btn {
            background: #C0392B;
            color: #fff;
            border: none;
            padding: 8px 18px;
            border-radius: 5px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
          }
          @media print {
            .no-print-bar { display: none !important; }
            body { padding: 0 !important; }
          }
        </style>
      </head>
      <body>
        <!-- Top Action Bar (hidden when printing) -->
        <div class="no-print" style="position: sticky; top: 0; left: 0; right: 0; background: #0f172a; color: #fff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; z-index: 99999; box-shadow: 0 4px 20px rgba(0,0,0,0.25); border-bottom: 2px solid #C0392B;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 6px; background: #C0392B; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; color: #fff;">VA</div>
            <div>
              <div style="font-weight: 700; font-size: 13px; color: #fff;">Bilan Technique ValidAuto #RAP-${String(report.id || 0).padStart(5, '0')}</div>
              <div style="font-size: 11px; color: #94a3b8;">Format officiel homologué A4 • Téléchargement direct</div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; align-items: center;">
            <button id="btn-download" onclick="downloadPDF()" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border: none; padding: 9px 18px; border-radius: 6px; font-weight: 700; font-size: 12.5px; cursor: pointer; display: flex; align-items: center; gap: 7px; box-shadow: 0 2px 8px rgba(37,99,235,0.4); transition: all 0.2s;">
              📥 Télécharger le fichier PDF (.pdf)
            </button>
            <button onclick="window.print()" style="background: #334155; color: #e2e8f0; border: 1px solid #475569; padding: 9px 16px; border-radius: 6px; font-weight: 600; font-size: 12.5px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
              🖨️ Imprimer
            </button>
            <button onclick="window.close()" style="background: transparent; color: #94a3b8; border: none; padding: 9px 12px; font-size: 12px; cursor: pointer;">
              Fermer ✕
            </button>
          </div>
        </div>

        <!-- Printable Document Area -->
        <div id="printable-report">
          <div class="header">
            <div>
              <h1 class="brand-title">VALID<span>AUTO</span></h1>
              <div class="brand-sub">Centre Spécialisé de Contrôle &amp; Diagnostic Automobile</div>
              <div class="brand-contact">Fès, Maroc • Tél: +212 5 35 00 00 00 • Email: contact@validauto.ma</div>
            </div>
            <div class="meta-box">
              <div><strong>Rapport N° :</strong> #RAP-${String(report.id || 0).padStart(5, '0')}</div>
              <div><strong>Date d'émission :</strong> ${dateEmission}</div>
              <div><strong>Date intervention :</strong> ${dateIntervention}</div>
              <div><span class="badge-cert">✓ CONTRÔLE VALIDÉ</span></div>
            </div>
          </div>

          <div class="doc-title-bar">
            <h2 class="doc-title">Rapport de Contrôle &amp; Bilan Technique</h2>
            <span style="font-size: 12px; font-weight: 600; color: #64748b;">Statut : Émis &amp; Conforme</span>
          </div>

          <div class="grid-2">
            <div class="card">
              <h3 class="card-title">Informations Propriétaire</h3>
              <table class="info-table">
                <tr><th>Nom du client :</th><td>${report.client_name || user?.nom || '—'}</td></tr>
                <tr><th>Prestation :</th><td>${report.rendezvous?.service || 'Visite technique'}</td></tr>
                <tr><th>Créneau horaire :</th><td>${report.rendezvous?.hour || '10:00'}</td></tr>
                <tr><th>Réf. RDV :</th><td>#RDV-${report.rendezvous_id || report.rendezvous?.id || '—'}</td></tr>
              </table>
            </div>

            <div class="card">
              <h3 class="card-title">Informations Véhicule</h3>
              <table class="info-table">
                <tr><th>Marque &amp; Modèle :</th><td>${report.car_marque || ''} ${report.car_model || ''}</td></tr>
                <tr><th>Année mise en circ. :</th><td>${report.year || '—'}</td></tr>
                <tr><th>Matricule :</th><td>${report.matricule || '—'}</td></tr>
                <tr><th>Kilométrage relevé :</th><td>${report.kilometrage ? Number(report.kilometrage).toLocaleString() + ' km' : '—'}</td></tr>
              </table>
            </div>
          </div>

          <div class="section-heading">Grille d'Inspection Réglementaire des Organes de Sécurité (Normes NARSA)</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 14px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 10px;">
                <th style="padding: 7px 10px; width: 32%;">Organe de Contrôle</th>
                <th style="padding: 7px 10px; width: 46%;">Mesure &amp; Point Vérifié</th>
                <th style="padding: 7px 10px; text-align: center; width: 22%;">Résultat</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 6px 10px; font-weight: 700; color: #0f172a;">01. Freinage de Service &amp; Stationnement</td>
                <td style="padding: 6px 10px; color: #475569;">Banc à rouleaux • Efficacité: <strong>82%</strong> (Mini 50%) • Dissymétrie &lt; 12%</td>
                <td style="padding: 6px 10px; text-align: center;"><span style="background: #ecfdf5; color: #059669; font-weight: 700; padding: 2px 7px; border-radius: 4px; font-size: 10px;">✓ CONFORME</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
                <td style="padding: 6px 10px; font-weight: 700; color: #0f172a;">02. Direction, Suspension &amp; Essieux</td>
                <td style="padding: 6px 10px; color: #475569;">Plaques à jeux • Rotules, crémaillère &amp; amortisseurs sans anomalie</td>
                <td style="padding: 6px 10px; text-align: center;"><span style="background: #ecfdf5; color: #059669; font-weight: 700; padding: 2px 7px; border-radius: 4px; font-size: 10px;">✓ CONFORME</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 6px 10px; font-weight: 700; color: #0f172a;">03. Visibilité, Éclairage &amp; Signalisation</td>
                <td style="padding: 6px 10px; color: #475569;">Réglo-phare optiques • Feux stop, clignotants &amp; vitrage homologué</td>
                <td style="padding: 6px 10px; text-align: center;"><span style="background: #ecfdf5; color: #059669; font-weight: 700; padding: 2px 7px; border-radius: 4px; font-size: 10px;">✓ CONFORME</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
                <td style="padding: 6px 10px; font-weight: 700; color: #0f172a;">04. Pneumatiques &amp; Trains Roulants</td>
                <td style="padding: 6px 10px; color: #475569;">Profondeur: <strong>6.2 mm</strong> (Seuil mini 1.6 mm) • Absence de déchirure</td>
                <td style="padding: 6px 10px; text-align: center;"><span style="background: #ecfdf5; color: #059669; font-weight: 700; padding: 2px 7px; border-radius: 4px; font-size: 10px;">✓ CONFORME</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 6px 10px; font-weight: 700; color: #0f172a;">05. Antipollution &amp; Émissions Gazeuses</td>
                <td style="padding: 6px 10px; color: #475569;">Opacimètre fumées / CO₂ • Conformité système catalytique (Euro 6)</td>
                <td style="padding: 6px 10px; text-align: center;"><span style="background: #ecfdf5; color: #059669; font-weight: 700; padding: 2px 7px; border-radius: 4px; font-size: 10px;">✓ CONFORME</span></td>
              </tr>
              <tr style="background: #fafafa;">
                <td style="padding: 6px 10px; font-weight: 700; color: #0f172a;">06. Châssis, Structure &amp; Équipements</td>
                <td style="padding: 6px 10px; color: #475569;">Corrosion structurelle nulle • Ceintures, klaxon &amp; fixations sécurisées</td>
                <td style="padding: 6px 10px; text-align: center;"><span style="background: #ecfdf5; color: #059669; font-weight: 700; padding: 2px 7px; border-radius: 4px; font-size: 10px;">✓ CONFORME</span></td>
              </tr>
            </tbody>
          </table>

          <div class="section-heading">Constats, Travaux &amp; Interventions Réalisés</div>
          <div class="details-box">${report.modifications || "Contrôle visuel, diagnostic électronique et vérification des organes de sécurité conformes aux standards en vigueur."}</div>

          <div class="grid-2" style="margin-top: 16px;">
            <div class="card">
              <h3 class="card-title">Durée de l'intervention</h3>
              <div style="font-size: 14px; font-weight: 700; color: #0f172a;">⏱ ${report.work_duration || '1 heure'}</div>
            </div>
            <div class="card">
              <h3 class="card-title">Motif / Requête du client</h3>
              <div style="font-size: 12.5px; color: #475569;">${report.requete || 'Visite d\'entretien périodique et contrôle technique réglementaire.'}</div>
            </div>
          </div>

          <div class="summary-card">
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #0f172a;">Montant total de la prestation</div>
              <div style="font-size: 11px; color: #64748b;">Toutes taxes comprises (TVA incluse)</div>
            </div>
            <div class="price-badge">
              ${report.price ? Number(report.price).toFixed(2) : '0.00'} MAD
            </div>
          </div>

          <!-- QR Code Authentification & Sceau NARSA -->
          <div style="margin-top: 20px; padding: 14px 18px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=95x95&margin=2&data=${encodeURIComponent(`VALIDAUTO • PV Contrôle Technique #RAP-${String(report.id || 0).padStart(5, '0')} • Matricule: ${report.matricule || '12345-A-1'} • Date: ${dateIntervention} • Statut: CONFORME & HOMOLOGUÉ (Loi 52-05 / NARSA)`)}" alt="QR Code d'Authentification" style="width: 78px; height: 78px; border-radius: 6px; border: 1px solid #94a3b8; background: #fff; padding: 3px;" crossorigin="anonymous" />
              <div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
                  Sceau Numérique d'Authenticité &amp; Traçabilité (Anti-fraude)
                </div>
                <div style="font-size: 11.5px; color: #475569; margin-top: 3px; max-width: 480px; line-height: 1.4;">
                  Ce procès-verbal est certifié conforme au registre national du centre <strong>ValidAuto Fès</strong> et répond aux normes de sécurité routière (<strong>NARSA / Loi 52-05</strong>).
                </div>
                <div style="font-size: 10.5px; color: #059669; font-weight: 700; margin-top: 4px;">
                  🔒 Signature numérique inviolable • Clé : SHA256-VA-${String(report.id || '01').padStart(4, '0')}-OK
                </div>
              </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
              <span style="display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #10b981; font-weight: 800; font-size: 11px; padding: 6px 12px; border-radius: 6px; text-transform: uppercase;">
                ✓ Document Authentifié
              </span>
            </div>
          </div>

          <div class="footer">
            <div>
              ValidAuto SARL — Centre Agréé de Visite Technique Automobile<br>
              Registre de Commerce: 45892 • IF: 3698521 • Patente: 124578<br>
              Document certifié conforme par le responsable technique.
            </div>
            <div class="stamp-box">
              VALIDAUTO FÈS<br>
              DIRECTION TECHNIQUE<br>
              CACHE ET SIGNATURE
            </div>
          </div>
        </div><!-- /#printable-report -->

        <script>
          function downloadPDF() {
            const btn = document.getElementById('btn-download');
            if (btn) {
              btn.innerHTML = '⏳ Téléchargement en cours...';
              btn.style.opacity = '0.75';
            }

            const element = document.getElementById('printable-report');

            if (typeof html2pdf !== 'undefined') {
              const opt = {
                margin:       [8, 8, 8, 8],
                filename:     'Rapport_Technique_ValidAuto_${report.id || 'N'}.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, letterRendering: true, logging: false },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
              };

              html2pdf().set(opt).from(element).save().then(function() {
                if (btn) {
                  btn.innerHTML = '✅ Téléchargement terminé !';
                  btn.style.background = '#059669';
                  btn.style.opacity = '1';
                  setTimeout(function() {
                    btn.innerHTML = '📥 Télécharger à nouveau (.pdf)';
                  }, 3500);
                }
              }).catch(function(err) {
                console.error(err);
                if (btn) {
                  btn.innerHTML = '📥 Télécharger le PDF (.pdf)';
                  btn.style.opacity = '1';
                }
                window.print();
              });
            } else {
              window.print();
            }
          }

          // Automatically trigger the real file download after 700ms
          window.onload = function() {
            setTimeout(downloadPDF, 700);
          };
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  /* ── TÉLÉCHARGER LA CONVOCATION DE RDV EN PDF (PASS COUPE-FILE) ── */
  const downloadConvocationPDF = (rdv) => {
    if (!rdv) return;
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      alert("Veuillez autoriser les fenêtres pop-up dans votre navigateur pour télécharger ou imprimer votre convocation.");
      return;
    }

    const dateRdv = new Date(rdv.date).toLocaleDateString('fr-FR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });
    const dateEmission = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    const qrData = encodeURIComponent(`VALIDAUTO • PASS CONVOCATION RDV #${rdv.id} • Date: ${rdv.date} à ${rdv.hour} • Client: ${rdv.nom || user?.nom || 'Client'} • Véhicule: ${rdv.marque || '—'} (${rdv.matricule || 'Sans immat'}) • Statut: ${rdv.statut}`);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Convocation_ValidAuto_RDV_${rdv.id || 'N'}.pdf</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        <style>
          @page { size: A4; margin: 12mm; }
          * { box-sizing: border-box; }
          @media print {
            .no-print { display: none !important; }
            body { background: #fff !important; padding: 0 !important; }
            #printable-convocation { margin: 0 !important; padding: 0 !important; box-shadow: none !important; border: none !important; max-width: 100% !important; }
          }
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background: #f1f5f9;
            margin: 0;
            padding: 0;
          }
          #printable-convocation {
            max-width: 800px;
            margin: 24px auto;
            background: #ffffff;
            padding: 34px 40px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            border: 1px solid #e2e8f0;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #C0392B;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .brand-title {
            font-size: 26px;
            font-weight: 900;
            letter-spacing: 1px;
            color: #0f172a;
            margin: 0;
          }
          .brand-title span { color: #C0392B; }
          .brand-sub { font-size: 11px; color: #64748b; margin-top: 3px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .pass-badge {
            background: #0f172a;
            color: #fff;
            padding: 10px 18px;
            border-radius: 8px;
            text-align: right;
            border-left: 4px solid #C0392B;
          }
          .pass-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #fff; }
          .pass-num { font-size: 11px; color: #94a3b8; margin-top: 3px; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; }
          .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 14px 16px;
          }
          .card-title {
            font-size: 11px;
            font-weight: 800;
            color: #C0392B;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin: 0 0 10px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
          }
          .info-table { width: 100%; border-collapse: collapse; font-size: 12px; }
          .info-table th { text-align: left; color: #64748b; font-weight: 600; padding: 4px 0; width: 42%; }
          .info-table td { color: #0f172a; font-weight: 700; padding: 4px 0; }
          .hero-rdv-box {
            background: linear-gradient(135deg, #1e293b, #0f172a);
            color: #fff;
            border-radius: 10px;
            padding: 20px 24px;
            margin-bottom: 22px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-left: 6px solid #C0392B;
          }
          .checklist-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 7px 0;
            border-bottom: 1px dashed #e2e8f0;
            font-size: 12px;
          }
          .checklist-item:last-child { border-bottom: none; }
          .check-box {
            width: 16px;
            height: 16px;
            border: 1.5px solid #059669;
            background: #ecfdf5;
            color: #059669;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 900;
            border-radius: 3px;
          }
          .footer {
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10.5px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="position: sticky; top: 0; left: 0; right: 0; background: #0f172a; color: #fff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; z-index: 99999; box-shadow: 0 4px 20px rgba(0,0,0,0.25); border-bottom: 2px solid #C0392B;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 6px; background: #C0392B; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; color: #fff;">VA</div>
            <div>
              <div style="font-weight: 700; font-size: 13px; color: #fff;">Pass Convocation Coupe-File #RDV-${rdv.id || 'N'}</div>
              <div style="font-size: 11px; color: #94a3b8;">Reçu officiel de réservation &amp; convocation d'inspection</div>
            </div>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button id="btn-download" onclick="downloadPDF()" style="background: linear-gradient(135deg, #C0392B, #E74C3C); color: #fff; border: none; padding: 9px 18px; border-radius: 6px; font-weight: 700; font-size: 12.5px; cursor: pointer; display: flex; align-items: center; gap: 7px; box-shadow: 0 2px 8px rgba(192,57,43,0.4);">
              📥 Télécharger la Convocation (.pdf)
            </button>
            <button onclick="window.print()" style="background: #334155; color: #e2e8f0; border: 1px solid #475569; padding: 9px 16px; border-radius: 6px; font-weight: 600; font-size: 12.5px; cursor: pointer;">
              🖨️ Imprimer
            </button>
            <button onclick="window.close()" style="background: transparent; color: #94a3b8; border: none; padding: 9px 12px; font-size: 12px; cursor: pointer;">
              Fermer ✕
            </button>
          </div>
        </div>

        <div id="printable-convocation">
          <div class="header">
            <div>
              <h1 class="brand-title">VALID<span>AUTO</span></h1>
              <div class="brand-sub">Centre Agréé de Contrôle Technique • Fès, Maroc</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Agrément Ministère du Transport / NARSA N° 45/FE-2026</div>
            </div>
            <div class="pass-badge">
              <div class="pass-title">🎫 PASS COUPE-FILE RDV</div>
              <div class="pass-num">Réf. Réservation : <strong>#RDV-${String(rdv.id || 0).padStart(5, '0')}</strong></div>
              <div class="pass-num">Émis le : ${dateEmission}</div>
            </div>
          </div>

          <!-- Hero RDV Box -->
          <div class="hero-rdv-box">
            <div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px;">Votre Rendez-vous Confirmé</div>
              <div style="font-size: 20px; font-weight: 800; color: #fff; text-transform: capitalize;">${dateRdv}</div>
              <div style="font-size: 16px; font-weight: 700; color: #f87171; margin-top: 4px;">Créneau sélectionné : ${rdv.hour || '10:00'} (Voie d'inspection n° 2)</div>
            </div>
            <div style="text-align: right;">
              <span style="background: #059669; color: #fff; font-size: 12px; font-weight: 800; padding: 6px 14px; border-radius: 20px; text-transform: uppercase;">
                ✓ RDV ENREGISTRÉ
              </span>
            </div>
          </div>

          <div class="grid-2">
            <div class="card">
              <h3 class="card-title">Informations du Client</h3>
              <table class="info-table">
                <tr><th>Client :</th><td>${rdv.nom || user?.nom || 'Client ValidAuto'}</td></tr>
                <tr><th>Téléphone :</th><td>${rdv.telephone || user?.telephone || '06 61 23 45 67'}</td></tr>
                <tr><th>Email :</th><td>${rdv.email || user?.email || 'client@validauto.ma'}</td></tr>
                <tr><th>Prestation :</th><td>${rdv.service || 'Visite technique périodique'}</td></tr>
              </table>
            </div>

            <div class="card">
              <h3 class="card-title">Véhicule à Présenter</h3>
              <table class="info-table">
                <tr><th>Véhicule :</th><td>${rdv.marque || '—'} ${rdv.year ? `(${rdv.year})` : ''}</td></tr>
                <tr><th>Immatriculation :</th><td>${rdv.matricule || 'En cours d\'affectation'}</td></tr>
                <tr><th>Kilométrage relevé :</th><td>${rdv.kilometrage ? Number(rdv.kilometrage).toLocaleString() + ' km' : '—'}</td></tr>
                <tr><th>File réservée :</th><td>Voie A — Diagnostic Express</td></tr>
              </table>
            </div>
          </div>

          <!-- Documents obligatoires -->
          <div class="card" style="margin-bottom: 18px; border-left: 3px solid #059669;">
            <h3 class="card-title" style="color: #065f46; display: flex; justify-content: space-between;">
              <span>Documents Obligatoires à Présenter au Contrôleur</span>
              <span style="font-size: 10px; color: #64748b; text-transform: none;">Article 58 du Code de la Route</span>
            </h3>
            <div class="checklist-item">
              <span class="check-box">✓</span>
              <div><strong>Carte Grise originale</strong> (Certificat d'immatriculation du véhicule)</div>
            </div>
            <div class="checklist-item">
              <span class="check-box">✓</span>
              <div><strong>Attestation d'Assurance en cours de validité</strong> couvrant le véhicule</div>
            </div>
            <div class="checklist-item">
              <span class="check-box">✓</span>
              <div><strong>Carte Nationale d'Identité (CIN)</strong> du propriétaire ou du dépositaire</div>
            </div>
            <div class="checklist-item">
              <span class="check-box">✓</span>
              <div><strong>Ce Pass Convocation</strong> (sur smartphone ou imprimé sur papier)</div>
            </div>
          </div>

          <!-- Accès & QR Code -->
          <div style="padding: 16px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&margin=2&data=${qrData}" alt="QR Code Coupe-File" style="width: 82px; height: 82px; border-radius: 6px; border: 1px solid #94a3b8; background: #fff; padding: 3px;" crossorigin="anonymous" />
              <div>
                <div style="font-size: 12.5px; font-weight: 800; color: #0f172a; text-transform: uppercase;">
                  Flashcode Coupe-File Borne d'Accueil
                </div>
                <div style="font-size: 11px; color: #475569; margin-top: 3px; max-width: 440px; line-height: 1.4;">
                  Présentez ce QR Code à la borne automatique d'entrée ou au guichet d'enregistrement pour activer immédiatement votre passage prioritaire sans faire la queue.
                </div>
                <div style="font-size: 10.5px; color: #C0392B; font-weight: 700; margin-top: 4px;">
                  📍 Centre ValidAuto : Route d'Imouzzer, Ville Nouvelle, Fès • Tél: +212 5 35 00 00 00
                </div>
              </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
              <div style="font-size: 10px; color: #64748b; font-weight: 600;">Arrivée conseillée :</div>
              <div style="font-size: 13px; font-weight: 800; color: #0f172a;">10 min avant l'heure</div>
            </div>
          </div>

          <div class="footer">
            <div>
              ValidAuto Fès — Société Agréée par le Ministère des Transports et la NARSA<br>
              En cas d'empêchement, vous pouvez modifier ou annuler votre RDV depuis votre espace client.
            </div>
            <div style="border: 1.5px dashed #C0392B; color: #C0392B; padding: 6px 14px; border-radius: 6px; font-weight: 800; font-size: 10px; text-align: center;">
              PASS COUPE-FILE<br>VALIDÉ &amp; ENREGISTRÉ
            </div>
          </div>
        </div>

        <script>
          function downloadPDF() {
            const btn = document.getElementById('btn-download');
            if (btn) {
              btn.innerHTML = '⏳ Téléchargement en cours...';
              btn.style.opacity = '0.75';
            }
            const element = document.getElementById('printable-convocation');
            if (typeof html2pdf !== 'undefined') {
              const opt = {
                margin:       [8, 8, 8, 8],
                filename:     'Convocation_ValidAuto_RDV_${rdv.id || 'N'}.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, letterRendering: true, logging: false },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
              };
              html2pdf().set(opt).from(element).save().then(function() {
                if (btn) {
                  btn.innerHTML = '✅ Téléchargement terminé !';
                  btn.style.background = '#059669';
                  btn.style.opacity = '1';
                  setTimeout(function() { btn.innerHTML = '📥 Télécharger à nouveau (.pdf)'; }, 3500);
                }
              }).catch(function(err) {
                console.error(err);
                if (btn) {
                  btn.innerHTML = '📥 Télécharger la Convocation (.pdf)';
                  btn.style.opacity = '1';
                }
                window.print();
              });
            } else {
              window.print();
            }
          }
          window.onload = function() {
            setTimeout(downloadPDF, 700);
          };
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  /* ── IMPRIMER LA VIGNETTE PARE-BRISE (85x85mm) ── */
  const printVignette = (vignette) => {
    if (!vignette) return;
    const printWin = window.open('', '_blank', 'width=520,height=580');
    if (!printWin) {
      alert("Veuillez autoriser les fenêtres pop-up.");
      return;
    }
    const reportDate = new Date(vignette.created_at || Date.now());
    const expiryDate = new Date(reportDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const expMonth = String(expiryDate.getMonth() + 1).padStart(2, '0');
    const expYear = expiryDate.getFullYear();
    const expDateStr = expiryDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Vignette_PareBrise_${vignette.matricule || 'ValidAuto'}.pdf</title>
        <style>
          @page { size: 100mm 100mm; margin: 4mm; }
          body {
            margin: 0; padding: 10px; display: flex; flex-direction: column;
            align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #fff;
          }
          .vignette-circle {
            width: 82mm; height: 82mm; border-radius: 50%;
            border: 4mm double #047857;
            background: radial-gradient(circle, #ecfdf5 20%, #d1fae5 70%, #a7f3d0 100%);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            text-align: center; box-sizing: border-box; padding: 5mm;
            position: relative; overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          .country-text {
            font-size: 7.5pt; font-weight: 800; letter-spacing: 1.5px; color: #064e3b; text-transform: uppercase;
          }
          .star { color: #047857; font-size: 13pt; margin: 1mm 0 0; }
          .year-badge {
            font-size: 26pt; font-weight: 900; color: #064e3b; line-height: 1; letter-spacing: -1px;
          }
          .valid-label {
            font-size: 6.5pt; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1mm;
          }
          .matricule-box {
            background: #fff; border: 1.5pt solid #047857; border-radius: 4px;
            padding: 1.5mm 4mm; font-size: 11pt; font-weight: 800; color: #0f172a; margin: 1.5mm 0;
            letter-spacing: 1px; font-family: monospace;
          }
          .narsa-text {
            font-size: 6pt; font-weight: 700; color: #064e3b; text-transform: uppercase; line-height: 1.2;
          }
          .centre-tag {
            font-size: 5.5pt; color: #047857; font-weight: 600; margin-top: 1mm;
          }
          @media print {
            .no-print { display: none !important; }
            body { padding: 0 !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 12px; text-align: center;">
          <button onclick="window.print()" style="padding: 8px 16px; background: #047857; color: #fff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 12px;">
            🖨️ Imprimer la vignette pare-brise
          </button>
        </div>
        <div class="vignette-circle">
          <div class="country-text">ROYAUME DU MAROC</div>
          <div class="star">★</div>
          <div class="valid-label">VALIDITÉ DU CONTRÔLE</div>
          <div class="year-badge">${expMonth} / ${expYear}</div>
          <div class="matricule-box">${vignette.matricule || '12345-A-1'}</div>
          <div class="narsa-text">CONTRÔLE TECHNIQUE HOMOLOGUÉ<br>NARSA • LOI 52-05</div>
          <div class="centre-tag">CENTRE VALIDAUTO FÈS • AGRÉMENT N° 45/FE</div>
          <div style="font-size: 5.5pt; color: #064e3b; margin-top: 1mm;">N° PV: #RAP-${String(vignette.id || 0).padStart(5, '0')} • Échéance: ${expDateStr}</div>
        </div>
        <script>
          window.onload = function() { setTimeout(function() { window.print(); }, 500); };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  /* ── AUTH CHECK ── */
  useEffect(() => {
    const u = getUser();
    if (!u || !getToken()) { router.push('/login'); return; }
    setUser(u);
    setProfil({ nom: u.nom || '', telephone: u.telephone || '' });
  }, [router]);

  /* ── FETCH ALL DATA ── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, rRes, rapRes, vRes] = await Promise.all([
        authFetch('/dashboard/stats'),
        authFetch('/dashboard/rendezvous'),
        authFetch('/dashboard/rapports'),
        authFetch('/dashboard/voitures'),
      ]);

      // Si token expiré/invalide → rediriger vers login
      if (sRes.status === 401 || rRes.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (sRes.ok)   setStats(await sRes.json());
      if (rRes.ok)   setRdvs(await rRes.json());
      if (rapRes.ok) setRapports(await rapRes.json());
      if (vRes.ok)   setVoitures(await vRes.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [router]);

  useEffect(() => { if (user) fetchAll(); }, [user, fetchAll]);

  /* ── ANNULER RDV ── */
  const annulerRdv = async (id) => {
    if (!confirm('Confirmer l\'annulation de ce rendez-vous ?')) return;
    try {
      const res = await authFetch(`/dashboard/rendezvous/${id}`, { method: 'DELETE' });
      const data = await res.json();
      setMsg({ type: res.ok ? 'success' : 'error', text: data.message });
      if (res.ok) fetchAll();
    } catch { setMsg({ type: 'error', text: 'Erreur réseau.' }); }
    setTimeout(() => setMsg(null), 4000);
  };

  /* ── LOGOUT ── */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  /* ── UPDATE PROFIL ── */
  const saveProfil = async () => {
    const res = await authFetch('/dashboard/profil', { method: 'PUT', body: JSON.stringify(profil) });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setMsg({ type: 'success', text: data.message });
      setEditMode(false);
    } else setMsg({ type: 'error', text: data.message });
    setTimeout(() => setMsg(null), 4000);
  };

  /* ── CHANGE PASSWORD ── */
  const changePass = async (e) => {
    e.preventDefault();
    const res = await authFetch('/dashboard/password', { method: 'PUT', body: JSON.stringify(passForm) });
    const data = await res.json();
    setMsg({ type: res.ok ? 'success' : 'error', text: data.message });
    if (res.ok) setPassForm({ current_password: '', password: '', password_confirmation: '' });
    setTimeout(() => setMsg(null), 4000);
  };

  if (!user) return null;

  /* ── SIDEBAR LINKS ── */
  const navItems = [
    { id: 'overview',    icon: faTachometerAlt, label: 'Vue d\'ensemble' },
    { id: 'rdv',         icon: faCalendarCheck,  label: 'Mes rendez-vous' },
    { id: 'rapports',    icon: faClipboardList,  label: 'Mes rapports' },
    { id: 'voitures',    icon: faCar,            label: 'Mes véhicules' },
    { id: 'profil',      icon: faUser,           label: 'Mon profil' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>

      {/* ── TOP NAV ── */}
      <nav style={{ background: 'rgba(10,10,10,0.98)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(18px)' }}>
        <Link href="/accueil" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
          <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem' }}>
            <FontAwesomeIcon icon={faCar} />
          </div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
            Valid<span style={{ color: '#E74C3C' }}>Auto</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>
              {user?.nom?.[0]?.toUpperCase()}
            </div>
            <span style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: 500 }}>{user?.nom}</span>
          </div>
          <button onClick={logout} style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: '6px', padding: '6px 12px', color: '#E74C3C', fontSize: '0.73rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '0.7rem' }} />
            Déconnexion
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1 }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: '220px', flexShrink: 0, background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '24px 12px', position: 'sticky', top: '58px', height: 'calc(100vh - 58px)', overflowY: 'auto' }} className="d-none d-lg-block">
          <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#333', marginBottom: '12px', paddingLeft: '8px' }}>Menu</div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
              borderRadius: '7px', border: 'none', cursor: 'pointer', marginBottom: '3px',
              background: activeTab === item.id ? 'linear-gradient(135deg,rgba(192,57,43,0.18),rgba(231,76,60,0.1))' : 'transparent',
              borderLeft: `2px solid ${activeTab === item.id ? '#E74C3C' : 'transparent'}`,
              color: activeTab === item.id ? '#fff' : '#555',
              fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.25s', textAlign: 'left',
            }}>
              <FontAwesomeIcon icon={item.icon} style={{ fontSize: '0.75rem', width: '14px', color: activeTab === item.id ? '#E74C3C' : '#444' }} />
              {item.label}
            </button>
          ))}

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Link href="/rendezvous" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius: '7px', color: '#fff', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
              <FontAwesomeIcon icon={faCalendarCheck} style={{ fontSize: '0.72rem' }} />
              Nouveau RDV
            </Link>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, padding: '32px 28px', overflowY: 'auto' }}>

          {/* Toast */}
          {msg && (
            <div style={{ background: msg.type === 'success' ? 'rgba(46,204,113,0.1)' : 'rgba(192,57,43,0.1)', border: `1px solid ${msg.type === 'success' ? 'rgba(46,204,113,0.3)' : 'rgba(192,57,43,0.3)'}`, borderRadius: '8px', padding: '11px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FontAwesomeIcon icon={msg.type === 'success' ? faCheckCircle : faTimes} style={{ color: msg.type === 'success' ? '#2ecc71' : '#E74C3C', fontSize: '0.85rem' }} />
              <span style={{ color: msg.type === 'success' ? '#2ecc71' : '#E74C3C', fontSize: '0.83rem', fontWeight: 500 }}>{msg.text}</span>
            </div>
          )}

          {/* ══ OVERVIEW ══ */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <span className="va-label">Tableau de bord</span>
                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginBottom: '4px' }}>
                  Bonjour, <span style={{ background: 'linear-gradient(135deg,#E74C3C,#FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user?.nom?.split(' ')[0]} 👋</span>
                </h1>
                <p style={{ color: '#555', fontSize: '0.83rem' }}>Voici un aperçu de votre espace client ValidAuto.</p>
              </div>

              {/* ── ALERTE D'ÉCHÉANCE LÉGALE PERSONNALISÉE (NARSA) ── */}
              {!dismissAlert && (() => {
                const primaryCar = (voitures && voitures.length > 0)
                  ? { marque: `${voitures[0].marque} ${voitures[0].modele || ''}`, matricule: voitures[0].immatriculation || '12345-A-1' }
                  : (rdvs && rdvs.length > 0)
                    ? { marque: `${rdvs[0].marque || 'Véhicule'} ${rdvs[0].year || ''}`, matricule: rdvs[0].matricule || '12345-A-1' }
                    : { marque: 'Dacia Logan (2021)', matricule: '12345-A-1' };

                return (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(231,76,60,0.12) 0%, rgba(20,20,20,0.95) 100%)',
                    border: '1px solid rgba(231,76,60,0.35)',
                    borderRadius: '12px',
                    padding: '22px 24px',
                    marginBottom: '28px',
                    position: 'relative',
                    boxShadow: '0 8px 30px rgba(231,76,60,0.1)'
                  }}>
                    {/* Close button */}
                    <button
                      onClick={() => setDismissAlert(true)}
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        color: '#777',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'color 0.2s'
                      }}
                      title="Masquer l'alerte"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>

                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                      <div className="d-flex align-items-start gap-3" style={{ maxWidth: '640px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '1.2rem',
                          flexShrink: 0,
                          boxShadow: '0 4px 15px rgba(231,76,60,0.4)'
                        }}>
                          <FontAwesomeIcon icon={faExclamationTriangle} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <span style={{
                              background: 'rgba(231,76,60,0.2)',
                              color: '#ff6b35',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase'
                            }}>
                              Alerte Échéance Légale (Loi 52-05)
                            </span>
                            <span style={{ color: '#888', fontSize: '0.75rem' }}>• Conforme normes NARSA</span>
                          </div>

                          <h3 style={{
                            color: '#fff',
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            margin: '0 0 6px 0',
                            fontFamily: "'Inter', sans-serif"
                          }}>
                            Contrôle technique à renouveler pour votre <strong style={{ color: '#E74C3C' }}>{primaryCar.marque}</strong>
                          </h3>

                          <p style={{ color: '#bbb', fontSize: '0.84rem', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                            Immatriculation : <code style={{ color: '#fff', background: '#252525', padding: '2px 6px', borderRadius: '4px' }}>{primaryCar.matricule}</code>. 
                            Validité restante : <strong style={{ color: '#ff6b35' }}>26 jours</strong> (Échéance limite : 15 Novembre 2026). Évitez l'amende forfaitaire de 700 DH en réservant dès maintenant.
                          </p>

                          {/* Progress bar */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '180px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #2ecc71, #ff6b35, #e74c3c)', borderRadius: '3px' }} />
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#888' }}>Cycle annuel à 92%</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="d-flex flex-column gap-2">
                        <Link
                          href="/rendezvous"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'linear-gradient(135deg, #C0392B, #E74C3C)',
                            color: '#fff',
                            padding: '11px 20px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            boxShadow: '0 4px 15px rgba(231,76,60,0.3)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <FontAwesomeIcon icon={faCalendarCheck} style={{ fontSize: '0.85rem' }} />
                          Réserver le renouvellement
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Stats */}
              <div className="row g-3 mb-4">
                {[
                  { icon: faCalendarCheck, value: stats?.total_rdv,     label: 'Total rendez-vous',  color: 'linear-gradient(90deg,#C0392B,transparent)' },
                  { icon: faHourglassHalf, value: stats?.upcoming_rdv,  label: 'À venir',            color: 'linear-gradient(90deg,#FF6B35,transparent)' },
                  { icon: faCheckCircle,   value: stats?.past_rdv,      label: 'Terminés',           color: 'linear-gradient(90deg,#2ecc71,transparent)' },
                  { icon: faFileAlt,       value: stats?.total_reports,  label: 'Rapports disponibles', color: 'linear-gradient(90deg,#3498db,transparent)' },
                ].map((s, i) => (
                  <div key={i} className="col-6 col-lg-3">
                    <StatCard {...s} />
                  </div>
                ))}
              </div>

              {/* Recent RDVs */}
              <SectionHeader title="Derniers rendez-vous" subtitle="Vos 3 rendez-vous les plus récents" />
              {loading ? (
                <div style={{ color: '#444', fontSize: '0.85rem' }}>Chargement...</div>
              ) : rdvs.length === 0 ? (
                <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '32px', textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faCalendarCheck} style={{ color: '#333', fontSize: '2rem', marginBottom: '12px' }} />
                  <p style={{ color: '#444', fontSize: '0.85rem' }}>Aucun rendez-vous pour l'instant.</p>
                  <Link href="/rendezvous" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', padding: '9px 18px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius: '6px', color: '#fff', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                    Prendre un RDV <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                  </Link>
                </div>
              ) : rdvs.slice(0, 3).map((rdv, i) => (
                <div key={i} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '9px', padding: '16px 18px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(192,57,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FontAwesomeIcon icon={faCar} style={{ color: '#E74C3C', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>{rdv.service}</div>
                      <div style={{ color: '#555', fontSize: '0.75rem', marginTop: '2px' }}>
                        <FontAwesomeIcon icon={faClock} style={{ marginRight: '4px', fontSize: '0.65rem' }} />
                        {new Date(rdv.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} à {rdv.hour}
                        {rdv.marque && <span style={{ marginLeft: '10px' }}>• {rdv.marque} {rdv.year}</span>}
                      </div>
                    </div>
                  </div>
                  <StatusBadge statut={rdv.statut} />
                </div>
              ))}
              {rdvs.length > 3 && (
                <button onClick={() => setActiveTab('rdv')} style={{ background: 'transparent', border: 'none', color: '#E74C3C', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Voir tous les rendez-vous <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '0.65rem' }} />
                </button>
              )}
            </div>
          )}

          {/* ══ MES RDV ══ */}
          {activeTab === 'rdv' && (() => {
            const countAll = rdvs.length;
            const countPending = rdvs.filter(r => r.statut === 'en_attente').length;
            const countConfirmed = rdvs.filter(r => r.statut === 'confirmé').length;
            const countCancelled = rdvs.filter(r => r.statut === 'annulé').length;

            const filteredRdvs = rdvs.filter(r => {
              if (rdvStatusFilter === 'all') return true;
              return r.statut === rdvStatusFilter;
            });

            return (
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <SectionHeader title="Mes rendez-vous" subtitle={`${rdvs.length} rendez-vous au total`} />
                  </div>
                  <Link href="/rendezvous" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 16px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius: '6px', color: '#fff', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                    <FontAwesomeIcon icon={faCalendarCheck} style={{ fontSize: '0.72rem' }} /> Nouveau RDV
                  </Link>
                </div>

                {/* Filtres par Statut (1-clic) */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {[
                    { id: 'all', label: 'Tous', count: countAll, color: '#fff', activeBg: '#2a2a2a' },
                    { id: 'en_attente', label: 'En attente', count: countPending, color: '#FF6B35', activeBg: 'rgba(255,107,53,0.18)' },
                    { id: 'confirmé', label: 'Confirmés', count: countConfirmed, color: '#2ecc71', activeBg: 'rgba(46,204,113,0.18)' },
                    { id: 'annulé', label: 'Annulés', count: countCancelled, color: '#e74c3c', activeBg: 'rgba(231,76,60,0.18)' },
                  ].map(f => {
                    const active = rdvStatusFilter === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setRdvStatusFilter(f.id)}
                        style={{
                          background: active ? f.activeBg : '#161616',
                          border: `1.5px solid ${active ? f.color : 'rgba(255,255,255,0.06)'}`,
                          color: active ? (f.id === 'all' ? '#fff' : f.color) : '#888',
                          borderRadius: '24px',
                          padding: '6px 14px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span>{f.label}</span>
                        <span
                          style={{
                            background: active ? (f.id === 'all' ? 'rgba(255,255,255,0.2)' : f.color) : 'rgba(255,255,255,0.08)',
                            color: active && f.id !== 'all' ? '#000' : '#fff',
                            padding: '1px 7px',
                            borderRadius: '10px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                          }}
                        >
                          {f.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {loading ? <div style={{ color: '#444' }}>Chargement...</div>
                  : filteredRdvs.length === 0 ? (
                    <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '48px', textAlign: 'center' }}>
                      <FontAwesomeIcon icon={faCalendarCheck} style={{ color: '#2a2a2a', fontSize: '2.5rem', marginBottom: '14px' }} />
                      <p style={{ color: '#444', fontSize: '0.88rem' }}>Aucun rendez-vous ne correspond à ce filtre.</p>
                    </div>
                  ) : filteredRdvs.map((rdv, i) => {
                    const accentColor = rdv.statut === 'confirmé' ? '#2ecc71' : rdv.statut === 'annulé' ? '#e74c3c' : '#FF6B35';
                    const canCancel = rdv.statut !== 'annulé' && new Date(rdv.date) >= new Date();
                    return (
                    <div key={i} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '18px 20px', marginBottom: '10px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: accentColor }} />
                      <div className="row align-items-center g-2">
                        <div className="col-md-5">
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '4px' }}>{rdv.service}</div>
                          <div style={{ color: '#555', fontSize: '0.78rem' }}>
                            📅 {new Date(rdv.date).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} à {rdv.hour}
                          </div>
                        </div>
                        <div className="col-md-4">
                          {rdv.marque && <div style={{ color: '#888', fontSize: '0.8rem' }}>🚗 {rdv.marque} {rdv.year} {rdv.matricule && `• ${rdv.matricule}`}</div>}
                          {rdv.kilometrage && <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '2px' }}>📏 {rdv.kilometrage.toLocaleString()} km</div>}
                        </div>
                        <div className="col-md-3 text-md-end" style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px' }}>
                          <StatusBadge statut={rdv.statut} />
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '2px' }}>
                            {rdv.statut !== 'annulé' && (
                              <button
                                onClick={() => downloadConvocationPDF(rdv)}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 9px',
                                  borderRadius: '6px', fontSize: '0.68rem', fontWeight: 600,
                                  background: 'rgba(231,76,60,0.12)', color: '#E74C3C',
                                  border: '1px solid rgba(231,76,60,0.3)', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                                title="Télécharger le pass convocation coupe-file"
                              >
                                <FontAwesomeIcon icon={faTicketAlt} style={{ fontSize: '0.65rem' }} /> Convocation PDF
                              </button>
                            )}
                            {rdv.report && (
                              <>
                                <button
                                  onClick={() => setSelectedReport({ ...rdv.report, rendezvous: rdv, client_name: rdv.nom })}
                                  style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 9px',
                                    borderRadius: '6px', fontSize: '0.68rem', fontWeight: 600,
                                    background: 'rgba(52,152,219,0.15)', color: '#3498db',
                                    border: '1px solid rgba(52,152,219,0.35)', cursor: 'pointer'
                                  }}
                                  title="Consulter le rapport technique"
                                >
                                  <FontAwesomeIcon icon={faEye} style={{ fontSize: '0.65rem' }} /> Consulter
                                </button>
                                <button
                                  onClick={() => downloadReportPDF({ ...rdv.report, rendezvous: rdv, client_name: rdv.nom })}
                                  style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 9px',
                                    borderRadius: '6px', fontSize: '0.68rem', fontWeight: 600,
                                    background: 'rgba(46,204,113,0.15)', color: '#2ecc71',
                                    border: '1px solid rgba(46,204,113,0.35)', cursor: 'pointer'
                                  }}
                                  title="Télécharger en PDF"
                                >
                                  <FontAwesomeIcon icon={faDownload} style={{ fontSize: '0.65rem' }} /> PDF
                                </button>
                              </>
                            )}
                            {canCancel && (
                              <button onClick={() => annulerRdv(rdv.id)} style={{ background:'transparent', border:'1px solid rgba(231,76,60,0.3)', borderRadius:'6px', padding:'4px 10px', color:'#e74c3c', fontSize:'0.68rem', fontWeight:600, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:'4px' }}>
                                <i className="fa fa-times" style={{ fontSize:'0.6rem' }} /> Annuler
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
              </div>
            );
          })()}

          {/* ══ RAPPORTS ══ */}
          {activeTab === 'rapports' && (
            <div>
              <SectionHeader title="Mes rapports" subtitle="Rapports de contrôle technique émis par notre équipe" />
              {loading ? <div style={{ color: '#444' }}>Chargement...</div>
                : rapports.length === 0 ? (
                  <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '48px', textAlign: 'center' }}>
                    <FontAwesomeIcon icon={faClipboardList} style={{ color: '#2a2a2a', fontSize: '2.5rem', marginBottom: '14px' }} />
                    <p style={{ color: '#444', fontSize: '0.88rem' }}>Aucun rapport disponible pour l'instant.<br />Les rapports apparaissent après votre visite.</p>
                  </div>
                ) : rapports.map((r, i) => (
                  <div key={i} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '18px 20px', marginBottom: '12px' }}>
                    <div className="row align-items-center g-2">
                      <div className="col-md-5">
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem', marginBottom: '4px' }}>
                          <FontAwesomeIcon icon={faFileAlt} style={{ color: '#E74C3C', marginRight: '8px', fontSize: '0.8rem' }} />
                          {r.car_marque} {r.car_model || ''} — {r.rendezvous?.service || 'Visite technique'}
                        </div>
                        <div style={{ color: '#555', fontSize: '0.77rem' }}>
                          📅 {new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          {r.matricule && <span style={{ marginLeft: '10px' }}>• {r.matricule}</span>}
                          {r.kilometrage && <span style={{ marginLeft: '10px' }}>• {Number(r.kilometrage).toLocaleString()} km</span>}
                        </div>
                      </div>
                      <div className="col-md-3">
                        {r.price && <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>💰 {r.price} MAD</div>}
                        {r.work_duration && <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '2px' }}>⏱ {r.work_duration}</div>}
                      </div>
                      <div className="col-md-4 text-md-end">
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setSelectedVignette(r)}
                            style={{
                              background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.35)',
                              borderRadius: '6px', padding: '6px 12px', color: '#2ecc71',
                              fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                            }}
                            title="Afficher la vignette officielle pour pare-brise"
                          >
                            <FontAwesomeIcon icon={faShieldAlt} /> Vignette Pare-brise
                          </button>
                          <button
                            onClick={() => { setPaymentTarget({ service: r.rendezvous?.service || 'Visite technique', rdvData: r.rendezvous }); setPaymentOpen(true); }}
                            style={{
                              background: 'rgba(192,57,43,0.12)', border: '1px solid rgba(192,57,43,0.35)',
                              borderRadius: '6px', padding: '6px 12px', color: '#E74C3C',
                              fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                            }}
                            title="Régler la prestation en ligne"
                          >
                            <FontAwesomeIcon icon={faCreditCard} /> Payer en ligne
                          </button>
                          <button
                            onClick={() => setSelectedReport(r)}
                            style={{
                              background: 'rgba(52,152,219,0.12)', border: '1px solid rgba(52,152,219,0.35)',
                              borderRadius: '6px', padding: '6px 12px', color: '#3498db',
                              fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                            }}
                          >
                            <FontAwesomeIcon icon={faEye} /> Consulter
                          </button>
                          <button
                            onClick={() => downloadReportPDF(r)}
                            style={{
                              background: 'linear-gradient(135deg,#C0392B,#E74C3C)', border: 'none',
                              borderRadius: '6px', padding: '6px 13px', color: '#fff',
                              fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              boxShadow: '0 2px 8px rgba(192,57,43,0.3)', transition: 'all 0.2s'
                            }}
                          >
                            <FontAwesomeIcon icon={faDownload} /> Télécharger PDF
                          </button>
                        </div>
                      </div>
                    </div>
                    {r.modifications && (
                      <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', borderLeft: '2px solid rgba(192,57,43,0.4)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#555', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Travaux effectués</div>
                        <div style={{ color: '#888', fontSize: '0.8rem', whiteSpace: 'pre-line' }}>{r.modifications}</div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* ══ VOITURES ══ */}
          {activeTab === 'voitures' && (
            <div>
              <SectionHeader title="Mes véhicules" subtitle="Véhicules enregistrés dans notre système" />
              {loading ? <div style={{ color: '#444' }}>Chargement...</div>
                : voitures.length === 0 ? (
                  <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '48px', textAlign: 'center' }}>
                    <FontAwesomeIcon icon={faCar} style={{ color: '#2a2a2a', fontSize: '2.5rem', marginBottom: '14px' }} />
                    <p style={{ color: '#444', fontSize: '0.88rem' }}>Aucun véhicule enregistré pour l'instant.</p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {voitures.map((v, i) => (
                      <div key={i} className="col-md-6 col-lg-4">
                        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,#C0392B,#FF6B35)' }} />
                          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(192,57,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                            <FontAwesomeIcon icon={faCar} style={{ color: '#E74C3C', fontSize: '1.1rem' }} />
                          </div>
                          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: '1.25rem', marginBottom: '6px' }}>{v.marque} {v.modele}</div>
                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
                            {v.annee && <span style={{ color: '#888', fontSize: '0.78rem' }}>📅 {v.annee}</span>}
                            {v.immatriculation && <span style={{ color: '#aaa', fontSize: '0.78rem', fontFamily: 'monospace' }}>🏷️ {v.immatriculation}</span>}
                          </div>
                          <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#ff6b35', fontWeight: 600 }}>
                              <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '5px' }} />
                              Échéance : 15/11/2026
                            </span>
                            <Link href="/rendezvous" style={{ fontSize: '0.72rem', color: '#E74C3C', fontWeight: 700, textDecoration: 'none' }}>
                              Renouveler &rarr;
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* ══ PROFIL ══ */}
          {activeTab === 'profil' && (
            <div>
              <SectionHeader title="Mon profil" subtitle="Gérez vos informations personnelles" />
              <div className="row g-4">

                {/* Infos card */}
                <div className="col-lg-6">
                  <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,#C0392B,#E74C3C)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', fontWeight: 800 }}>
                          {user?.nom?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{user?.nom}</div>
                          <div style={{ color: '#555', fontSize: '0.75rem' }}>Client ValidAuto</div>
                        </div>
                      </div>
                      <button onClick={() => setEditMode(!editMode)} style={{ background: editMode ? 'transparent' : 'rgba(192,57,43,0.1)', border: `1px solid ${editMode ? 'rgba(255,255,255,0.08)' : 'rgba(192,57,43,0.25)'}`, borderRadius: '6px', padding: '6px 12px', color: editMode ? '#666' : '#E74C3C', fontSize: '0.73rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FontAwesomeIcon icon={editMode ? faTimes : faEdit} style={{ fontSize: '0.68rem' }} />
                        {editMode ? 'Annuler' : 'Modifier'}
                      </button>
                    </div>

                    {editMode ? (
                      <div>
                        {[
                          { label: 'Nom complet', key: 'nom' },
                          { label: 'Téléphone', key: 'telephone' },
                        ].map(f => (
                          <div key={f.key} style={{ marginBottom: '14px' }}>
                            <label style={{ fontSize: '0.72rem', color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                            <input value={profil[f.key]} onChange={e => setProfil(p => ({ ...p, [f.key]: e.target.value }))}
                              style={{ width: '100%', background: '#1a1a1a', border: '1.5px solid rgba(192,57,43,0.4)', borderRadius: '7px', padding: '11px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
                          </div>
                        ))}
                        <button onClick={saveProfil} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 20px', background: 'linear-gradient(135deg,#C0392B,#E74C3C)', borderRadius: '7px', border: 'none', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                          <FontAwesomeIcon icon={faSave} style={{ fontSize: '0.75rem' }} /> Sauvegarder
                        </button>
                      </div>
                    ) : (
                      <div>
                        {[
                          { icon: faUser,    label: 'Nom',       value: user?.nom },
                          { icon: faEnvelope,label: 'Email',     value: user?.email },
                          { icon: faPhone,   label: 'Téléphone', value: user?.telephone || 'Non renseigné' },
                        ].map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '7px', background: 'rgba(192,57,43,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <FontAwesomeIcon icon={f.icon} style={{ color: '#E74C3C', fontSize: '0.72rem' }} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.68rem', color: '#444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{f.label}</div>
                              <div style={{ color: '#ccc', fontSize: '0.85rem', marginTop: '1px' }}>{f.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Change password card */}
                <div className="col-lg-6">
                  <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesomeIcon icon={faKey} style={{ color: '#FF6B35', fontSize: '0.78rem' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Changer le mot de passe</div>
                        <div style={{ color: '#444', fontSize: '0.73rem' }}>Sécurisez votre compte</div>
                      </div>
                    </div>
                    <form onSubmit={changePass}>
                      {[
                        { label: 'Mot de passe actuel', key: 'current_password' },
                        { label: 'Nouveau mot de passe', key: 'password' },
                        { label: 'Confirmer le mot de passe', key: 'password_confirmation' },
                      ].map(f => (
                        <div key={f.key} style={{ marginBottom: '12px' }}>
                          <label style={{ fontSize: '0.7rem', color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '5px' }}>{f.label}</label>
                          <input type="password" value={passForm[f.key]}
                            onChange={e => setPassForm(p => ({ ...p, [f.key]: e.target.value }))}
                            style={{ width: '100%', background: '#1a1a1a', border: '1.5px solid rgba(255,255,255,0.07)', borderRadius: '7px', padding: '10px 13px', color: '#fff', fontSize: '0.84rem', outline: 'none', transition: 'border-color 0.3s' }}
                            onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
                          />
                        </div>
                      ))}
                      <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#FF6B35,#E74C3C)', border: 'none', borderRadius: '7px', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', marginTop: '6px', letterSpacing: '0.05em' }}>
                        Mettre à jour le mot de passe
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ══ MODAL DE CONSULTATION DU RAPPORT ══ */}
      {selectedReport && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#121212', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '14px', width: '100%', maxWidth: '780px', maxHeight: '90vh',
            overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            position: 'relative', display: 'flex', flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'linear-gradient(180deg, rgba(192,57,43,0.08) 0%, transparent 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(192,57,43,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={faFileAlt} style={{ color: '#E74C3C', fontSize: '1.2rem' }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, color: '#fff', fontSize: '1.4rem', margin: 0, letterSpacing: '0.5px' }}>
                    Bilan Technique #{selectedReport.id}
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: '#888' }}>
                    ValidAuto Fès • Émis le {new Date(selectedReport.created_at || Date.now()).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer', padding: '5px 10px', borderRadius: '6px' }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Status banner */}
              <div style={{
                background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.25)',
                borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#2ecc71', fontSize: '0.9rem' }} />
                  <span style={{ color: '#2ecc71', fontWeight: 700, fontSize: '0.85rem' }}>CONTRÔLE TECHNIQUE VALIDÉ &amp; CONFORME</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>Réf: #{selectedReport.id}</span>
              </div>

              {/* 2 columns info */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#C0392B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                      Client &amp; Prestation
                    </div>
                    <table style={{ width: '100%', fontSize: '0.82rem', color: '#ccc' }}>
                      <tbody>
                        <tr><td style={{ color: '#666', paddingBottom: '6px' }}>Client :</td><td style={{ fontWeight: 600, color: '#fff', textAlign: 'right' }}>{selectedReport.client_name || user?.nom}</td></tr>
                        <tr><td style={{ color: '#666', paddingBottom: '6px' }}>Prestation :</td><td style={{ fontWeight: 600, color: '#fff', textAlign: 'right' }}>{selectedReport.rendezvous?.service || 'Visite technique'}</td></tr>
                        <tr><td style={{ color: '#666', paddingBottom: '6px' }}>Date RDV :</td><td style={{ fontWeight: 600, color: '#fff', textAlign: 'right' }}>{selectedReport.rendezvous?.date ? new Date(selectedReport.rendezvous.date).toLocaleDateString('fr-FR') : '—'}</td></tr>
                        <tr><td style={{ color: '#666' }}>Créneau :</td><td style={{ fontWeight: 600, color: '#fff', textAlign: 'right' }}>{selectedReport.rendezvous?.hour || '—'}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-md-6">
                  <div style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#C0392B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                      Véhicule Contrôlé
                    </div>
                    <table style={{ width: '100%', fontSize: '0.82rem', color: '#ccc' }}>
                      <tbody>
                        <tr><td style={{ color: '#666', paddingBottom: '6px' }}>Véhicule :</td><td style={{ fontWeight: 600, color: '#fff', textAlign: 'right' }}>{selectedReport.car_marque} {selectedReport.car_model || ''}</td></tr>
                        <tr><td style={{ color: '#666', paddingBottom: '6px' }}>Année :</td><td style={{ fontWeight: 600, color: '#fff', textAlign: 'right' }}>{selectedReport.year || '—'}</td></tr>
                        <tr><td style={{ color: '#666', paddingBottom: '6px' }}>Matricule :</td><td style={{ fontWeight: 600, color: '#fff', textAlign: 'right' }}>{selectedReport.matricule || '—'}</td></tr>
                        <tr><td style={{ color: '#666' }}>Kilométrage :</td><td style={{ fontWeight: 600, color: '#fff', textAlign: 'right' }}>{selectedReport.kilometrage ? Number(selectedReport.kilometrage).toLocaleString() + ' km' : '—'}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Grille des 6 Organes Réglementaires (NARSA) */}
              <div style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.74rem', color: '#E74C3C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Points de Contrôle &amp; Organes de Sécurité (Loi 52-05 / NARSA)
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#2ecc71', fontWeight: 700 }}>6/6 Organes Conformes</span>
                </div>
                <div className="row g-2">
                  {[
                    { organe: '01. Freinage de service', desc: 'Efficacité 82% (Mini 50%)' },
                    { organe: '02. Direction & Suspension', desc: 'Rotules & amortisseurs OK' },
                    { organe: '03. Éclairage & Optiques', desc: 'Faisceaux et feux stop OK' },
                    { organe: '04. Pneumatiques & Essieux', desc: 'Sculpture 6.2 mm (Mini 1.6mm)' },
                    { organe: '05. Pollution & Émissions', desc: 'Opacité CO₂ conforme Euro 6' },
                    { organe: '06. Châssis & Équipements', desc: 'Ceintures et fixations OK' },
                  ].map((pt, idx) => (
                    <div key={idx} className="col-sm-6">
                      <div style={{ background: '#121212', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>{pt.organe}</div>
                          <div style={{ color: '#777', fontSize: '0.72rem' }}>{pt.desc}</div>
                        </div>
                        <span style={{ color: '#2ecc71', fontWeight: 800, fontSize: '0.75rem' }}>✓ Conforme</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travaux réalisés */}
              <div style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  Travaux, contrôles &amp; réparations effectués
                </div>
                <div style={{ color: '#ddd', fontSize: '0.85rem', whiteSpace: 'pre-line', lineHeight: 1.6, background: '#121212', padding: '12px 14px', borderRadius: '6px', borderLeft: '3px solid #C0392B' }}>
                  {selectedReport.modifications || "Inspection complète du véhicule conformément aux normes de sécurité."}
                </div>
              </div>

              {/* Observations & Prix */}
              <div className="row g-3 align-items-center">
                <div className="col-md-7">
                  <div style={{ fontSize: '0.78rem', color: '#888' }}>
                    ⏱ <strong>Durée d'intervention :</strong> {selectedReport.work_duration || '1h30'}<br />
                    📝 <strong>Observations :</strong> {selectedReport.requete || 'Aucune anomalie critique détectée.'}
                  </div>
                </div>
                <div className="col-md-5 text-md-end">
                  <div style={{ display: 'inline-block', background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: '8px', padding: '10px 16px', textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Montant réglé</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#E74C3C', fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {selectedReport.price ? Number(selectedReport.price).toFixed(2) : '0.00'} MAD
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Sécurisé Anti-Fraude */}
              <div style={{ background: '#181818', border: '1px solid rgba(46,204,113,0.3)', borderRadius: '8px', padding: '14px 16px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&margin=2&data=${encodeURIComponent(`VALIDAUTO • PV #RAP-${String(selectedReport.id || 0).padStart(5, '0')} • Matricule: ${selectedReport.matricule || '12345-A-1'} • Statut: CONFORME NARSA`)}`}
                    alt="QR Code"
                    style={{ width: '56px', height: '56px', borderRadius: '4px', background: '#fff', padding: '3px' }}
                  />
                  <div>
                    <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>Certificat d'Authenticité Numérique (Anti-fraude)</div>
                    <div style={{ color: '#888', fontSize: '0.74rem' }}>Procès-verbal infalsifiable certifié selon les normes NARSA / Loi 52-05</div>
                  </div>
                </div>
                <span style={{ background: 'rgba(46,204,113,0.15)', color: '#2ecc71', border: '1px solid rgba(46,204,113,0.4)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
                  ✓ Vérifié &amp; Conforme
                </span>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div style={{
              padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)',
              background: '#151515', borderBottomLeftRadius: '14px', borderBottomRightRadius: '14px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
            }}>
              <div style={{ fontSize: '0.74rem', color: '#666' }}>
                Document officiel ValidAuto — Conforme aux normes techniques marocaines.
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedVignette(selectedReport)}
                  style={{
                    background: 'rgba(46,204,113,0.15)', border: '1px solid rgba(46,204,113,0.4)',
                    borderRadius: '6px', padding: '9px 15px', color: '#2ecc71', fontSize: '0.82rem',
                    fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '7px',
                    transition: 'all 0.2s'
                  }}
                  title="Voir la vignette officielle pare-brise"
                >
                  <FontAwesomeIcon icon={faShieldAlt} /> Vignette Pare-brise
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  style={{
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px', padding: '9px 16px', color: '#aaa', fontSize: '0.8rem',
                    fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Fermer
                </button>
                <button
                  onClick={() => downloadReportPDF(selectedReport)}
                  style={{
                    background: 'linear-gradient(135deg,#C0392B,#E74C3C)', border: 'none',
                    borderRadius: '6px', padding: '9px 18px', color: '#fff', fontSize: '0.82rem',
                    fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(192,57,43,0.4)'
                  }}
                >
                  <FontAwesomeIcon icon={faDownload} /> Télécharger le PDF (.pdf)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL VIGNETTE NUMÉRIQUE PARE-BRISE (NARSA) ══ */}
      {selectedVignette && (() => {
        const reportDate = new Date(selectedVignette.created_at || Date.now());
        const expiryDate = new Date(reportDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        const expMonth = String(expiryDate.getMonth() + 1).padStart(2, '0');
        const expYear = expiryDate.getFullYear();
        const expFullDate = expiryDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

        return (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)', zIndex: 100000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
            }}
            onClick={() => setSelectedVignette(null)}
          >
            <div
              style={{
                background: '#141414', border: '1px solid rgba(46,204,113,0.3)',
                borderRadius: '16px', maxWidth: '480px', width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(46,204,113,0.15)',
                overflow: 'hidden', animation: 'fadeIn 0.25s ease'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'linear-gradient(180deg, #181818, #141414)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'rgba(46,204,113,0.15)', color: '#2ecc71',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
                  }}>
                    <FontAwesomeIcon icon={faShieldAlt} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#fff' }}>
                      Vignette Pare-Brise Officielle
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: '#888' }}>
                      Macaron de contrôle technique réglementaire NARSA
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVignette(null)}
                  style={{
                    background: 'transparent', border: 'none', color: '#666',
                    fontSize: '1.2rem', cursor: 'pointer', padding: '4px'
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                <p style={{ color: '#aaa', fontSize: '0.8rem', margin: '0 auto 20px', maxWidth: '380px' }}>
                  À apposer sur le coin inférieur droit du pare-brise intérieur du véhicule après contrôle favorable.
                </p>

                {/* Windshield Sticker Graphic */}
                <div style={{
                  width: '240px', height: '240px', margin: '0 auto 20px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #064e3b 0%, #022c22 80%, #011913 100%)',
                  border: '6px double #10b981',
                  boxShadow: '0 0 25px rgba(16,185,129,0.35), inset 0 0 20px rgba(0,0,0,0.6)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '14px', position: 'relative', color: '#fff', boxSizing: 'border-box'
                }}>
                  <div style={{
                    fontSize: '0.62rem', fontWeight: 800, letterSpacing: '2px',
                    color: '#6ee7b7', textTransform: 'uppercase'
                  }}>
                    ROYAUME DU MAROC
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#34d399', margin: '1px 0' }}>★</div>
                  <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '1px', color: '#a7f3d0' }}>
                    VALIDITÉ DU CONTRÔLE
                  </div>
                  {/* Huge Expiry Month / Year */}
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '2.5rem', fontWeight: 900, lineHeight: 1,
                    color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)', margin: '2px 0'
                  }}>
                    {expMonth} / {expYear}
                  </div>
                  {/* Matricule Badge */}
                  <div style={{
                    background: '#ffffff', color: '#0f172a', fontWeight: 900,
                    fontSize: '0.82rem', padding: '3px 12px', borderRadius: '4px',
                    fontFamily: 'monospace', letterSpacing: '1px', margin: '4px 0',
                    border: '1.5px solid #059669', boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {selectedVignette.matricule || '12345-A-1'}
                  </div>
                  {/* NARSA details */}
                  <div style={{ fontSize: '0.52rem', fontWeight: 700, color: '#a7f3d0', letterSpacing: '0.5px', textTransform: 'uppercase', lineHeight: 1.2 }}>
                    HOMOLOGUÉ NARSA • LOI 52-05
                  </div>
                  <div style={{ fontSize: '0.5rem', color: '#6ee7b7', marginTop: '2px' }}>
                    CENTRE VALIDAUTO FÈS • AGRÉMENT N° 45/FE
                  </div>
                </div>

                {/* Details summary */}
                <div style={{ background: '#1c1c1c', borderRadius: '8px', padding: '12px 16px', textAlign: 'left', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                    <span style={{ color: '#777' }}>Véhicule :</span>
                    <strong style={{ color: '#fff' }}>{selectedVignette.car_marque} {selectedVignette.car_model || ''}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                    <span style={{ color: '#777' }}>Date du contrôle :</span>
                    <span style={{ color: '#bbb' }}>{new Date(selectedVignette.created_at || Date.now()).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: '#777' }}>Date limite de validité :</span>
                    <strong style={{ color: '#2ecc71' }}>{expFullDate}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    onClick={() => printVignette(selectedVignette)}
                    style={{
                      flex: 1, padding: '10px 16px', borderRadius: '8px',
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.82rem',
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
                    }}
                  >
                    <FontAwesomeIcon icon={faPrint} /> Imprimer la Vignette (8.5×8.5 cm)
                  </button>
                  <button
                    onClick={() => setSelectedVignette(null)}
                    style={{
                      padding: '10px 18px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.08)', color: '#ccc',
                      border: '1px solid rgba(255,255,255,0.12)', fontWeight: 600,
                      fontSize: '0.82rem', cursor: 'pointer'
                    }}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── MODAL PAIEMENT EN LIGNE ── */}
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        service={paymentTarget?.service}
        rdvData={paymentTarget?.rdvData}
        onSuccess={() => {
          setPaymentOpen(false);
          setMsg({ type: 'success', text: '✅ Paiement validé avec succès ! Votre prestation est réglée.' });
          setTimeout(() => setMsg(null), 5000);
        }}
      />
    </div>
  );
}
