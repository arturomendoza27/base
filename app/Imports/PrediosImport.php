<?php

namespace App\Imports;

use App\Models\Barrios;
use App\Models\CategoriasPredios;
use App\Models\Predios;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PrediosImport implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    private $barrio;
    private $categoria;
    public function __construct()
    {
        $this->barrio = Barrios::pluck('id', 'nombre')->toArray();
        $this->categoria = CategoriasPredios::pluck('id', 'nombre')->toArray();
    }

    public function model(array $row) 
    {
   
     $existe = Predios::with('cliente')->where('cliente_id', $row['codigo_cliente'])
               ->orWhere('direccion_predio', $row['direccion'])
               ->orWhere('ruta', $row['ruta'])
               ->exists();
    if ($existe) {
        // Ignorar fila para evitar duplicados
        return null;
    }

        return new Predios([
            'cliente_id'     => strtoupper($row['codigo_cliente']),
            'matricula_predial'    => $row['matricula'],
            'direccion_predio'    =>  $row['direccion'],
            'barrio_id' => $this->barrio[$row['barrio']] ?? null,
            'ruta'    => $row['ruta'],
            'categoria_id'    => $row['categoria']
        ]);
    }
     public function batchSize(): int
    {
        return 1000;
    }
     public function chunkSize(): int
    {
        return 1000;
    }
}
