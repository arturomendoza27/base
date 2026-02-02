<?php

namespace Database\Seeders;

use App\Models\Tarifas;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TarifasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $fechaDesde = Carbon::now()->startOfYear()->toDateString();
         // Crear tarifa
        $tarifa = Tarifas::firstOrCreate(
             [
                    'categoria_id'      => 1,
                    'nombre'            => 'Tarifa Residencial Básica',
                    'valor'             => 62000.00,
                    'valor_conexion'    => 0.00,
                    'valor_reconexion'  => 0.00,
                    'vigente_desde'     => '2026-01-01 00:00:00',
                    'vigente_hasta'     => '2026-12-31 23:59:59',
                    'estado'            => 'activa',
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ],

        );
        
    }
}
