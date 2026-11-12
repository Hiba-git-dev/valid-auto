<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rendez_vous', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('email');
            $table->enum('service', ['Visite technique', 'Vidange', 'Pneumatiques']);
            $table->dateTime('date'); // Renommer en "date"
            $table->string('requete')->nullable(); // Renommer et rendre nullable
            $table->string('marque');
            $table->string('year');
            $table->string('matricule')->nullable();
            $table->integer('kilometrage')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rendez_vouses');
    }
};
