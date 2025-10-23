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
       Schema::create('predios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->string('matricula_predial')->unique();
            $table->string('direccion_predio');
            $table->foreignId('barrio_id')->constrained('barrios')->onDelete('cascade');
            $table->string('ruta')->nullable()->unique();
            $table->enum('estado_servicio', ['activo', 'suspendido', 'desconectado'])->default('activo'); 
            $table->date('fecha_conexion')->nullable();
            $table->date('fecha_suspension')->nullable();
            $table->date('fecha_reconexion')->nullable();
            $table->foreignId('categoria_id')->nullable()->constrained('categorias_predios');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('predios');
    }
};
