<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NouveauRdvAdmin extends Mailable
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
            ->subject('🔔 Nouveau rendez-vous — ValidAuto')
            ->view('emails.nouveau_rdv_admin');
    }
}
