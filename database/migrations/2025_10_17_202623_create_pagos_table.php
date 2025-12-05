<?php

use Carbon\Carbon;
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
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('factura_id')->constrained('facturacion')->onDelete('cascade');
            $table->date('fecha_pago')->nullable();
            $table->decimal('valor_pagado', 12, 2);
            $table->decimal('saldo_restante', 12, 2);
            $table->string('medio_pago')->nullable(); // efectivo, transferencia, etc.
            $table->string('recibo_banco')->nullable();
            $table->string('recibo_numero')->nullable();  //en caso de trasnferencia se digita el numero de autorizacion
            $table->date('recibo_fecha')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
