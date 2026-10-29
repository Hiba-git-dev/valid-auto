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
    Schema::create('reports', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('rendezvous_id');
        $table->string('client_name');
        $table->string('car_marque');
        $table->string('car_model');
        $table->string('matricule');
        $table->integer('kilometrage');
        $table->integer('year');
        $table->text('requete')->nullable();
        $table->string('work_duration')->nullable();
        $table->text('modifications')->nullable();
        $table->decimal('price', 8, 2)->default(0);
        $table->timestamps();

        $table->foreign('rendezvous_id')->references('id')->on('rendez_vous')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
