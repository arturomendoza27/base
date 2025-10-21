<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Predios extends Model
{
 use HasFactory;

    protected $fillable = [
        'cliente_id',
        'matricula_predial',
        'direccion_predio',
        'ruta',
        'estado_servicio',
        'fecha_conexion',
        'fecha_suspension',
        'fecha_reconexion',
    ];

    // Relación: cada predio pertenece a un usuario
    public function cliente()
    {
        return $this->belongsTo(Clientes::class, 'cliente_id');
    }

    // Relación: un predio puede tener muchas facturas
    public function facturas()
    {
        return $this->hasMany(Facturacion::class, 'predio_id');
    }
}
