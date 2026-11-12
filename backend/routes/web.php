<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\RendezVousController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VoitureController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::resource('/clients', ClientController::class);
Route::resource('/voitures', VoitureController::class);
Route::get('/rendezvous', [RendezVousController::class, 'index'])->name('rendezvous.index');
Route::get('/rendezvous/export/csv', [RendezVousController::class, 'exportCsv'])->name('rendezvous.export');
Route::get('/rendezvous/create', [RendezVousController::class, 'create'])->name('rendezvous.create');
Route::post('/rendezvous', [RendezVousController::class, 'store'])->name('rendezvous.store');
Route::get('/rendezvous/{id}/edit', [RendezVousController::class, 'edit'])->name('rendezvous.edit');
Route::put('/rendezvous/{id}', [RendezVousController::class, 'update'])->name('rendezvous.update');
Route::delete('/rendezvous/{id}', [RendezVousController::class, 'destroy'])->name('rendezvous.destroy');
Route::patch('/rendezvous/{id}/statut', [RendezVousController::class, 'updateStatut'])->name('rendezvous.statut');
Route::get('/rendezvous/{id}', [RendezVousController::class, 'show'])->name('rendezvous.show');
Route::get('/rendezvous/{id}/rapport', [RendezVousController::class, 'rapport'])->name('rendezvous.rapport');
Route::get('/rendezvous/{rendezvous}/report/create', [ReportController::class, 'create'])->name('reports.create');
Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
Route::get('/reports/{report}', [ReportController::class, 'show'])->name('reports.show');
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
Route::post('/users/create', [UserController::class, 'create'])->name('users.create');
