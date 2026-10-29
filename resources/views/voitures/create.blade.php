@extends('layouts.app')

@section('title', 'Ajouter un véhicule')

@section('content')
<div class="container-fluid px-4">
    <div class="row justify-content-center">
        <div class="col-lg-7">

            <div class="d-flex align-items-center gap-3 my-4">
                <a href="{{ route('voitures.index') }}" class="btn btn-outline-secondary">
                    <i class="bi bi-arrow-left"></i>
                </a>
                <h2 class="fw-bold mb-0">
                    <i class="bi bi-car-front text-primary me-2"></i>Ajouter un véhicule
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
                    <form action="{{ route('voitures.store') }}" method="POST">
                        @csrf

                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Marque <span class="text-danger">*</span></label>
                                <select name="marque" class="form-select" required>
                                    <option value="">-- Sélectionner --</option>
                                    @foreach(['Dacia','Renault','Peugeot','Citroën','Volkswagen','Toyota','Hyundai','Ford','Kia','Fiat','Seat','Skoda','BMW','Mercedes','Audi','Opel','Nissan','Honda','Mazda','Autre'] as $m)
                                        <option value="{{ $m }}" {{ old('marque') == $m ? 'selected' : '' }}>{{ $m }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Modèle <span class="text-danger">*</span></label>
                                <input type="text" name="modele" class="form-control"
                                       value="{{ old('modele') }}" placeholder="ex: Logan, Clio, 208…" required>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Année <span class="text-danger">*</span></label>
                                <select name="annee" class="form-select" required>
                                    <option value="">-- Année --</option>
                                    @for($y = date('Y'); $y >= 1990; $y--)
                                        <option value="{{ $y }}" {{ old('annee') == $y ? 'selected' : '' }}>{{ $y }}</option>
                                    @endfor
                                </select>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label fw-semibold">Propriétaire (client) <span class="text-danger">*</span></label>
                                <select name="client_id" class="form-select" required>
                                    <option value="">-- Sélectionner un client --</option>
                                    @foreach($clients as $client)
                                        <option value="{{ $client->id }}"
                                                {{ old('client_id') == $client->id ? 'selected' : '' }}>
                                            {{ $client->nom }} — {{ $client->email }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        <div class="d-flex gap-2 mt-4">
                            <button type="submit" class="btn btn-success">
                                <i class="bi bi-check-lg me-1"></i>Enregistrer
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
