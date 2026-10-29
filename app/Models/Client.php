<?php
namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // <— change base class

class Client extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['nom', 'email', 'telephone', 'password'];

    protected $hidden = ['password', 'remember_token'];

    // Optional: if you create clients programmatically, keep hashing here
    protected static function booted()
    {
        static::creating(function ($client) {
            if ($client->password) {
                $client->password = bcrypt($client->password);
            }
        });
    }

    public function voitures()
    {
        return $this->hasMany(Voiture::class);
    }
}
