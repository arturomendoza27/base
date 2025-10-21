<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'modulo',
        'accion',
        'descripcion',
        'datos_anteriores',
        'datos_nuevos',
        'referencia',
        'origen',
    ];

     protected $casts = [
        'datos_anteriores' => 'array',
        'datos_nuevos' => 'array',
    ];

     public function user()
    {
        return $this->belongsTo(User::class);
    }
}
