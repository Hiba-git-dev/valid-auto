<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation RDV — ValidAuto</title>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#C0392B,#E74C3C);padding:32px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:0.04em;">Valid<span style="opacity:0.85;">Auto</span></div>
              <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:4px;letter-spacing:0.15em;text-transform:uppercase;">Centre de Contrôle Technique</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <div style="display:inline-block;background:rgba(46,204,113,0.12);border:1px solid rgba(46,204,113,0.3);border-radius:20px;padding:5px 14px;font-size:11px;font-weight:700;color:#2ecc71;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:20px;">✓ Rendez-vous enregistré</div>

              <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 8px;">Bonjour {{ $rdv['nom'] }},</h1>
              <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 28px;">
                Votre demande de rendez-vous a bien été reçue et est <strong style="color:#fff;">en attente de confirmation</strong> par notre équipe. Vous recevrez une confirmation définitive sous peu.
              </p>

              <!-- RDV Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;overflow:hidden;margin-bottom:28px;">
                <tr><td style="background:linear-gradient(90deg,#C0392B,transparent);height:2px;"></td></tr>
                <tr>
                  <td style="padding:24px 28px;">
                    <div style="font-size:10px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:16px;">Détails du rendez-vous</div>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #222;color:#555;font-size:12px;width:40%;">📋 Service</td>
                        <td style="padding:8px 0;border-bottom:1px solid #222;color:#fff;font-size:13px;font-weight:600;">{{ $rdv['service'] }}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #222;color:#555;font-size:12px;">📅 Date</td>
                        <td style="padding:8px 0;border-bottom:1px solid #222;color:#fff;font-size:13px;font-weight:600;">{{ \Carbon\Carbon::parse($rdv['date'])->locale('fr')->isoFormat('dddd D MMMM YYYY') }}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #222;color:#555;font-size:12px;">🕐 Heure</td>
                        <td style="padding:8px 0;border-bottom:1px solid #222;color:#fff;font-size:13px;font-weight:600;">{{ $rdv['hour'] }}</td>
                      </tr>
                      @if($rdv['marque'])
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #222;color:#555;font-size:12px;">🚗 Véhicule</td>
                        <td style="padding:8px 0;border-bottom:1px solid #222;color:#fff;font-size:13px;font-weight:600;">{{ $rdv['marque'] }} {{ $rdv['year'] ?? '' }}</td>
                      </tr>
                      @endif
                      @if($rdv['matricule'])
                      <tr>
                        <td style="padding:8px 0;color:#555;font-size:12px;">🔢 Matricule</td>
                        <td style="padding:8px 0;color:#fff;font-size:13px;font-weight:600;">{{ $rdv['matricule'] }}</td>
                      </tr>
                      @endif
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(192,57,43,0.08);border:1px solid rgba(192,57,43,0.2);border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;color:#E74C3C;font-size:13px;line-height:1.6;">
                    <strong>📍 Adresse :</strong> Route Ain Chkef, Fès<br>
                    <strong>📞 Contact :</strong> +212 770 145 404<br>
                    <strong>🕐 Horaires :</strong> Lun–Ven : 09h – 21h
                  </td>
                </tr>
              </table>

              <p style="color:#555;font-size:12px;line-height:1.7;margin:0;">
                En cas d'empêchement, merci de nous contacter au moins <strong style="color:#888;">24h à l'avance</strong> pour annuler ou reporter votre rendez-vous.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d0d0d;padding:20px 40px;border-top:1px solid #1e1e1e;text-align:center;">
              <div style="color:#444;font-size:11px;">© {{ date('Y') }} ValidAuto — Tous droits réservés</div>
              <div style="color:#333;font-size:11px;margin-top:4px;">Route Ain Chkef, Fès, Maroc</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
