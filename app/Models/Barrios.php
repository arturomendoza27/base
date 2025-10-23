<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barrios extends Model
{
    /** @use HasFactory<\Database\Factories\BarriosFactory> */
    use HasFactory;

     protected $fillable = [
        'nombre',
        'abreviatura',
    ];

     public function predios()
    {
        return $this->hasMany(Predios::class, 'barrio_id');
    }
}
