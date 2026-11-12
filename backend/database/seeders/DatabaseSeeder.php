<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Client;
use App\Models\RendezVous;
use App\Models\Report;
use App\Models\User;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ═══════════════════════════════════════
        // 1. ADMIN (User)
        // ═══════════════════════════════════════
        User::updateOrCreate(
            ['email' => 'admin@validauto.ma'],
            [
                'name'     => 'Admin ValidAuto',
                'password' => Hash::make('admin1234'),
            ]
        );

        // ═══════════════════════════════════════
        // 2. CLIENTS
        // ⚠️  Le modèle Client bcrypt le mot de passe dans booted()
        //     → on passe le mot de passe EN CLAIR ici pour éviter le double hashage
        // ═══════════════════════════════════════
        $clients = [
            ['nom' => 'Yassine El Mansouri', 'email' => 'yassine@gmail.com',   'telephone' => '0661234567'],
            ['nom' => 'Fatima Zahra Benali', 'email' => 'fatima@gmail.com',    'telephone' => '0672345678'],
            ['nom' => 'Karim Ouahabi',       'email' => 'karim@gmail.com',     'telephone' => '0683456789'],
            ['nom' => 'Sara Tazi',           'email' => 'sara@gmail.com',      'telephone' => '0694567890'],
            ['nom' => 'Mohamed Alami',       'email' => 'mohamed@gmail.com',   'telephone' => '0705678901'],
        ];

        $createdClients = [];
        foreach ($clients as $c) {
            // Si le client existe déjà → on force la mise à jour du mot de passe
            $existing = Client::where('email', $c['email'])->first();
            if ($existing) {
                // Bypass le hook booted() pour ne pas double-hasher
                $existing->withoutEvents(function () use ($existing) {
                    $existing->password = bcrypt('client1234');
                    $existing->save();
                });
                $createdClients[] = $existing->fresh();
            } else {
                // Nouveau client → booted() appliquera bcrypt automatiquement
                $createdClients[] = Client::create([
                    'nom'       => $c['nom'],
                    'email'     => $c['email'],
                    'telephone' => $c['telephone'],
                    'password'  => 'client1234', // sera hashé par booted()
                ]);
            }
        }

        // ═══════════════════════════════════════
        // 3. RENDEZ-VOUS
        // ═══════════════════════════════════════
        $services  = ['Visite technique', 'Vidange', 'Pneumatiques'];
        $marques   = ['Dacia', 'Renault', 'Peugeot', 'Volkswagen', 'Toyota', 'Hyundai', 'Ford'];
        $heures    = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
        $statuts   = ['en_attente', 'confirmé', 'annulé'];

        $rdvData = [
            // Passés — confirmés → auront des rapports
            ['client' => 0, 'date' => now()->subDays(30), 'service' => 'Visite technique', 'marque' => 'Dacia',      'year' => '2019', 'matricule' => '12345-A-1', 'km' => 87000,  'heure' => '09:00', 'statut' => 'confirmé'],
            ['client' => 1, 'date' => now()->subDays(20), 'service' => 'Vidange',           'marque' => 'Renault',    'year' => '2021', 'matricule' => '67890-B-2', 'km' => 42000,  'heure' => '10:00', 'statut' => 'confirmé'],
            ['client' => 2, 'date' => now()->subDays(15), 'service' => 'Pneumatiques',      'marque' => 'Peugeot',    'year' => '2018', 'matricule' => '11111-C-3', 'km' => 120000, 'heure' => '11:00', 'statut' => 'confirmé'],
            ['client' => 3, 'date' => now()->subDays(10), 'service' => 'Visite technique',  'marque' => 'Volkswagen', 'year' => '2020', 'matricule' => '22222-D-4', 'km' => 65000,  'heure' => '13:00', 'statut' => 'confirmé'],
            ['client' => 4, 'date' => now()->subDays(5),  'service' => 'Vidange',           'marque' => 'Toyota',     'year' => '2022', 'matricule' => '33333-E-5', 'km' => 28000,  'heure' => '14:00', 'statut' => 'confirmé'],
            // Passé — annulé
            ['client' => 2, 'date' => now()->subDays(7),  'service' => 'Pneumatiques',      'marque' => 'Hyundai',    'year' => '2017', 'matricule' => '44444-F-6', 'km' => 98000,  'heure' => '15:00', 'statut' => 'annulé'],
            // Futur — en attente
            ['client' => 0, 'date' => now()->addDays(3),  'service' => 'Visite technique',  'marque' => 'Dacia',      'year' => '2019', 'matricule' => '12345-A-1', 'km' => 88000,  'heure' => '08:00', 'statut' => 'en_attente'],
            ['client' => 1, 'date' => now()->addDays(5),  'service' => 'Vidange',           'marque' => 'Renault',    'year' => '2021', 'matricule' => '67890-B-2', 'km' => 43000,  'heure' => '09:00', 'statut' => 'en_attente'],
            ['client' => 3, 'date' => now()->addDays(8),  'service' => 'Pneumatiques',      'marque' => 'Ford',       'year' => '2023', 'matricule' => '55555-G-7', 'km' => 15000,  'heure' => '10:00', 'statut' => 'en_attente'],
            // Futur — confirmé
            ['client' => 4, 'date' => now()->addDays(12), 'service' => 'Visite technique',  'marque' => 'Toyota',     'year' => '2022', 'matricule' => '33333-E-5', 'km' => 29000,  'heure' => '11:00', 'statut' => 'confirmé'],
        ];

        $createdRdvs = [];
        foreach ($rdvData as $r) {
            $client = $createdClients[$r['client']];
            $rdv = RendezVous::create([
                'nom'         => $client->nom,
                'email'       => $client->email,
                'service'     => $r['service'],
                'date'        => $r['date']->format('Y-m-d'),
                'hour'        => $r['heure'],
                'marque'      => $r['marque'],
                'year'        => $r['year'],
                'matricule'   => $r['matricule'],
                'kilometrage' => $r['km'],
                'requete'     => null,
                'client_id'   => $client->id,
                'statut'      => $r['statut'],
            ]);
            $createdRdvs[] = ['rdv' => $rdv, 'statut' => $r['statut'], 'date' => $r['date']];
        }

        // ═══════════════════════════════════════
        // 4. RAPPORTS (seulement pour les RDV confirmés passés)
        // ═══════════════════════════════════════
        $rapportsData = [
            // rdv index 0 — Visite technique Dacia
            [
                'work_duration' => '2h30',
                'modifications' => "Contrôle complet effectué.\n- Freins : usure normale (40%)\n- Pneus avant : remplacement recommandé\n- Huile moteur : niveau correct\n- Filtres : changement effectué\n- Éclairage : fonctionnel",
                'price'         => 450.00,
            ],
            // rdv index 1 — Vidange Renault
            [
                'work_duration' => '1h00',
                'modifications' => "Vidange complète réalisée.\n- Huile moteur 5W40 : remplacée (5L)\n- Filtre à huile : remplacé\n- Filtre à air : nettoyé\n- Niveaux vérifiés et complétés",
                'price'         => 280.00,
            ],
            // rdv index 2 — Pneumatiques Peugeot
            [
                'work_duration' => '1h30',
                'modifications' => "Remplacement pneumatiques.\n- 4 pneus Michelin Energy Saver 205/55 R16 montés\n- Équilibrage et géométrie vérifiés\n- Pression gonflage : 2.2 bars",
                'price'         => 1800.00,
            ],
            // rdv index 3 — Visite technique Volkswagen
            [
                'work_duration' => '2h00',
                'modifications' => "Visite technique réussie.\n- Châssis : bon état\n- Suspension : légère usure, surveiller\n- Direction : correcte\n- Système électrique : OK\n- Climatisation : rechargée",
                'price'         => 350.00,
            ],
            // rdv index 4 — Vidange Toyota
            [
                'work_duration' => '0h45',
                'modifications' => "Vidange préventive effectuée.\n- Huile moteur 0W20 Full Synthetic : remplacée\n- Filtre à huile neuf\n- Remplissage liquide de frein\n- Contrôle batterie : 78% charge",
                'price'         => 320.00,
            ],
        ];

        // Associer les rapports aux 5 premiers RDV confirmés passés (index 0→4)
        foreach ($rapportsData as $i => $rapData) {
            $rdv = $createdRdvs[$i]['rdv'];
            if ($createdRdvs[$i]['statut'] === 'confirmé') {
                Report::create([
                    'rendezvous_id' => $rdv->id,
                    'client_name'   => $rdv->nom,
                    'car_marque'    => $rdv->marque,
                    'car_model'     => $rdv->marque . ' ' . $rdv->year,
                    'matricule'     => $rdv->matricule,
                    'kilometrage'   => $rdv->kilometrage,
                    'year'          => $rdv->year,
                    'requete'       => $rdv->requete,
                    'work_duration' => $rapData['work_duration'],
                    'modifications' => $rapData['modifications'],
                    'price'         => $rapData['price'],
                ]);
            }
        }

        $this->command->info('✅ Base de données remplie avec succès !');
        $this->command->table(
            ['Entité', 'Quantité'],
            [
                ['Admins (users)',  User::count()],
                ['Clients',         Client::count()],
                ['Rendez-vous',     RendezVous::count()],
                ['Rapports',        Report::count()],
            ]
        );
    }
}
