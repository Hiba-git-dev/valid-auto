<div class="mb-3">
    <label>Nom</label>
    <input type="text" name="nom" value="{{ old('nom', $rendezvous->nom ?? '') }}" class="form-control" required>
</div>

<div class="mb-3">
    <label>Email</label>
    <input type="email" name="email" value="{{ old('email', $rendezvous->email ?? '') }}" class="form-control" required>
</div>

<div class="mb-3">
    <label>Service</label>
    <select name="service" class="form-control" required>
        <option value="">Choisir...</option>
        <option value="Visite technique" {{ old('service', $rendezvous->service ?? '') == 'Visite technique' ? 'selected' : '' }}>Visite technique</option>
        <option value="Vidange" {{ old('service', $rendezvous->service ?? '') == 'Vidange' ? 'selected' : '' }}>Vidange</option>
        <option value="Pneumatiques" {{ old('service', $rendezvous->service ?? '') == 'Pneumatiques' ? 'selected' : '' }}>Pneumatiques</option>
    </select>
</div>

<div class="mb-3">
    <label>Date</label>
    <input type="date" name="date" value="{{ old('date', $rendezvous->date ?? '') }}" class="form-control" required>
</div>

<div class="mb-3">
    <label>Heure</label>
    <input type="text" name="hour" value="{{ old('hour', $rendezvous->hour ?? '') }}" class="form-control" placeholder="Heure (ex: 14:30)">
</div>

<div class="mb-3">
    <label>Marque</label>
    <input type="text" name="marque" value="{{ old('marque', $rendezvous->marque ?? '') }}" class="form-control" required>
</div>

<div class="mb-3">
    <label>Année</label>
    <input type="text" name="year" value="{{ old('year', $rendezvous->year ?? '') }}" class="form-control" required>
</div>

<div class="mb-3">
    <label>Matricule</label>
    <input type="text" name="matricule" value="{{ old('matricule', $rendezvous->matricule ?? '') }}" class="form-control" required>
</div>

<div class="mb-3">
    <label>Kilométrage</label>
    <input type="text" name="kilometrage" value="{{ old('kilometrage', $rendezvous->kilometrage ?? '') }}" class="form-control" required>
</div>

<div class="mb-3">
    <label>Requête</label>
    <textarea name="requete" class="form-control">{{ old('requete', $rendezvous->requete ?? '') }}</textarea>
</div>

<button type="submit" class="btn btn-primary">{{ $button }}</button>
<a href="{{ route('rendezvous.index') }}" class="btn btn-secondary">Annuler</a>
