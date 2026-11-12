<h2>Nouveau message depuis le site ValidAuto</h2>

<p><strong>Nom:</strong> {{ $details['nom'] }}</p>
<p><strong>Email:</strong> {{ $details['email'] }}</p>
<p><strong>Téléphone:</strong> {{ $details['telephone'] ?? 'Non fourni' }}</p>
<p><strong>Message:</strong></p>
<p>{{ $details['message'] }}</p>
