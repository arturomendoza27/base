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
        Schema::create('cartera_vencida', function (Blueprint $table) {
             $table->id();
            $table->foreignId('predio_id')->constrained('predios')->onDelete('cascade');
            $table->foreignId('factura_id')->constrained('facturacion')->onDelete('cascade');
            $table->date('fecha_vencimiento');
            $table->integer('dias_mora');
            $table->decimal('valor_pendiente', 12, 2);
            $table->enum('estado', ['vigente', 'cancelada', 'en_cobro'])->default('vigente');
            $table->date('fecha_ultima_actualizacion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cartera_vencida');
    }
};
