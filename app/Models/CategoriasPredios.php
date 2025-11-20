<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class CategoriasPredios extends Model
{
    /** @use HasFactory<\Database\Factories\CategoriasPrediosFactory> */
    use HasFactory, LogsActivity;
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
     public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['categorias_predios','nombre', 'descripcion']);
        // Chain fluent methods for configuration options
    }
}
