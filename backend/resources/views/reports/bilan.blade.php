@extends('layouts.app')

@section('title', 'Bilan du Rendez-vous')

@section('content')
<div class="container my-5">
    <h2 class="mb-4">Bilan Technique</h2>

    <p><strong>Client :</strong> {{ $report->rendezvous->nom }}</p>
    <p><strong>Marque & Modèle :</strong> {{ $report->rendezvous->marque }}</p>
    <p><strong>Matricule :</strong> {{ $report->rendezvous->matricule }}</p>
    <p><strong>Kilométrage :</strong> {{ $report->rendezvous->kilometrage }}</p>
    <p><strong>Année :</strong> {{ $report->rendezvous->year }}</p>
    <p><strong>Requête :</strong> {{ $report->rendezvous->requete }}</p>
    <p><strong>Durée du travail :</strong> {{ $duree ?? 'Non renseignée' }}</p>
    <p><strong>Modifications appliquées :</strong> {{ $report->modifications ?? 'Aucune' }}</p>
    <p><strong>Prix total :</strong> {{ $report->price ?? 'Non renseigné' }} MAD</p>

    <button onclick="window.print()" class="btn btn-primary mt-4">Imprimer le bilan</button>
</div>
@endsection
