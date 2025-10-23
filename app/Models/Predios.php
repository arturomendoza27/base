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
        'barrio_id',
        'ruta',
        'estado_servicio',
        'fecha_conexion',
        'fecha_suspension',
        'fecha_reconexion', 
        'categoria_id',
    ];

    // Relación: cada predio pertenece a un usuario
    public function cliente()
    {
        return $this->belongsTo(Clientes::class, 'cliente_id');
    }

    public function barrio()
    {
        return $this->belongsTo(Barrios::class, 'barrio_id');
    }

      // Un predio pertenece a una categoría
    public function categoria()
    {
        return $this->belongsTo(Categorias_predios::class, 'categoria_id');
    }

    // Relación: un predio puede tener muchas facturas
    public function facturas()
    {
        return $this->hasMany(Facturacion::class, 'predio_id');
    }


    
}
