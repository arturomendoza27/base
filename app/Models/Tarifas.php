<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarifas extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombre',
        'valor',
        'valor_conexion',
        'valor_reconexion',
        'estado',
        'vigente_desde',
        'vigente_hasta',
        'categoria_id',
    ];

    // Una tarifa pertenece a una categoría
    public function categoria()
    {
        return $this->belongsTo(Categorias_predios::class, 'categoria_id');
    }

      // Scope para obtener la tarifa vigente
    public function scopeVigente($query)
    {
        return $query->whereNull('vigente_hasta')
                     ->orWhere('vigente_hasta', '>=', now());
    }


      // Scope para obtener la tarifa activa
    public function scopeInactiva($query)
    {
        return $query->orWhere('estado', '=', 'inactiva');
    }

   
// 🔹 Relación con categoría
   

    /**
     * 🔹 Crea una nueva tarifa y cierra automáticamente la anterior
     */
    public static function crearNuevaTarifa(array $data)
    {   
         // Normalizo el nombre: primera letra en mayúscula, resto en minúscula
    $data['nombre'] = ucfirst(strtolower($data['nombre']));
    
    // Buscar la tarifa activa anterior de la MISMA CATEGORÍA (sin importar el nombre)
    $tarifaAnterior = self::where('categoria_id', $data['categoria_id'])
        ->where('estado', 'activa')
        ->vigente()
        ->first();

    if ($tarifaAnterior) {
        // Cerrar la tarifa anterior un día antes de la nueva fecha de inicio
        $tarifaAnterior->update([
            'vigente_hasta' => Carbon::parse($data['vigente_desde'])->subDay(),
            'estado' => 'inactiva',
        ]);
    }

    // Crear la nueva tarifa
    return self::create($data);
    }

    

    /**
     * 📅 Formatear valores al mostrarlos
     */
    // public function getValorFormateadoAttribute(): string
    // {
    //     return '$' . number_format($this->valor, 2);
    // }


}