<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CiclosFacturacion extends Model
{
     use HasFactory;

    protected $table = 'ciclos_facturacion';

    protected $fillable = [
        'anio',
        'mes',
        'estado',
        'fecha_inicio',
        'fecha_fin',
        
    ];

    // Relación: un ciclo tiene muchas facturas
    public function facturas()
    {
        return $this->hasMany(Facturacion::class, 'ciclo_id');
    }

    // Scope para obtener el ciclo activo/abierto
    public function scopeAbierto($query)
    {
        return $query->where('estado', 'abierto');
    }
}
