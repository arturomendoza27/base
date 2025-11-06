<?php

namespace Database\Seeders;

use App\Models\CiclosFacturacion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CicloSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ciclo = CiclosFacturacion::firstOrCreate(
            ['mes' => 'enero'],
            [   
                'anio' => '2025',
                'fecha_inicio' => '2025-01-01 13:05:13',
                'fecha_fin' => '2025-01-30 13:05:13',
                'estado' => 'cerrado',
            ]

        );
    }
}
