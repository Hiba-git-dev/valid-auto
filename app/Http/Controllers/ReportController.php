<?php
namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\RendezVous;
use Illuminate\Http\Request;
use Report as GlobalReport;

class ReportController extends Controller
{
    public function create($rendezvous_id)
    {
        $rdv = RendezVous::findOrFail($rendezvous_id);
        return view('reports.create', compact('rdv'));
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'rendezvous_id' => 'required|exists:rendez_vous,id',
        'client_name' => 'required|string',
        'car_marque' => 'required|string',
        'car_model' => 'required|string',
        'matricule' => 'required|string',
        'kilometrage' => 'required|integer',
        'year' => 'required|integer',
        'requete' => 'nullable|string',
        'work_duration' => 'nullable|string',
        'modifications' => 'nullable|string',
        'price' => 'required|numeric',
    ]);

    $report = Report::create($validated);

    return redirect()->route('reports.show', $report->id)
                     ->with('success', 'Bilan créé avec succès.');
}


    public function show(Report $report)
    {
        return view('reports.show', compact('report'));
    }
}
