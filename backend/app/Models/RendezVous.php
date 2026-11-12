<?php

namespace App\Models;

use App\Models\Report as ModelsReport;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    use HasFactory;

    protected $table = 'rendez_vous';

    protected $fillable = [
        'nom', 'email', 'service', 'date', 'marque', 'year', 'requete',
        'matricule', 'kilometrage', 'hour', 'user_id', 'client_id', 'statut',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function report()
    {
        // Foreign key explicite car Laravel déduirait 'rendez_vous_id'
        // alors que la colonne dans reports s'appelle 'rendezvous_id'
        return $this->hasOne(ModelsReport::class, 'rendezvous_id');
    }
}
