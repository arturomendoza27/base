<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CiclosFacturacion extends Model
{
     use HasFactory;

    protected $table = 'ciclos_facturacion';

    protected $fillable = [
        'anio',
        'mes',
        'estado',
        'fecha_inicio',
        'fecha_fin',
        
    ];

    // Relación: un ciclo tiene muchas facturas
    public function facturas()
    {
        return $this->hasMany(Facturacion::class, 'ciclo_id');
    }

    // Scope para obtener el ciclo activo/abierto
    public function scopeAbierto($query)
    {
        return $query->where('estado', 'abierto');
    }

     public function scopeConFacturasPagas($query)
    {
        return $query->whereHas('facturas', function ($q) {
            $q->where('estado', 'pagada');
        });
    }


     public function scopeConFacturasAbonodas($query)
    {
        return $query->whereHas('facturas', function ($q) {
            $q->where('estado', 'abono');
        });
    }

     /**
     * Scope: ciclos con facturas vencidas
     */
     public function scopeConFacturasVencidas($query)
    {
        return $query->whereHas('facturas', function ($q) {
            $q->where('estado', 'vencida');
        });
    }

    /**
     * Scope: ciclos con facturas vencidas
     */
    public function scopeConFacturasSuspendidas($query)
    {
        return $query->whereHas('facturas', function ($facturaQuery) {
            $facturaQuery->whereIn('predio_id', function ($sub) {
                $sub->select('predio_id')
                    ->from('facturas as f2')
                    ->whereIn('id', function ($inner) {
                        $inner->select('id')
                              ->from('facturas as f3')
                              ->whereColumn('f3.predio_id', 'f2.predio_id')
                              ->orderByDesc('f3.fecha_emision')
                              ->limit(2); // Solo las dos últimas facturas
                    })
                    ->groupBy('predio_id')
                    ->havingRaw("SUM(CASE WHEN estado = 'VENCIDA' THEN 1 ELSE 0 END) = 2");
            });
        });
    }
}
