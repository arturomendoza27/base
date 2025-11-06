<?php

namespace Database\Seeders;

use App\Models\CategoriasPredios;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriasPrediosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $now = now();
        CategoriasPredios::insert([
            [
                'nombre' => 'Preferencial',
                'descripcion' => 'Tarifa preferencial',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nombre' => 'Residencial',
                'descripcion' => 'Tarifa residencial',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nombre' => 'Comercial',
                'descripcion' => 'Tarifa comercial',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
