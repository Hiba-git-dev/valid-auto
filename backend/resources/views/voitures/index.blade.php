@extends('layouts.app')

@section('title', 'Gestion des Véhicules')

@section('content')
<div class="container-fluid px-4">

    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show mt-3">
            <i class="bi bi-check-circle-fill me-2"></i>{{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    <div class="d-flex justify-content-between align-items-center my-4">
        <h2 class="fw-bold mb-0">
            <i class="bi bi-car-front text-primary me-2"></i>Véhicules
        </h2>
        <a href="{{ route('voitures.create') }}" class="btn btn-success">
            <i class="bi bi-plus-circle me-1"></i>Ajouter un véhicule
        </a>
    </div>

    <form action="{{ route('voitures.index') }}" method="GET" class="mb-4">
        <div class="input-group" style="max-width:480px">
            <input type="text" name="search" value="{{ $search ?? '' }}"
                   class="form-control" placeholder="Rechercher marque, modèle ou client…">
            <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
            @if(!empty($search))
                <a href="{{ route('voitures.index') }}" class="btn btn-outline-secondary">
                    <i class="bi bi-x-lg me-1"></i>Réinitialiser
                </a>
            @endif
        </div>
    </form>

    @if($voitures->count())
    <div class="card shadow border-0">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0" style="min-width:700px">
                    <thead class="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Marque / Modèle</th>
                            <th>Année</th>
                            <th>Propriétaire</th>
                            <th class="text-center" style="width:230px">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($voitures as $voiture)
                        <tr>
                            <td class="text-muted">{{ $voiture->id }}</td>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                                         style="width:42px;height:42px;flex-shrink:0">
                                        <i class="bi bi-car-front-fill text-primary fs-5"></i>
                                    </div>
                                    <div>
                                        <div class="fw-semibold">{{ $voiture->marque }}</div>
                                        <small class="text-muted">{{ $voiture->modele }}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="badge bg-secondary px-3 py-2">
                                    <i class="bi bi-calendar3 me-1"></i>{{ $voiture->annee }}
                                </span>
                            </td>
                            <td>
                                @if($voiture->client)
                                    <div class="fw-semibold">{{ $voiture->client->nom }}</div>
                                    <small class="text-muted">{{ $voiture->client->email }}</small>
                                @else
                                    <span class="text-muted fst-italic">—</span>
                                @endif
                            </td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center gap-2 py-1">
                                    <a href="{{ route('voitures.show', $voiture->id) }}" class="btn btn-outline-info">
                                        <i class="bi bi-eye me-1"></i>Voir
                                    </a>
                                    <a href="{{ route('voitures.edit', $voiture->id) }}" class="btn btn-warning">
                                        <i class="bi bi-pencil me-1"></i>Modifier
                                    </a>
                                    <form action="{{ route('voitures.destroy', $voiture->id) }}" method="POST">
                                        @csrf @method('DELETE')
                                        <button type="submit" class="btn btn-outline-danger"
                                                onclick="return confirm('Supprimer ce véhicule ?')">
                                            <i class="bi bi-trash me-1"></i>Suppr.
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    @else
        <div class="alert alert-info text-center mt-4">
            <i class="bi bi-info-circle me-2"></i>Aucun véhicule enregistré.
            <a href="{{ route('voitures.create') }}" class="alert-link ms-2">Ajouter le premier</a>
        </div>
    @endif

</div>
@endsection
