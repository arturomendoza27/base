<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pagos extends Model
{
    protected $table = 'pagos';

    protected $fillable = [
        'factura_id',
        'cliente_id',
        'predio_id',
        'fecha_pago',
        'monto_pagado',
        'metodo_pago',
        'referencia',
        'observaciones',
        'registrado_por',
    ];

    /**
     * Relaciones
     */

    public function factura()
    {
        return $this->belongsTo(Facturas::class, 'factura_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Clientes::class, 'cliente_id');
    }

    public function predio()
    {
        return $this->belongsTo(Predios::class, 'predio_id');
    }

    /**
     * 🧾 Accessor para mostrar el formato de pago
     * 
     * Ejemplo: "Efectivo - $25.000 (2025-10-17)"
     */
    public function getDescripcionPagoAttribute(): string
    {
        return sprintf(
            "%s - $%s (%s)",
            ucfirst($this->metodo_pago),
            number_format($this->monto_pagado, 2),
            $this->fecha_pago->format('Y-m-d')
        );
    }
}
