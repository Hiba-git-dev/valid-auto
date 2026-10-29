@extends('layouts.app')

@section('title', 'Bilan de ' . $report->client_name)

@section('content')
<div class="container">
    <h2>Bilan de {{ $report->client_name }}</h2>
    <table class="table table-bordered">
        <tr><th>Client</th><td>{{ $report->client_name }}</td></tr>
        <tr><th>Marque</th><td>{{ $report->car_marque }}</td></tr>
        <tr><th>Modèle</th><td>{{ $report->car_model }}</td></tr>
        <tr><th>Matricule</th><td>{{ $report->matricule }}</td></tr>
        <tr><th>Kilométrage</th><td>{{ $report->kilometrage }}</td></tr>
        <tr><th>Année</th><td>{{ $report->year }}</td></tr>
        <tr><th>Requête</th><td>{{ $report->requete }}</td></tr>
        <tr><th>Durée du travail</th><td>{{ $report->work_duration }}</td></tr>
        <tr><th>Modifications appliquées</th><td>{{ $report->modifications }}</td></tr>
        <tr><th>Prix</th><td>{{ $report->price }} DH</td></tr>
    </table>

    <button onclick="window.print()" class="btn btn-primary">Imprimer</button>
</div>
@endsection
