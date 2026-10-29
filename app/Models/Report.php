<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'rendezvous_id', 'client_name', 'car_marque', 'car_model',
        'matricule', 'kilometrage', 'year', 'requete',
        'work_duration', 'modifications', 'price'
    ];

    public function rendezvous()
    {
        return $this->belongsTo(RendezVous::class, 'rendezvous_id');
    }
}
