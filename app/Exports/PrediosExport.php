<?php

namespace App\Exports;

use App\Models\Predios;
use Maatwebsite\Excel\Concerns\FromCollection;

class PrediosExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Predios::all();
    }
}
