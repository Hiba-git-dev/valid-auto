<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ConfirmationRdvClient extends Mailable
{
    use Queueable, SerializesModels;

    public $rdv;

    public function __construct($rdv)
    {
        $this->rdv = $rdv;
    }

    public function build()
    {
        return $this
            ->subject('✅ Confirmation de votre rendez-vous — ValidAuto')
            ->view('emails.confirmation_rdv_client');
    }
}
