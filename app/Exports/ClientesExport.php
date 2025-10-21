<?php

namespace App\Exports;

use App\Models\Clientes;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ClientesExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Clientes::select('id', 'nombre', 'documento', 'telefono', 'email', 'direccion', 'estado')->get();
    }

    public function headings(): array
    {
        return [
            'Id',
            'Nombre',
            'Cedula',
            'Celular',
            'Email',            
            'Direccion',
            'Estado'
        ];
    }
}
