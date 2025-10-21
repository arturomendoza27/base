<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Clientes extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombre',
        'email',
        'documento',
        'telefono',
        'direccion',
        'password',
        'estado',
    ];

     protected $hidden = ['password'];

    // Un usuario puede tener varios predios
    public function predios()
    {
        return $this->hasMany(Predios::class, 'usuario_id');
    }

    // Un usuario puede tener varios pagos
    public function pagos()
    {
        return $this->hasMany(Pagos::class, 'usuario_id');
    }

    // Un usuario puede tener facturas directamente (si aplica)
    public function facturas()
    {
        return $this->hasMany(Facturacion::class, 'usuario_id');
    }
}
