<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function index() {
        return Contact::all();
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|string',
            'telephone' => 'required|string|max:20',
            'adresse' => 'required|string',
        ]);

        Contact::create($validated);

        return response()->json(['message' => 'Message enregistré avec succès'], 201);
    }
}
