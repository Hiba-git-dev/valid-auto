@extends('layouts.app')

@section('title', 'Détail du véhicule')

@section('content')
<div class="container-fluid px-4">

    <div class="d-flex align-items-center gap-3 my-4">
        <a href="{{ route('voitures.index') }}" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i>
        </a>
        <h2 class="fw-bold mb-0">
            <i class="bi bi-car-front text-primary me-2"></i>
            {{ $voiture->marque }} {{ $voiture->modele }} — {{ $voiture->annee }}
        </h2>
    </div>

    <div class="row g-4">

        {{-- Infos véhicule --}}
        <div class="col-lg-5">
            <div class="card shadow border-0 h-100">
                <div class="card-header bg-primary text-white fw-semibold">
                    <i class="bi bi-info-circle me-2"></i>Informations du véhicule
                </div>
                <div class="card-body">
                    <table class="table table-borderless mb-0">
                        <tr>
                            <th class="text-muted" style="width:40%">Marque</th>
                            <td class="fw-semibold">{{ $voiture->marque }}</td>
                        </tr>
                        <tr>
                            <th class="text-muted">Modèle</th>
                            <td class="fw-semibold">{{ $voiture->modele }}</td>
                        </tr>
                        <tr>
                            <th class="text-muted">Année</th>
                            <td>
                                <span class="badge bg-secondary px-3 py-2">{{ $voiture->annee }}</span>
                            </td>
                        </tr>
                        <tr>
                            <th class="text-muted">Enregistré le</th>
                            <td>{{ $voiture->created_at?->format('d/m/Y') ?? '—' }}</td>
                        </tr>
                    </table>
                </div>
                <div class="card-footer bg-transparent d-flex gap-2">
                    <a href="{{ route('voitures.edit', $voiture->id) }}" class="btn btn-warning">
                        <i class="bi bi-pencil me-1"></i>Modifier
                    </a>
                    <form action="{{ route('voitures.destroy', $voiture->id) }}" method="POST">
                        @csrf @method('DELETE')
                        <button type="submit" class="btn btn-outline-danger"
                                onclick="return confirm('Supprimer ce véhicule ?')">
                            <i class="bi bi-trash me-1"></i>Supprimer
                        </button>
                    </form>
                </div>
            </div>
        </div>

        {{-- Infos propriétaire --}}
        <div class="col-lg-4">
            <div class="card shadow border-0 h-100">
                <div class="card-header bg-dark text-white fw-semibold">
                    <i class="bi bi-person me-2"></i>Propriétaire
                </div>
                <div class="card-body">
                    @if($voiture->client)
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                                 style="width:52px;height:52px;flex-shrink:0">
                                <i class="bi bi-person-fill text-primary fs-4"></i>
                            </div>
                            <div>
                                <div class="fw-bold fs-6">{{ $voiture->client->nom }}</div>
                                <small class="text-muted">{{ $voiture->client->email }}</small>
                            </div>
                        </div>
                        <table class="table table-borderless mb-0 small">
                            <tr>
                                <th class="text-muted">Téléphone</th>
                                <td>{{ $voiture->client->telephone ?? '—' }}</td>
                            </tr>
                        </table>
                        <div class="mt-3">
                            <a href="{{ route('clients.show', $voiture->client->id) }}"
                               class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-eye me-1"></i>Voir le profil client
                            </a>
                        </div>
                    @else
                        <p class="text-muted fst-italic">Aucun propriétaire associé.</p>
                    @endif
                </div>
            </div>
        </div>

    </div>
</div>
@endsection
