<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport d'Inspection</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
        }
        .container {
            max-width: 800px;
            margin: auto;
        }
        h1, h2 {
            text-align: center;
        }
        .section {
            margin-bottom: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            border: 1px solid #333;
            padding: 10px;
        }
        @media print {
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Rapport de Visite Technique</h1>
        <h2>Rapport N° {{ $report->id }}</h2>

        <div class="section">
            <strong>Client :</strong> {{ $report->rendezvous->client->nom }}<br>
            <strong>Voiture :</strong> {{ $report->rendezvous->voiture->nom }}<br>
            <strong>Immatriculation :</strong> {{ $report->rendezvous->voiture->matricule ?? 'N/A' }}
        </div>

        <div class="section">
            <strong>Entrée :</strong> {{ $report->entered_at }}<br>
            <strong>Sortie :</strong> {{ $report->exited_at }}<br>
            <strong>Prix :</strong> {{ $report->price }} DH
        </div>

        <div class="section">
            <h3>Description :</h3>
            <p>{{ $report->description }}</p>
        </div>

        <button class="no-print" onclick="window.print()">🖨️ Imprimer le rapport</button>
    </div>
</body>
</html>
