<?php

namespace App\Observers;
use App\Models\Facturas;
use App\Models\LogActividad;
use Illuminate\Support\Facades\Auth;


class FacturacionObserver
{
   public function created(Facturas $factura)
    {
        $this->registrarLog('Creación', $factura);
    }

    public function updated(Facturas $factura)
    {
        $this->registrarLog('Actualización', $factura);
    }

    public function deleted(Facturas $factura)
    {
        $this->registrarLog('Eliminación', $factura);
    }

    protected function registrarLog(string $accion, Facturas $factura)
    {
        LogActividad::create([
            'user_id' => Auth::id(),
            'accion' => $accion,
            'entidad' => 'facturas',
            'entidad_id' => $factura->id,
            'detalle' => "Factura #{$factura->numero} - Total: $" . number_format($factura->total, 0, ',', '.'),
        ]);
    }
}
