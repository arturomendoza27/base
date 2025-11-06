<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriasPredios extends Model
{
    /** @use HasFactory<\Database\Factories\CategoriasPrediosFactory> */
    use HasFactory;
    protected $table = 'categorias_predios';
     protected $fillable = ['nombre', 'descripcion'];

      // Una categoría tiene muchos predios
    public function predios()
    {
        return $this->hasMany(Predios::class, 'categoria_id');
    }

    // Una categoría tiene muchas tarifas
    public function tarifas()
    {
        return $this->hasMany(Tarifas::class, 'categoria_id');
    }
}
