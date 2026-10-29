<?php

namespace App\Http\Controllers;

use App\Models\Voiture;
use App\Models\Client;
use Illuminate\Http\Request;

class VoitureController extends Controller
{
    public function index(Request $request)
{
    $search = $request->input('search');

    $voitures = Voiture::with('client')
        ->when($search, function ($query, $search) {
            $query->where('marque', 'LIKE', "%{$search}%")
                //   ->orWhere('matricule', 'LIKE', "%{$search}%")
                  ->orWhereHas('client', function ($q) use ($search) {
                      $q->where('nom', 'LIKE', "%{$search}%");
                  });
        })
        ->orderBy('marque')
        ->get();

    return view('voitures.index', compact('voitures', 'search'));
}


    public function create()
    {
        // On récupère tous les clients pour le select client
        $clients = Client::all();
        return view('voitures.create', compact('clients'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'marque' => 'required|string|max:255',
            'modele' => 'required|string|max:255',
            'annee' => 'required|string|max:4',
            'client_id' => 'required|exists:clients,id',
        ]);

        Voiture::create($validated);

        return redirect()->route('voitures.index')->with('success', 'Voiture ajoutée avec succès.');
    }

    public function show(Voiture $voiture)
    {
        return view('voitures.show', compact('voiture'));
    }

    public function edit(Voiture $voiture)
    {
        $clients = Client::all();
        return view('voitures.edit', compact('voiture', 'clients'));
    }

    public function update(Request $request, Voiture $voiture)
    {
        $validated = $request->validate([
            'marque' => 'required|string|max:255',
            'modele' => 'required|string|max:255',
            'annee' => 'required|string|max:4',
            'client_id' => 'required|exists:clients,id',
        ]);

        $voiture->update($validated);

        return redirect()->route('voitures.index')->with('success', 'Voiture mise à jour avec succès.');
    }

    public function destroy(Voiture $voiture)
    {
        $voiture->delete();
        return redirect()->route('voitures.index')->with('success', 'Voiture supprimée avec succès.');
    }
}
