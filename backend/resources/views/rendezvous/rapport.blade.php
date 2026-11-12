@extends('layouts.app')

@section('title', 'Rapport du rendez-vous')

@section('content')
    <div id="rapport">
        <h2>Recu du Rendez-vous</h2>
        <p><strong>Nom :</strong> {{ $rdv->nom }}</p>
        <p><strong>Email :</strong> {{ $rdv->email }}</p>
        <p><strong>Service :</strong> {{ $rdv->service }}</p>
        <p><strong>Date :</strong> {{ \Carbon\Carbon::parse($rdv->date)->format('Y-m-d') }} {{ $rdv->hour ? \Carbon\Carbon::parse($rdv->hour)->format('H:i') : '' }}</p>
        <p><strong>Marque :</strong> {{ $rdv->marque }}</p>
        <p><strong>Année :</strong> {{ $rdv->year }}</p>
        <p><strong>Matricule :</strong> {{ $rdv->matricule }}</p>
        <p><strong>Kilométrage :</strong> {{ $rdv->kilometrage }}</p>
        <p><strong>Requête :</strong> {{ $rdv->requete }}</p>
    </div>

    <button onclick="window.print()" class="btn btn-primary mt-3">Imprimer le recu</button>
@endsection
