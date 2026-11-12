@extends('layouts.app')

@section('title', 'Créer un bilan')

@section('content')
<div class="container">
    <h2>Créer un bilan pour {{ $rdv->nom }}</h2>

    <form action="{{ route('reports.store') }}" method="POST">
        @csrf
        <input type="hidden" name="rendezvous_id" value="{{ $rdv->id }}">

        <div class="mb-3">
            <label>Nom du client</label>
            <input type="text" name="client_name" value="{{ $rdv->nom }}" class="form-control" required>
        </div>

        <div class="mb-3">
            <label>Marque</label>
            <input type="text" name="car_marque" value="{{ $rdv->marque }}" class="form-control" required>
        </div>

        <div class="mb-3">
            <label>Modèle</label>
            <input type="text" name="car_model" class="form-control" required>
        </div>

        <div class="mb-3">
            <label>Matricule</label>
            <input type="text" name="matricule" value="{{ $rdv->matricule }}" class="form-control" required>
        </div>

        <div class="mb-3">
            <label>Kilométrage</label>
            <input type="number" name="kilometrage" value="{{ $rdv->kilometrage }}" class="form-control" required>
        </div>

        <div class="mb-3">
            <label>Année</label>
            <input type="number" name="year" value="{{ $rdv->year }}" class="form-control" required>
        </div>

        <div class="mb-3">
            <label>Requête</label>
            <textarea name="requete" class="form-control">{{ $rdv->requete }}</textarea>
        </div>

        <div class="mb-3">
            <label>Durée du travail</label>
            <input type="text" name="work_duration" class="form-control">
        </div>

        <div class="mb-3">
            <label>Modifications appliquées</label>
            <textarea name="modifications" class="form-control"></textarea>
        </div>

        <div class="mb-3">
            <label>Prix</label>
            <input type="number" step="0.01" name="price" class="form-control" required>
        </div>

        <button type="submit" class="btn btn-success">Créer Bilan</button>
    </form>
</div>
@endsection
