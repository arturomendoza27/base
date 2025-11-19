<?php

namespace App\Console\Commands;

use App\Models\Facturacion;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CambioEstadosFacturas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cambio-estados-facturas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualiza los estados de las facturas a vencida o suspendida después del día 15 de cada mes.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //

 $hoy = Carbon::now();

        // Ejecutar solo después del día 15
        if ($hoy->day <= 15) {
            $this->info('Aún no se ejecuta la tarea (solo después del día 15).');
             // $text = "[" . date("Y-m-d H:i:s") . "]:Aún no se ejecuta la tarea (solo después del día 15).";
            //  Storage::append("pruebas.txt", $text);
            return 0;
        }

        $this->info('Actualizando estados de facturas...');

        // 1. Marcar como vencidas (sin pago, dentro del mes actual)
        $vencidas = Facturacion::where('estado', 'pendiente')
            ->whereDate('fecha_vencimiento', '<=', $hoy)
            ->update(['estado' => 'vencida']);

        // 2. Marcar como suspendidas (más de 1 mes vencidas)
        $limiteSuspension = $hoy->copy()->subMonth();
        $suspendidas = Facturacion::where('estado', 'vencida')
            ->whereDate('fecha_vencimiento', '<', $limiteSuspension)
            ->update(['estado' => 'suspendida']);

        $this->info("Facturas vencidas actualizadas: {$vencidas}");
        $this->info("Facturas suspendidas actualizadas: {$suspendidas}");

        return 0;
        
        ///esto es una pruba para saber si esta ejecutandose correctamente 

        $text = "[" . date("Y-m-d H:i:s") . "]: Hola prueba tareas";
        Storage::append("pruebas.txt", $text);
        echo "pruebas";
    }
}
