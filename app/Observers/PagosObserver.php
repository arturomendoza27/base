<?php

namespace App\Observers;
use App\Models\Pagos;
use App\Models\LogActividad;
use Illuminate\Support\Facades\Auth;
class PagosObserver
{
    public function created(Pago $pago)
    {
        $this->registrarLog('Creación', $pago);
    }

    public function updated(Pago $pago)
    {
        $this->registrarLog('Actualización', $pago);
    }

    public function deleted(Pago $pago)
    {
        $this->registrarLog('Eliminación', $pago);
    }

    protected function registrarLog(string $accion, Pago $pago)
    {
        LogActividad::create([
            'user_id' => Auth::id(),
            'accion' => $accion,
            'entidad' => 'pagos',
            'entidad_id' => $pago->id,
            'detalle' => "Pago de factura #{$pago->factura_id} - Monto: $" . number_format($pago->monto, 0, ',', '.'),
        ]);
    }
}
