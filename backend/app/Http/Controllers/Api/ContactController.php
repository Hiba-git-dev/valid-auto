<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email',
            'telephone' => 'required|string|max:20',
            'adresse' => 'required|string',
        ]);

        // Send email (or store in DB if you prefer)
        Mail::raw(
            "Nouveau message de : {$validated['nom']}\nEmail: {$validated['email']}\nTéléphone: {$validated['telephone']}\nAdresse: {$validated['adresse']}",
            function ($message) use ($validated) {
                $message->to('alimejber055@gmail.com')  // Replace with your actual email
                        ->subject('Nouveau message de contact');
            }
        );

        return response()->json(['message' => 'Message envoyé avec succès !']);
    }
}
