<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */ 
    public function up(): void
    {
        Schema::create('facturacion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->foreignId('predio_id')->constrained('predios')->onDelete('cascade');
            $table->foreignId('ciclo_id')->constrained('ciclos_facturacion')->onDelete('cascade');
            
             // Datos de la factura
            
            $table->date('fecha_emision');
            $table->date('fecha_vencimiento');
            $table->string('concepto', 255);  // motivo por el cual se esta cobrando reconexion, conexion, o tarifa mensual
            
            // Saldos y valores
            $table->decimal('saldo_anterior', 12, 2)->default(0);
            $table->decimal('saldo_actual', 12, 2)->default(0);
            $table->decimal('saldo_conexion', 12, 2)->default(0); //la conexion del punto de agua (cobro unico)
            $table->decimal('saldo_reconexion', 12, 2)->default(0); //la reconexion del punto de agua
            $table->decimal('total_factura', 12, 2)->default(0);
            
            // Estado de la factura emitida, pagada, vencida, anulada
            $table->enum('estado', ['pendiente', 'pagada', 'vencida', 'anulada', 'abono'])->default('pendiente');
            $table->boolean('generada_automaticamente')->default(true);

            // Auditoría
            // $table->timestamp('fecha_pago')->nullable();
            $table->text('observaciones')->nullable();

            $table->timestamps();
        });

         DB::statement('ALTER TABLE facturacion AUTO_INCREMENT = 100000;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facturacion');
    }
};
