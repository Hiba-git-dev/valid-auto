<?php

namespace App\Http\Controllers;

use App\Models\RendezVous;
use App\Mail\ConfirmationRdvClient;
use App\Mail\NouveauRdvAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class RendezVousController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $statut = $request->input('statut');

        $counts = [
            'all'        => RendezVous::count(),
            'en_attente' => RendezVous::where('statut', 'en_attente')->count(),
            'confirmé'   => RendezVous::where('statut', 'confirmé')->count(),
            'annulé'     => RendezVous::where('statut', 'annulé')->count(),
        ];

        $totalNonZero = $counts['all'] > 0 ? $counts['all'] : 1;
        $confirmationRate = round(($counts['confirmé'] / $totalNonZero) * 100, 1);

        $serviceCounts = RendezVous::selectRaw('service, count(*) as count')
            ->groupBy('service')
            ->pluck('count', 'service')
            ->toArray();

        $dailyCounts = RendezVous::selectRaw('date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->take(7)
            ->pluck('count', 'date')
            ->toArray();

        $rendezvous = RendezVous::query()
            ->with('client')
            ->when($statut && in_array($statut, ['en_attente', 'confirmé', 'annulé']), function ($q) use ($statut) {
                $q->where('statut', $statut);
            })
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%")
                      ->orWhere('service', 'LIKE', "%{$search}%")
                      ->orWhere('marque', 'LIKE', "%{$search}%")
                      ->orWhere('matricule', 'LIKE', "%{$search}%");
                });
            })
            ->orderBy('date', 'desc')
            ->get();

        return view('rendezvous.index', compact('rendezvous', 'search', 'statut', 'counts', 'serviceCounts', 'dailyCounts', 'confirmationRate'));
    }


    public function store(Request $request)
{
    $request->validate([
        'nom' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'service' => 'required|string',
        'date' => 'required|date',
        'hour' => 'required|string', // e.g., "09:00", "14:30"
        'marque' => 'nullable|string|max:255',
        'year' => 'nullable|integer',
        'matricule' => 'nullable|string|max:50',
        'kilometrage' => 'nullable|integer',
        'requete' => 'nullable|string|max:1000',
    ]);

    // Check if the selected date/hour is already booked
    $exists = \App\Models\RendezVous::where('date', $request->date)
        ->where('hour', $request->hour)
        ->exists();

    if ($exists) {
        return response()->json([
            'message' => 'Ce créneau horaire est déjà réservé. Veuillez en choisir un autre.'
        ], 422);
    }

    // Create the rendezvous
    $rendezvous = \App\Models\RendezVous::create([
        'nom'         => $request->nom,
        'email'       => $request->email,
        'service'     => $request->service,
        'date'        => $request->date,
        'hour'        => $request->hour,
        'marque'      => $request->marque ?: 'Véhicule',
        'year'        => $request->year ?: date('Y'),
        'matricule'   => $request->matricule,
        'kilometrage' => $request->kilometrage,
        'requete'     => $request->requete,
        'client_id'   => $request->user()?->id,
        'statut'      => 'en_attente',
    ]);

    // Prepare data array for email templates
    $rdvData = $rendezvous->toArray();

    // 1️⃣ Email de confirmation au client
    try {
        Mail::to($request->email)->send(new ConfirmationRdvClient($rdvData));
    } catch (\Exception $e) {
        Log::warning('Email confirmation client non envoyé : ' . $e->getMessage());
    }

    // 2️⃣ Notification à l'admin
    try {
        Mail::to(config('mail.admin_email', 'alimejber055@gmail.com'))
            ->send(new NouveauRdvAdmin($rdvData));
    } catch (\Exception $e) {
        Log::warning('Email notification admin non envoyé : ' . $e->getMessage());
    }

    return response()->json([
        'message'     => 'Rendez-vous enregistré avec succès ! Un email de confirmation vous a été envoyé.',
        'rendezvous'  => $rendezvous
    ], 201);
}


    public function edit($id)
    {
        $rendezvous = RendezVous::findOrFail($id);
        return view('rendezvous.edit', compact('rendezvous'));
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'service' => 'required|string|in:Visite technique,Vidange,Pneumatiques',
            'date' => 'required|date',
            'hour' => 'nullable|string',
            'marque' => 'required|string|max:255',
            'year' => 'required|integer',
            'requete' => 'nullable|string|max:500',
            'matricule' => 'nullable|string|max:50',
            'kilometrage' => 'nullable|integer'
        ]);

        $rendezvous = RendezVous::findOrFail($id);
        $rendezvous->update($validated);

        return redirect()->route('rendezvous.index')->with('success', 'Rendez-vous mis à jour avec succès.');
    }

    public function destroy($id)
    {
        $rendezvous = RendezVous::findOrFail($id);
        $rendezvous->delete();

        return redirect()->route('rendezvous.index')->with('success', 'Rendez-vous supprimé.');
    }

    public function create()
    {
        return view('rendezvous.create');
    }

    public function show($id)
    {
        $rendezvous = RendezVous::findOrFail($id);
        return view('rendezvous.show', compact('rendezvous'));
    }

    public function rapport($id)
    {
        $rdv = RendezVous::findOrFail($id);
        return view('rendezvous.rapport', compact('rdv'));
    }

    /**
     * PATCH /rendezvous/{id}/statut
     * Admin confirms or refuses a RDV
     */
    public function updateStatut(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:en_attente,confirmé,annulé',
        ]);

        $rendezvous = RendezVous::findOrFail($id);
        $rendezvous->update(['statut' => $request->statut]);

        $label = $request->statut === 'confirmé' ? 'confirmé' : 'refusé';

        return redirect()->route('rendezvous.index')
                         ->with('success', "Rendez-vous de {$rendezvous->nom} {$label} avec succès.");
    }

    public function availableDates()
    {
        $dates = collect();
        $today = now();

        for ($i = 0; $i < 30; $i++) {
            $date = $today->copy()->addDays($i)->toDateString();
            $count = RendezVous::whereDate('date', $date)->count();

            if ($count < 4) {
                $dates->push($date);
            }
        }

        return response()->json($dates);
    }

    public function availableHours(Request $request)
{
    $date = $request->query('date'); // yyyy-mm-dd
    if (!$date) return response()->json([], 400);

    // Define working hours
    $allHours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

    // Get already booked hours for that date
    $bookedHours = RendezVous::whereDate('date', $date)->pluck('hour')->toArray();


    // Return only available hours
    $availableHours = array_diff($allHours, $bookedHours);

    return response()->json(array_values($availableHours));
}

    /**
     * GET /api/tracker?matricule=...
     * Public Quick Tracker by plate number
     */
    public function trackMatricule(Request $request)
    {
        $matricule = trim($request->input('matricule'));

        if (!$matricule) {
            return response()->json(['message' => 'Veuillez saisir un numéro de matricule.'], 422);
        }

        $rdv = RendezVous::where('matricule', 'LIKE', "%{$matricule}%")
            ->with('report')
            ->orderBy('date', 'desc')
            ->first();

        if (!$rdv) {
            return response()->json(['message' => "Aucun rendez-vous trouvé pour le matricule : {$matricule}"], 404);
        }

        return response()->json([
            'id'          => $rdv->id,
            'nom'         => $rdv->nom,
            'service'     => $rdv->service,
            'date'        => $rdv->date,
            'hour'        => $rdv->hour,
            'marque'      => $rdv->marque,
            'year'        => $rdv->year,
            'matricule'   => $rdv->matricule,
            'kilometrage' => $rdv->kilometrage,
            'statut'      => $rdv->statut,
            'has_report'  => !is_null($rdv->report),
            'report'      => $rdv->report ? [
                'id'            => $rdv->report->id,
                'price'         => $rdv->report->price,
                'work_duration' => $rdv->report->work_duration,
                'modifications' => $rdv->report->modifications,
            ] : null,
        ]);
    }

    /**
     * GET /rendezvous/export/csv
     * Export all rendezvous to CSV for Excel
     */
    public function exportCsv(Request $request)
    {
        $fileName = 'rendezvous_validauto_' . date('Y-m-d_H-i') . '.csv';
        $rendezvous = RendezVous::orderBy('date', 'desc')->get();

        $headers = [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['ID', 'Statut', 'Nom Client', 'Email', 'Service', 'Date', 'Heure', 'Marque', 'Annee', 'Matricule', 'Kilometrage'];

        $callback = function() use ($rendezvous, $columns) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF"); // BOM for Excel UTF-8
            fputcsv($file, $columns, ';');

            foreach ($rendezvous as $rdv) {
                fputcsv($file, [
                    $rdv->id,
                    strtoupper($rdv->statut),
                    $rdv->nom,
                    $rdv->email,
                    $rdv->service,
                    $rdv->date,
                    $rdv->hour ?? '—',
                    $rdv->marque ?? '—',
                    $rdv->year ?? '—',
                    $rdv->matricule ?? '—',
                    $rdv->kilometrage ? $rdv->kilometrage . ' km' : '—',
                ], ';');
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
