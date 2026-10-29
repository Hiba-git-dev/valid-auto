<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $search = $request->input('search');

    $clients = Client::with('voitures')
        ->when($search, function ($query, $search) {
            $query->where('nom', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('telephone', 'LIKE', "%{$search}%");
        })
        ->orderBy('nom')
        ->get();

    return view('clients.index', compact('clients', 'search'));
}


public function create()
{
    return view('clients.create');
}

public function store(Request $request)
{
    $validated = $request->validate([
        'nom' => 'required|string',
        'email' => 'required|email',
        'telephone' => 'nullable|string',
    ]);

    Client::create($validated);
    return redirect()->route('clients.index')->with('success', 'Client ajouté.');
}

public function edit(Client $client)
{
    return view('clients.edit', compact('client'));
}

public function update(Request $request, Client $client)
{
    $validated = $request->validate([
        'nom' => 'required|string',
        'email' => 'required|email',
        'telephone' => 'nullable|string',
    ]);

    $client->update($validated);
    return redirect()->route('clients.index')->with('success', 'Client mis à jour.');
}

public function destroy(Client $client)
{
    $client->delete();
    return redirect()->route('clients.index')->with('success', 'Client supprimé.');
}
public function show(Client $client)
{
    // Charger les voitures liées au client
    $client->load('voitures');

    return view('clients.show', compact('client'));
}
public function register(Request $request)
{
    $request->validate([
        'nom' => 'required|string|max:255',
        'email' => 'required|string|email|unique:clients',
        'password' => 'required|string|min:6|confirmed',
        'telephone' => 'nullable|string|max:15',
    ]);

    $client = Client::create([
        'nom' => $request->nom,
        'email' => $request->email,
        'password' => $request->password,
        'telephone' => $request->telephone,
    ]);

    $token = $client->createToken('apptoken')->plainTextToken;

    return response()->json([
        'message' => 'Compte client créé avec succès',
        'user' => $client,
        'token' => $token,
    ], 201);
}

public function login(Request $request)
{
    $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    $client = Client::where('email', $request->email)->first();

    if (!$client || !Hash::check($request->password, $client->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    // create Sanctum token
    $token = $client->createToken('clienttoken')->plainTextToken;

    return response()->json([
        'user' => $client,
        'token' => $token
    ], 200);
}


}
