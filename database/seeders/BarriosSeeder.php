<?php

namespace Database\Seeders;

use App\Models\Barrios;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BarriosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $BarrioVillaGraciela = Barrios::firstOrCreate(
            ['nombre' => 'VILLA GRACIELA'],
            ['abreviatura' => 'VILL-GRA']
        );

        $BarrioLomitasTrapiches = Barrios::firstOrCreate(
            ['nombre' => 'LOMITAS DE TRAPICHES'],
            ['abreviatura' => 'LOM-TRAP']
        );
    }
}
