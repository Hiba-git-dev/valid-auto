@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Détails du client</h1>

    <div class="card mb-4">
        <div class="card-body">
            <h2>{{ $client->nom }}</h2>
            <p><strong>Email :</strong> {{ $client->email }}</p>
            <p><strong>Téléphone :</strong> {{ $client->telephone ?? 'Non renseigné' }}</p>
        </div>
    </div>

    <h3>Voitures du client</h3>
    @if($client->voitures->count() > 0)
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Marque</th>
                    <th>Modèle</th>
                    <th>Année</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($client->voitures as $voiture)
                    <tr>
                        <td>{{ $voiture->marque }}</td>
                        <td>{{ $voiture->modele }}</td>
                        <td>{{ $voiture->annee }}</td>
                        <td>
                            <a href="{{ route('voitures.show', $voiture->id) }}" class="btn btn-sm btn-info">Voir</a>
                            <a href="{{ route('voitures.edit', $voiture->id) }}" class="btn btn-sm btn-warning">Modifier</a>
                            <form action="{{ route('voitures.destroy', $voiture->id) }}" method="POST" style="display:inline-block;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" onclick="return confirm('Confirmer la suppression ?')" class="btn btn-sm btn-danger">Supprimer</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>Ce client n'a aucune voiture enregistrée.</p>
    @endif

    <a href="{{ route('clients.index') }}" class="btn btn-secondary mt-3">Retour à la liste des clients</a>
</div>
@endsection
