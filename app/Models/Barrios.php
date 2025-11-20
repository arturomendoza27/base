<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Barrios extends Model
{
    /** @use HasFactory<\Database\Factories\BarriosFactory> */
    use HasFactory, LogsActivity;

     protected $fillable = [
        'nombre',
        'abreviatura',
    ];

     public function predios()
    {
        return $this->hasMany(Predios::class, 'barrio_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
        ->logOnly(['nombre', 'abreviatura']);
        // Chain fluent methods for configuration options
    }
}
