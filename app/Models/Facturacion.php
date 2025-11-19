<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facturacion extends Model
{
    use HasFactory;
    protected $table = 'facturacion';
    protected $fillable = [
        'cliente_id',
        'predio_id',
        'ciclo_id',
        'numero',
        'fecha_emision',
        'fecha_vencimiento',
        'concepto',
        'saldo_anterior',
        'saldo_actual',
        'saldo_conexion',
        'saldo_reconexion',
        'total_factura',
        'estado', // emitida, pagada, vencida, anulada
        'generada_automaticamente',
        'observaciones'
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function cliente()
    {
        return $this->belongsTo(Clientes::class, 'cliente_id');
    }

    public function predio()
    {
        return $this->belongsTo(Predios::class, 'predio_id');
    }

    public function ciclo()
    {
        return $this->belongsTo(CiclosFacturacion::class, 'ciclo_id');
    }


    public function scopeConCicloAbierto($query)
    {
        return $query->whereHas('ciclo', function ($q) {
            $q->where('estado', 'abierto');
        });
    }

    public function pagos()
    {
        return $this->hasMany(Pagos::class, 'factura_id');
    }
}
