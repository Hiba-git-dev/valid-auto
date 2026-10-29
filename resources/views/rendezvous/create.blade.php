@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Créer un rendez-vous</h2>

    <form action="{{ route('rendezvous.store') }}" method="POST">
        @csrf

        <input type="text" name="nom" placeholder="Nom" class="form-control mb-3" required>
        <input type="email" name="email" placeholder="Email" class="form-control mb-3" required>
        <input type="text" name="service" placeholder="Service" class="form-control mb-3" required>
        <input type="date" name="date" class="form-control mb-3" required>
        <input type="text" name="marque" placeholder="Marque" class="form-control mb-3" required>
        <input type="number" name="year" placeholder="Année" class="form-control mb-3" required>
        <input type="text" name="matricule" placeholder="Matricule" class="form-control mb-3">
        <input type="number" name="kilometrage" placeholder="Kilométrage" class="form-control mb-3">
        <textarea name="requete" placeholder="Requête" class="form-control mb-3"></textarea>

        <button type="submit" class="btn btn-primary">Enregistrer</button>
    </form>
</div>
@endsection
