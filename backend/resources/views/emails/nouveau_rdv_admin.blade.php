<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Nouveau RDV — ValidAuto Admin</title></head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#141414;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a;padding:24px 36px;border-bottom:1px solid #2a2a2a;">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="font-size:22px;font-weight:900;color:#fff;">Valid<span style="color:#E74C3C;">Auto</span></div>
                <div style="background:rgba(255,107,53,0.12);border:1px solid rgba(255,107,53,0.3);border-radius:20px;padding:3px 12px;font-size:10px;font-weight:700;color:#FF6B35;letter-spacing:0.1em;text-transform:uppercase;">🔔 Nouveau RDV</div>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px 36px;">
              <h2 style="color:#fff;font-size:18px;margin:0 0 6px;">Nouvelle réservation reçue</h2>
              <p style="color:#666;font-size:13px;margin:0 0 24px;">Un client vient de soumettre une demande de rendez-vous.</p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #252525;border-radius:8px;overflow:hidden;margin-bottom:20px;">
                <tr><td style="background:linear-gradient(90deg,#FF6B35,transparent);height:2px;"></td></tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <div style="font-size:10px;font-weight:700;color:#444;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:14px;">Informations client</div>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:7px 0;border-bottom:1px solid #1e1e1e;color:#555;font-size:12px;width:35%;">👤 Nom</td>
                        <td style="padding:7px 0;border-bottom:1px solid #1e1e1e;color:#ddd;font-size:13px;font-weight:600;">{{ $rdv['nom'] }}</td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0;border-bottom:1px solid #1e1e1e;color:#555;font-size:12px;">📧 Email</td>
                        <td style="padding:7px 0;border-bottom:1px solid #1e1e1e;color:#ddd;font-size:13px;">{{ $rdv['email'] }}</td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0;border-bottom:1px solid #1e1e1e;color:#555;font-size:12px;">📋 Service</td>
                        <td style="padding:7px 0;border-bottom:1px solid #1e1e1e;color:#E74C3C;font-size:13px;font-weight:700;">{{ $rdv['service'] }}</td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0;border-bottom:1px solid #1e1e1e;color:#555;font-size:12px;">📅 Date</td>
                        <td style="padding:7px 0;border-bottom:1px solid #1e1e1e;color:#ddd;font-size:13px;font-weight:600;">{{ \Carbon\Carbon::parse($rdv['date'])->locale('fr')->isoFormat('dddd D MMMM YYYY') }} à {{ $rdv['hour'] }}</td>
                      </tr>
                      @if($rdv['marque'])
                      <tr>
                        <td style="padding:7px 0;border-bottom:1px solid #1e1e1e;color:#555;font-size:12px;">🚗 Véhicule</td>
                        <td style="padding:7px 0;border-bottom:1px solid #1e1e1e;color:#ddd;font-size:13px;">{{ $rdv['marque'] }} {{ $rdv['year'] ?? '' }} {{ $rdv['matricule'] ? '— '.$rdv['matricule'] : '' }}</td>
                      </tr>
                      @endif
                      @if($rdv['kilometrage'])
                      <tr>
                        <td style="padding:7px 0;color:#555;font-size:12px;">📏 Kilométrage</td>
                        <td style="padding:7px 0;color:#ddd;font-size:13px;">{{ number_format($rdv['kilometrage'], 0, ',', ' ') }} km</td>
                      </tr>
                      @endif
                    </table>
                  </td>
                </tr>
              </table>

              @if($rdv['requete'])
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(192,57,43,0.07);border:1px solid rgba(192,57,43,0.15);border-radius:8px;margin-bottom:20px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <div style="font-size:10px;font-weight:700;color:#C0392B;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Requête du client</div>
                    <div style="color:#aaa;font-size:13px;line-height:1.6;">{{ $rdv['requete'] }}</div>
                  </td>
                </tr>
              </table>
              @endif

              <div style="text-align:center;">
                <a href="http://localhost:8000/rendezvous" style="display:inline-block;background:linear-gradient(135deg,#C0392B,#E74C3C);color:#fff;padding:12px 28px;border-radius:7px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.05em;">
                  Voir dans le dashboard →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d0d0d;padding:16px 36px;border-top:1px solid #1e1e1e;text-align:center;">
              <div style="color:#333;font-size:11px;">Email automatique — ValidAuto Admin · {{ date('d/m/Y H:i') }}</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
