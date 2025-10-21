<?php

namespace App\Imports;

use App\Models\Clientes;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ClientesImport implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row) 
    {
     $existe = Clientes::where('nombre', $row['nombres'])
               ->orWhere('documento', $row['cedula'])
               ->orWhere('email', $row['email'])
               ->exists();

    if ($existe) {
        // Ignorar fila para evitar duplicados
        return null;
    }

        return new Clientes([
            'nombre'     => strtoupper($row['nombres']),
            'email'    => empty(strtolower($row['email'])) ? null :strtolower($row['email']),
            'documento'    =>  empty($row['cedula']) ? null : $row['cedula'],
            'telefono'    => $row['celular'] ?? null,
            'direccion'    => $row['direccion'] ?? null,
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
