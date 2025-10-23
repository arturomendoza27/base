<?php

namespace Database\Seeders;

use App\Models\Categorias_predios;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriasPrediosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
   
      
        Categorias_predios::insert([
            [
            'nombre' => 'Preferencial',
            'descripcion' => 'Tarifa preferencial'
            ],
            [
                'nombre' => 'Residencial', 
                'descripcion' => 'Tarifa residencial'
            ],
             [
                'nombre' => 'Comercial', 
                'descripcion' => 'Tarifa comercial'
            ],
        ]);
       
        
    }
}
