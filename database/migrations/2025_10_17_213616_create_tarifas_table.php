<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tarifas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categoria_id')->constrained('categorias_predios')->cascadeOnDelete();
            $table->string('nombre', 100);
            $table->decimal('valor', 12, 2);
            $table->decimal('valor_conexion', 12, 2);
            $table->decimal('valor_reconexion', 12, 2);
            $table->date('vigente_desde');
            $table->date('vigente_hasta')->nullable();
            $table->enum('estado', ['activa', 'inactiva'])->default('activa');
            $table->timestamps();

            // 🔒 Restricción única simple (permite solo una tarifa por categoría)
            // $table->unique('categoria_id');
            
            // O restricción única compuesta
            //$table->unique(['categoria_id', 'estado']);


    

          
        });

        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tarifas');
    }
};
