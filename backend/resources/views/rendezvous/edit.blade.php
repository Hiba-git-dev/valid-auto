@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Modifier le rendez-vous</h2>

    <form action="{{ route('rendezvous.update', $rendezvous->id) }}" method="POST">
        @csrf
        @method('PUT')

        <input type="text" name="nom" value="{{ old('nom', $rendezvous->nom) }}" class="form-control mb-3" required>
        <input type="email" name="email" value="{{ old('email', $rendezvous->email) }}" class="form-control mb-3" required>
        <input type="text" name="service" value="{{ old('service', $rendezvous->service) }}" class="form-control mb-3" required>
        <input type="date" name="date" value="{{ old('date', $rendezvous->date) }}" class="form-control mb-3" required>
        <input type="text" name="hour" value="{{ old('hour', $rendezvous->hour) }}" class="form-control mb-3" placeholder="Heure (ex: 14:30)">
        <input type="text" name="marque" value="{{ old('marque', $rendezvous->marque) }}" class="form-control mb-3" required>
        <input type="number" name="year" value="{{ old('year', $rendezvous->year) }}" class="form-control mb-3" required>
        <input type="text" name="matricule" value="{{ old('matricule', $rendezvous->matricule) }}" class="form-control mb-3">
        <input type="number" name="kilometrage" value="{{ old('kilometrage', $rendezvous->kilometrage) }}" class="form-control mb-3">
        <textarea name="requete" class="form-control mb-3">{{ old('requete', $rendezvous->requete) }}</textarea>

        <button type="submit" class="btn btn-success">Mettre à jour</button>
    </form>
</div>
@endsection
