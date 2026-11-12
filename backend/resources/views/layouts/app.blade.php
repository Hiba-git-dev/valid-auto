<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'ValidAuto - Administration')</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            background-color: #f8f9fa;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .navbar-brand {
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .va-badge-accent {
            background: linear-gradient(135deg, #e74c3c, #ff6b35);
            color: #fff;
        }
    </style>
    @stack('styles')
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
        <div class="container-fluid px-4">
            <a class="navbar-brand text-danger fw-bold" href="{{ url('/rendezvous') }}">
                <i class="bi bi-shield-check me-1"></i>VALID<span class="text-white">AUTO</span> <span class="badge bg-danger fs-6 ms-1">Admin</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="adminNavbar">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link {{ request()->is('rendezvous*') ? 'active fw-bold text-white' : '' }}" href="{{ url('/rendezvous') }}">
                            <i class="bi bi-calendar-check me-1"></i>Rendez-vous
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ request()->is('voitures*') ? 'active fw-bold text-white' : '' }}" href="{{ url('/voitures') }}">
                            <i class="bi bi-car-front me-1"></i>Véhicules
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ request()->is('clients*') ? 'active fw-bold text-white' : '' }}" href="{{ url('/clients') }}">
                            <i class="bi bi-people me-1"></i>Clients
                        </a>
                    </li>
                </ul>
                <div class="d-flex align-items-center gap-3">
                    <a href="http://localhost:3001/accueil" target="_blank" class="btn btn-sm btn-outline-light">
                        <i class="bi bi-box-arrow-up-right me-1"></i> Voir le site
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <main>
        @yield('content')
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts')
</body>
</html>
