<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactMessage;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'nom'       => 'required|string|max:255',
            'email'     => 'required|email|max:255',
            'telephone' => 'nullable|string|max:50',
            'adresse'   => 'nullable|string|max:255',
            'message'   => 'required|string|max:1000',
        ]);

        $details = $request->only(['nom', 'email', 'telephone', 'adresse', 'message']);

        // Tentative d'envoi email — erreur gérée pour ne pas retourner 500
        $mailSent = false;
        try {
            Mail::to('ouahmanehiba2@gmail.com')->send(new ContactMessage($details));
            $mailSent = true;
        } catch (\Exception $e) {
            // Log l'erreur sans planter l'API
            Log::error('Erreur envoi email contact : ' . $e->getMessage(), $details);
        }

        return response()->json([
            'success' => true,
            'message' => 'Votre message a été envoyé avec succès !',
            'mail_sent' => $mailSent,
        ]);
    }
}
