<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarifas extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombre',
        'valor',
        'estado',
    ];

   
    /**
     * 📅 Formatear valores al mostrarlos
     */
    // public function getValorFormateadoAttribute(): string
    // {
    //     return '$' . number_format($this->valor, 2);
    // }


}