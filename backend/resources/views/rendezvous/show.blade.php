@extends('layouts.app')

@section('title', 'Détails du rendez-vous')

@section('content')
    <h2>Détails du rendez-vous</h2>
    <ul class="list-group mb-3">
        <li class="list-group-item"><strong>Nom:</strong> {{ $rendezvous->nom }}</li>
        <li class="list-group-item"><strong>Email:</strong> {{ $rendezvous->email }}</li>
        <li class="list-group-item"><strong>Service:</strong> {{ $rendezvous->service }}</li>
        <li class="list-group-item"><strong>Date:</strong> {{ \Carbon\Carbon::parse($rendezvous->date)->format('Y-m-d') }} {{ $rendezvous->hour ? \Carbon\Carbon::parse($rendezvous->hour)->format('H:i') : '' }}</li>
        <li class="list-group-item"><strong>Marque:</strong> {{ $rendezvous->marque }}</li>
        <li class="list-group-item"><strong>Année:</strong> {{ $rendezvous->year }}</li>
        <li class="list-group-item"><strong>Matricule:</strong> {{$rendezvous->matricule}}</li>
        <li class="list-group-item"><strong>Kilometrage:</strong> {{$rendezvous->kilometrage}}</li>
        <li class="list-group-item"><strong>Requête:</strong> {{ $rendezvous->requete }}</li>
    </ul>
    <a href="{{ route('rendezvous.index') }}" class="btn btn-secondary">Retour</a>
@endsection
