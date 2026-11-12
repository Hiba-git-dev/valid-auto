@extends('layouts.app')

@section('title', 'ValidAuto - Tableau de Bord & Rendez-vous')

@section('content')
<div class="container-fluid px-4 pb-5">

    {{-- Flash --}}
    @if(session('success'))
        <div class="alert alert-success alert-dismissible fade show mt-3 shadow-sm" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>{{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    {{-- Header --}}
    <div class="d-flex justify-content-between align-items-center my-4 flex-wrap gap-3">
        <div>
            <h2 class="fw-bold mb-1">
                <i class="bi bi-speedometer2 text-danger me-2"></i>Tableau de Bord &amp; Rendez-vous
            </h2>
            <p class="text-muted small mb-0">Supervision opérationnelle et analytique du centre de contrôle ValidAuto</p>
        </div>
        <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-outline-dark" type="button" data-bs-toggle="collapse" data-bs-target="#analyticsCollapse" aria-expanded="true">
                <i class="bi bi-pie-chart-fill me-1 text-primary"></i> <span id="toggleAnalyticsText">Masquer Graphiques</span>
            </button>
            <a href="{{ route('rendezvous.export') }}" class="btn btn-outline-success">
                <i class="bi bi-file-earmark-spreadsheet me-1"></i> Exporter CSV
            </a>
            <a href="{{ route('rendezvous.create') }}" class="btn btn-danger">
                <i class="bi bi-plus-circle me-1"></i> Nouveau RDV
            </a>
        </div>
    </div>

    {{-- Section Analytics (Graphiques & Métriques Clés) --}}
    <div class="collapse show mb-4" id="analyticsCollapse">
        <!-- 4 KPI Cards -->
        <div class="row g-3 mb-4">
            {{-- Total RDV --}}
            <div class="col-sm-6 col-xl-3">
                <div class="card shadow-sm border-0 border-start border-primary border-4 h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="text-muted small fw-semibold text-uppercase">Total Rendez-vous</div>
                                <h3 class="fw-bold mb-0 text-dark">{{ $counts['all'] ?? 0 }}</h3>
                            </div>
                            <div class="bg-primary bg-opacity-10 text-primary p-3 rounded-circle">
                                <i class="bi bi-calendar2-range fs-4"></i>
                            </div>
                        </div>
                        <div class="mt-2 small text-muted">
                            <i class="bi bi-activity text-primary me-1"></i>Volume global enregistré
                        </div>
                    </div>
                </div>
            </div>

            {{-- Confirmés & Taux --}}
            <div class="col-sm-6 col-xl-3">
                <div class="card shadow-sm border-0 border-start border-success border-4 h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="text-muted small fw-semibold text-uppercase">Confirmés (Validés)</div>
                                <h3 class="fw-bold mb-0 text-success">{{ $counts['confirmé'] ?? 0 }}</h3>
                            </div>
                            <div class="bg-success bg-opacity-10 text-success p-3 rounded-circle">
                                <i class="bi bi-check-circle-fill fs-4"></i>
                            </div>
                        </div>
                        <div class="mt-2 small text-muted d-flex align-items-center justify-content-between">
                            <span>Taux de validation:</span>
                            <span class="badge bg-success">{{ $confirmationRate ?? 0 }}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {{-- En attente --}}
            <div class="col-sm-6 col-xl-3">
                <div class="card shadow-sm border-0 border-start border-warning border-4 h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="text-muted small fw-semibold text-uppercase">En Attente</div>
                                <h3 class="fw-bold mb-0 text-warning">{{ $counts['en_attente'] ?? 0 }}</h3>
                            </div>
                            <div class="bg-warning bg-opacity-10 text-warning p-3 rounded-circle">
                                <i class="bi bi-hourglass-split fs-4"></i>
                            </div>
                        </div>
                        <div class="mt-2 small text-muted">
                            <i class="bi bi-bell-fill text-warning me-1"></i>Nécessitent une validation
                        </div>
                    </div>
                </div>
            </div>

            {{-- Annulés / Refusés --}}
            <div class="col-sm-6 col-xl-3">
                <div class="card shadow-sm border-0 border-start border-danger border-4 h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="text-muted small fw-semibold text-uppercase">Annulés / Rejetés</div>
                                <h3 class="fw-bold mb-0 text-danger">{{ $counts['annulé'] ?? 0 }}</h3>
                            </div>
                            <div class="bg-danger bg-opacity-10 text-danger p-3 rounded-circle">
                                <i class="bi bi-x-circle-fill fs-4"></i>
                            </div>
                        </div>
                        <div class="mt-2 small text-muted">
                            <i class="bi bi-arrow-repeat text-muted me-1"></i>Créneaux libérés
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 2 Visual Charts Side by Side -->
        <div class="row g-3">
            {{-- Graphique 1: Répartition par Service --}}
            <div class="col-lg-6">
                <div class="card shadow-sm border-0 h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0 text-dark">
                            <i class="bi bi-pie-chart text-danger me-2"></i>Répartition par Type de Prestation
                        </h6>
                        <span class="badge bg-light text-dark border">Services</span>
                    </div>
                    <div class="card-body d-flex flex-column justify-content-center align-items-center" style="min-height: 280px; position: relative;">
                        @if(empty($serviceCounts))
                            <p class="text-muted small my-auto">Aucune donnée disponible pour le graphique.</p>
                        @else
                            <div style="width: 100%; max-width: 360px; height: 250px;">
                                <canvas id="serviceChart"></canvas>
                            </div>
                        @endif
                    </div>
                </div>
            </div>

            {{-- Graphique 2: Statut des Demandes --}}
            <div class="col-lg-6">
                <div class="card shadow-sm border-0 h-100">
                    <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0 text-dark">
                            <i class="bi bi-bar-chart-fill text-primary me-2"></i>État &amp; Traitement des Rendez-vous
                        </h6>
                        <span class="badge bg-light text-dark border">Performance</span>
                    </div>
                    <div class="card-body d-flex flex-column justify-content-center align-items-center" style="min-height: 280px; position: relative;">
                        @if(($counts['all'] ?? 0) === 0)
                            <p class="text-muted small my-auto">Aucun rendez-vous à afficher.</p>
                        @else
                            <div style="width: 100%; height: 250px;">
                                <canvas id="statusChart"></canvas>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Filtres par Statut (1-clic) --}}
    <div class="d-flex flex-wrap gap-2 mb-3">
        <a href="{{ route('rendezvous.index', array_filter(['search' => request('search')])) }}"
           class="btn btn-sm {{ !request('statut') ? 'btn-dark' : 'btn-outline-secondary' }} rounded-pill px-3 py-2 fw-semibold">
            Tous <span class="badge {{ !request('statut') ? 'bg-secondary' : 'bg-secondary bg-opacity-25 text-dark' }} ms-1">{{ $counts['all'] ?? 0 }}</span>
        </a>
        <a href="{{ route('rendezvous.index', array_filter(['statut' => 'en_attente', 'search' => request('search')])) }}"
           class="btn btn-sm {{ request('statut') === 'en_attente' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark' }} rounded-pill px-3 py-2 fw-semibold">
            <i class="bi bi-hourglass-split me-1"></i>En attente <span class="badge bg-dark text-warning ms-1">{{ $counts['en_attente'] ?? 0 }}</span>
        </a>
        <a href="{{ route('rendezvous.index', array_filter(['statut' => 'confirmé', 'search' => request('search')])) }}"
           class="btn btn-sm {{ request('statut') === 'confirmé' ? 'btn-success' : 'btn-outline-success' }} rounded-pill px-3 py-2 fw-semibold">
            <i class="bi bi-check-circle me-1"></i>Confirmés <span class="badge {{ request('statut') === 'confirmé' ? 'bg-white text-success' : 'bg-success text-white' }} ms-1">{{ $counts['confirmé'] ?? 0 }}</span>
        </a>
        <a href="{{ route('rendezvous.index', array_filter(['statut' => 'annulé', 'search' => request('search')])) }}"
           class="btn btn-sm {{ request('statut') === 'annulé' ? 'btn-danger' : 'btn-outline-danger' }} rounded-pill px-3 py-2 fw-semibold">
            <i class="bi bi-x-circle me-1"></i>Annulés <span class="badge {{ request('statut') === 'annulé' ? 'bg-white text-danger' : 'bg-danger text-white' }} ms-1">{{ $counts['annulé'] ?? 0 }}</span>
        </a>
    </div>

    {{-- Search --}}
    <form action="{{ route('rendezvous.index') }}" method="GET" class="mb-4">
        @if(request('statut'))
            <input type="hidden" name="statut" value="{{ request('statut') }}">
        @endif
        <div class="input-group" style="max-width:480px">
            <input type="text" name="search" value="{{ request('search') }}"
                   class="form-control shadow-sm" placeholder="Rechercher nom, email, service, matricule…">
            <button class="btn btn-primary" type="submit">
                <i class="bi bi-search"></i>
            </button>
            @if(request('search'))
                <a href="{{ route('rendezvous.index', array_filter(['statut' => request('statut')])) }}" class="btn btn-outline-secondary">
                    <i class="bi bi-x-lg me-1"></i>Réinitialiser
                </a>
            @endif
        </div>
    </form>

    {{-- Table RDV --}}
    @if($rendezvous->count())
    <div class="card shadow-sm border-0">
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0" style="min-width:900px">
                    <thead class="table-dark">
                        <tr>
                            <th style="width:130px">Statut</th>
                            <th>Nom / Email</th>
                            <th>Service</th>
                            <th>Date &amp; Heure</th>
                            <th>Véhicule</th>
                            <th>Matricule</th>
                            <th style="width:280px" class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($rendezvous as $rdv)
                        <tr>

                            {{-- STATUT --}}
                            <td>
                                @if($rdv->statut === 'confirmé')
                                    <span class="badge bg-success px-3 py-2 fs-6">
                                        <i class="bi bi-check-circle me-1"></i>Confirmé
                                    </span>
                                @elseif($rdv->statut === 'annulé')
                                    <span class="badge bg-danger px-3 py-2 fs-6">
                                        <i class="bi bi-x-circle me-1"></i>Annulé
                                    </span>
                                @else
                                    <span class="badge bg-warning text-dark px-3 py-2 fs-6">
                                        <i class="bi bi-hourglass-split me-1"></i>En attente
                                    </span>
                                @endif
                            </td>

                            {{-- NOM / EMAIL / TEL --}}
                            <td>
                                <div class="fw-semibold">{{ $rdv->nom }}</div>
                                <small class="text-muted d-block">{{ $rdv->email }}</small>
                                @if($rdv->client && $rdv->client->telephone)
                                    <small class="text-success"><i class="bi bi-telephone-fill me-1"></i>{{ $rdv->client->telephone }}</small>
                                @endif
                            </td>

                            {{-- SERVICE --}}
                            <td><span class="fw-medium text-dark">{{ $rdv->service }}</span></td>

                            {{-- DATE --}}
                            <td>
                                <span class="badge bg-light text-dark border px-3 py-2">
                                    <i class="bi bi-calendar3 me-1 text-primary"></i>
                                    {{ \Carbon\Carbon::parse($rdv->date)->format('d/m/Y') }}
                                    @if($rdv->hour)
                                        &nbsp;<strong>{{ $rdv->hour }}</strong>
                                    @endif
                                </span>
                            </td>

                            {{-- VEHICULE --}}
                            <td>{{ $rdv->marque }} {{ $rdv->year }}</td>

                            {{-- MATRICULE --}}
                            <td>
                                @if($rdv->matricule)
                                    <span class="badge bg-dark text-white font-monospace">{{ $rdv->matricule }}</span>
                                @else
                                    <span class="text-muted">—</span>
                                @endif
                            </td>

                            {{-- ACTIONS --}}
                            <td class="text-center">
                                <div class="d-flex flex-wrap justify-content-center gap-2 py-1">

                                    {{-- ✅ Confirmer --}}
                                    @if($rdv->statut !== 'confirmé')
                                    <form action="{{ route('rendezvous.statut', $rdv->id) }}" method="POST">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="statut" value="confirmé">
                                        <button type="submit"
                                                class="btn btn-sm btn-success"
                                                onclick="return confirm('Confirmer ce rendez-vous ?')">
                                            <i class="bi bi-check-lg me-1"></i>Confirmer
                                        </button>
                                    </form>
                                    @endif

                                    {{-- ❌ Refuser --}}
                                    @if($rdv->statut !== 'annulé')
                                    <form action="{{ route('rendezvous.statut', $rdv->id) }}" method="POST">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="statut" value="annulé">
                                        <button type="submit"
                                                class="btn btn-sm btn-outline-danger"
                                                onclick="return confirm('Refuser / annuler ce rendez-vous ?')">
                                            <i class="bi bi-x-lg me-1"></i>Refuser
                                        </button>
                                    </form>
                                    @endif

                                    {{-- 👁 Voir --}}
                                    <a href="{{ route('rendezvous.show', $rdv->id) }}"
                                       class="btn btn-sm btn-outline-info">
                                        <i class="bi bi-eye me-1"></i>Détails
                                    </a>

                                    {{-- 📄 Bilan --}}
                                    <a href="{{ route('reports.create', $rdv->id) }}"
                                       class="btn btn-sm btn-outline-primary">
                                        <i class="bi bi-file-earmark-text me-1"></i>Bilan
                                    </a>

                                    {{-- 📲 WhatsApp Notification Directe --}}
                                    @php
                                        $phone = $rdv->client->telephone ?? '0661234567';
                                        $phoneClean = preg_replace('/[^0-9]/', '', $phone);
                                        if (str_starts_with($phoneClean, '0')) {
                                            $phoneClean = '212' . substr($phoneClean, 1);
                                        } elseif (!str_starts_with($phoneClean, '212')) {
                                            $phoneClean = '212' . $phoneClean;
                                        }
                                        $dateFr = \Carbon\Carbon::parse($rdv->date)->format('d/m/Y');
                                        $heureFr = $rdv->hour ? " à {$rdv->hour}" : "";
                                        $carStr = trim(($rdv->marque ?? 'Véhicule') . ' ' . ($rdv->year ?? ''));
                                        $matStr = $rdv->matricule ? " [{$rdv->matricule}]" : "";
                                        $waText = "Bonjour {$rdv->nom}, votre rendez-vous pour \"{$rdv->service}\" chez ValidAuto Fès est confirmé pour le {$dateFr}{$heureFr} (Véhicule: {$carStr}{$matStr}). Pensez à vous munir de votre Carte Grise originale et de votre attestation d'assurance valide. À très bientôt !";
                                        $waLink = "https://wa.me/{$phoneClean}?text=" . rawurlencode($waText);
                                    @endphp
                                    <a href="{{ $waLink }}" target="_blank"
                                       class="btn btn-sm text-white d-inline-flex align-items-center gap-1 shadow-sm"
                                       style="background: #25D366; border-color: #25D366; font-weight: 600;"
                                       title="Envoyer une confirmation officielle sur WhatsApp">
                                        <i class="bi bi-whatsapp"></i> WhatsApp
                                    </a>

                                    {{-- 🗑 Supprimer --}}
                                    <form action="{{ route('rendezvous.destroy', $rdv->id) }}" method="POST">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit"
                                                class="btn btn-sm btn-outline-secondary"
                                                onclick="return confirm('Supprimer définitivement ce rendez-vous ?')">
                                            <i class="bi bi-trash"></i>
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
        <div class="alert alert-info text-center mt-4 shadow-sm">
            <i class="bi bi-info-circle me-2"></i>Aucun rendez-vous trouvé correspondant aux critères.
        </div>
    @endif

</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {
    // Toggle label for analytics collapse button
    const collapseElem = document.getElementById('analyticsCollapse');
    const toggleText = document.getElementById('toggleAnalyticsText');
    if (collapseElem && toggleText) {
        collapseElem.addEventListener('hidden.bs.collapse', function () {
            toggleText.textContent = 'Afficher Graphiques';
        });
        collapseElem.addEventListener('shown.bs.collapse', function () {
            toggleText.textContent = 'Masquer Graphiques';
        });
    }

    // Chart 1: Donut Chart - Services
    const serviceCanvas = document.getElementById('serviceChart');
    if (serviceCanvas) {
        const serviceLabels = {!! json_encode(array_keys($serviceCounts ?? [])) !!};
        const serviceData = {!! json_encode(array_values($serviceCounts ?? [])) !!};

        const colors = ['#E74C3C', '#3498DB', '#F39C12', '#2ECC71', '#9B59B6', '#1ABC9C'];

        new Chart(serviceCanvas, {
            type: 'doughnut',
            data: {
                labels: serviceLabels,
                datasets: [{
                    data: serviceData,
                    backgroundColor: colors.slice(0, serviceLabels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: { size: 12, weight: '500' }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = serviceData.reduce((a, b) => a + b, 0);
                                const val = context.raw || 0;
                                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                return ` ${context.label}: ${val} RDV (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '62%'
            }
        });
    }

    // Chart 2: Bar Chart - Status
    const statusCanvas = document.getElementById('statusChart');
    if (statusCanvas) {
        const statusLabels = ['Confirmés', 'En attente', 'Annulés'];
        const statusData = [
            {{ $counts['confirmé'] ?? 0 }},
            {{ $counts['en_attente'] ?? 0 }},
            {{ $counts['annulé'] ?? 0 }}
        ];

        new Chart(statusCanvas, {
            type: 'bar',
            data: {
                labels: statusLabels,
                datasets: [{
                    label: 'Nombre de Rendez-vous',
                    data: statusData,
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.85)',
                        'rgba(243, 156, 18, 0.85)',
                        'rgba(231, 76, 60, 0.85)'
                    ],
                    borderColor: [
                        '#27ae60',
                        '#d68910',
                        '#c0392b'
                    ],
                    borderWidth: 1.5,
                    borderRadius: 6,
                    maxBarThickness: 50
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.parsed.y} rendez-vous`;
                            }
                        }
                    }
                }
            }
        });
    }
});
</script>
@endpush
