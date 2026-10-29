<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientDashboardController;
use App\Http\Controllers\RendezVousController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ContactMessageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register-client', [ClientController::class, 'register']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/rendezvous', [RendezVousController::class, 'index']);
Route::get('/available-dates', [RendezVousController::class, 'availableDates']);
Route::get('/tracker', [RendezVousController::class, 'trackMatricule']);
Route::post('/contact', [ContactController::class, 'send']);

// Protected routes (require token) — guard 'api' uses Client model
Route::middleware('auth:api')->group(function () {
    Route::post('/rendezvous', [RendezVousController::class, 'store']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/available-hours', [RendezVousController::class, 'availableHours']);

    // ── Client Dashboard ──
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats',                 [ClientDashboardController::class, 'stats']);
        Route::get('/rendezvous',             [ClientDashboardController::class, 'mesRendezvous']);
        Route::delete('/rendezvous/{id}',     [ClientDashboardController::class, 'annulerRdv']);
        Route::get('/rapports',               [ClientDashboardController::class, 'mesRapports']);
        Route::get('/rapports/{id}',          [ClientDashboardController::class, 'unRapport']);
        Route::get('/rapports/{id}/pdf',      [ClientDashboardController::class, 'telechargerRapport']);
        Route::get('/voitures',               [ClientDashboardController::class, 'mesVoitures']);
        Route::get('/profil',                 [ClientDashboardController::class, 'profil']);
        Route::put('/profil',                 [ClientDashboardController::class, 'updateProfil']);
        Route::put('/password',               [ClientDashboardController::class, 'changePassword']);
    });
});
