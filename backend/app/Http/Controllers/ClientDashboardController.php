<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\RendezVous;
use App\Models\Report;

class ClientDashboardController extends Controller
{
    /**
     * GET /api/dashboard/stats
     * Overview stats for the authenticated client
     */
    public function stats(Request $request)
    {
        $client = $request->user();

        $totalRdv     = RendezVous::where('client_id', $client->id)->count();
        $upcomingRdv  = RendezVous::where('client_id', $client->id)
                            ->where('date', '>=', now())
                            ->count();
        $pastRdv      = RendezVous::where('client_id', $client->id)
                            ->where('date', '<', now())
                            ->count();
        $totalReports = Report::whereHas('rendezvous', function ($q) use ($client) {
                            $q->where('client_id', $client->id);
                        })->count();

        return response()->json([
            'total_rdv'     => $totalRdv,
            'upcoming_rdv'  => $upcomingRdv,
            'past_rdv'      => $pastRdv,
            'total_reports' => $totalReports,
        ]);
    }

    /**
     * GET /api/dashboard/rendezvous
     * All RDV of the authenticated client
     */
    public function mesRendezvous(Request $request)
    {
        $client = $request->user();

        $rendezvous = RendezVous::where('client_id', $client->id)
            ->with('report')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($rendezvous);
    }

    /**
     * GET /api/dashboard/rapports
     * All reports linked to client's rendezvous
     */
    public function mesRapports(Request $request)
    {
        $client = $request->user();

        $reports = Report::whereHas('rendezvous', function ($q) use ($client) {
                        $q->where('client_id', $client->id);
                    })
                    ->with('rendezvous')
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json($reports);
    }

    /**
     * GET /api/dashboard/rapports/{id}
     * Get a single report for the authenticated client
     */
    public function unRapport(Request $request, $id)
    {
        $client = $request->user();

        $report = Report::where('id', $id)
            ->whereHas('rendezvous', function ($q) use ($client) {
                $q->where('client_id', $client->id);
            })
            ->with('rendezvous')
            ->first();

        if (!$report) {
            return response()->json(['message' => 'Rapport introuvable'], 404);
        }

        return response()->json($report);
    }

    /**
     * GET /api/dashboard/rapports/{id}/pdf
     * View/Print printable report
     */
    public function telechargerRapport(Request $request, $id)
    {
        $client = $request->user();

        $report = Report::where('id', $id)
            ->whereHas('rendezvous', function ($q) use ($client) {
                $q->where('client_id', $client->id);
            })
            ->with('rendezvous')
            ->first();

        if (!$report) {
            return response()->json(['message' => 'Rapport introuvable'], 404);
        }

        return view('reports.show', compact('report'));
    }

    /**
     * GET /api/dashboard/voitures
     * Client's registered vehicles
     */
    public function mesVoitures(Request $request)
    {
        $client = $request->user();
        $voitures = $client->voitures()->orderBy('created_at', 'desc')->get();
        return response()->json($voitures);
    }

    /**
     * GET /api/dashboard/profil
     * Client's profile info
     */
    public function profil(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * PUT /api/dashboard/profil
     * Update client profile
     */
    public function updateProfil(Request $request)
    {
        $client = $request->user();

        $validated = $request->validate([
            'nom'       => 'sometimes|string|max:255',
            'telephone' => 'sometimes|string|max:20',
        ]);

        $client->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user'    => $client->fresh(),
        ]);
    }

    /**
     * DELETE /api/dashboard/rendezvous/{id}
     * Client cancels one of their upcoming RDV
     */
    public function annulerRdv(Request $request, $id)
    {
        $client = $request->user();

        $rdv = RendezVous::where('id', $id)
                    ->where('client_id', $client->id)
                    ->first();

        if (!$rdv) {
            return response()->json(['message' => 'Rendez-vous introuvable.'], 404);
        }

        if ($rdv->statut === 'annulé') {
            return response()->json(['message' => 'Ce rendez-vous est déjà annulé.'], 422);
        }

        if (new \DateTime($rdv->date) < new \DateTime()) {
            return response()->json(['message' => 'Impossible d\'annuler un rendez-vous passé.'], 422);
        }

        $rdv->update(['statut' => 'annulé']);

        return response()->json(['message' => 'Rendez-vous annulé avec succès.']);
    }

    /**
     * PUT /api/dashboard/password
     * Change client password
     */
    public function changePassword(Request $request)
    {
        $client = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($request->current_password, $client->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect'], 422);
        }

        $client->update(['password' => bcrypt($request->password)]);

        return response()->json(['message' => 'Mot de passe modifié avec succès']);
    }
}
