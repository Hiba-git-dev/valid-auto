@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Liste des clients</h1>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <a href="{{ route('clients.create') }}" class="btn btn-primary mb-3">Ajouter un client</a>

    <form action="{{ route('clients.index') }}" method="GET" class="mb-3">
        <div class="input-group">
            <input type="text" name="search" value="{{ request('search') }}" class="form-control" placeholder="Rechercher par nom, email ou téléphone">
            <button class="btn btn-primary" type="submit">
                <i class="bi bi-search"></i> Rechercher
            </button>
            @if(request('search'))
                <a href="{{ route('clients.index') }}" class="btn btn-outline-secondary">Réinitialiser</a>
            @endif
        </div>
    </form>

    @if($clients->count() > 0)
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Voitures</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($clients as $client)
                <tr>
                    <td><a href="{{ route('clients.show', $client->id) }}">{{ $client->nom }}</a></td>
                    <td>{{ $client->email }}</td>
                    <td>{{ $client->telephone ?? '-' }}</td>
                    <td>{{ $client->voitures->count() }}</td>
                    <td>
                        <a href="{{ route('clients.edit', $client->id) }}" class="btn btn-sm btn-warning">Modifier</a>

                        <form action="{{ route('clients.destroy', $client->id) }}" method="POST" style="display:inline-block;">
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
        <p>Aucun client enregistré.</p>
    @endif
</div>
@endsection
