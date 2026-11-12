@extends('layouts.app')

@section('title', 'Modifier le véhicule')

@section('content')
<div class="container-fluid px-4">
    <div class="row justify-content-center">
        <div class="col-lg-7">

            <div class="d-flex align-items-center gap-3 my-4">
                <a href="{{ route('voitures.index') }}" class="btn btn-outline-secondary">
                    <i class="bi bi-arrow-left"></i>
                </a>
                <h2 class="fw-bold mb-0">
                    <i class="bi bi-pencil text-warning me-2"></i>Modifier — {{ $voiture->marque }} {{ $voiture->modele }}
                </h2>
            </div>

            @if($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach
                    </ul>
                </div>
            @endif

            <div class="card shadow border-0">
                <div class="card-body p-4">
                    <form action="{{ route('voitures.update', $voiture->id) }}" method="POST">
                        @csrf
                        @method('PUT')

                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Marque <span class="text-danger">*</span></label>
                                <select name="marque" class="form-select" required>
                                    <option value="">-- Sélectionner --</option>
                                    @foreach(['Dacia','Renault','Peugeot','Citroën','Volkswagen','Toyota','Hyundai','Ford','Kia','Fiat','Seat','Skoda','BMW','Mercedes','Audi','Opel','Nissan','Honda','Mazda','Autre'] as $m)
                                        <option value="{{ $m }}"
                                                {{ (old('marque', $voiture->marque) == $m) ? 'selected' : '' }}>
                                            {{ $m }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Modèle <span class="text-danger">*</span></label>
                                <input type="text" name="modele" class="form-control"
                                       value="{{ old('modele', $voiture->modele) }}" required>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Année <span class="text-danger">*</span></label>
                                <select name="annee" class="form-select" required>
                                    <option value="">-- Année --</option>
                                    @for($y = date('Y'); $y >= 1990; $y--)
                                        <option value="{{ $y }}"
                                                {{ (old('annee', $voiture->annee) == $y) ? 'selected' : '' }}>
                                            {{ $y }}
                                        </option>
                                    @endfor
                                </select>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Propriétaire (client) <span class="text-danger">*</span></label>
                                <select name="client_id" class="form-select" required>
                                    <option value="">-- Sélectionner un client --</option>
                                    @foreach($clients as $client)
                                        <option value="{{ $client->id }}"
                                                {{ (old('client_id', $voiture->client_id) == $client->id) ? 'selected' : '' }}>
                                            {{ $client->nom }} — {{ $client->email }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="d-flex gap-2 mt-4">
                            <button type="submit" class="btn btn-warning">
                                <i class="bi bi-check-lg me-1"></i>Mettre à jour
                            </button>
                            <a href="{{ route('voitures.index') }}" class="btn btn-outline-secondary">
                                <i class="bi bi-x-lg me-1"></i>Annuler
                            </a>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </div>
</div>
@endsection
