<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facturacion extends Model
{
     use HasFactory;

    protected $fillable = [
        'cliente_id',
        'predio_id',
        'ciclo_id',
        'numero',
        'fecha_emision',
        'fecha_vencimiento',
        'tarifa',
        'subtotal',
        'impuestos',
        'total',
        'estado', // emitida, pagada, vencida, anulada
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function predio()
    {
        return $this->belongsTo(Predio::class, 'predio_id');
    }

    public function ciclo()
    {
        return $this->belongsTo(CicloFacturacion::class, 'ciclo_id');
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class, 'factura_id');
    }
}
