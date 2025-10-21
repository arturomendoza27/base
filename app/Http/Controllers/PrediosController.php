<?php

namespace App\Http\Controllers;

use App\Exports\PrediosExport;
use App\Imports\PrediosImport;
use App\Models\Clientes;
use App\Models\Predios;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class PrediosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = Predios::with('cliente')
        ->when($request->search, function ($query) use ($request) {
            $query->where('direccion_predio', 'like', "%{$request->search}%")
                ->orWhere('ruta', 'like', "%{$request->search}%");
        })    ->orWhereRelation('cliente', 'nombre',  'like', "%{$request->search}%")
              ->orWhereRelation('cliente', 'documento',  'like', "%{$request->search}%")

            ->orderBy('created_at', 'desc')
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Predios/Index', [
            'datos' => $data,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

        $data = Clientes::where('estado', 'activo')
            ->when($request->search, function ($query) use ($request) {
                $query->where('nombre', 'like', "%{$request->search}%")
                    ->orWhere('documento', 'like', "%{$request->search}%");
            })
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'documento']);

        return Inertia::render('Predios/Create', [
            'datos' => $data,
            'filters' => [
                'search' => $request->search,
            ],

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'cliente_id' => 'required|string|max:255',
            'matricula_predial' => 'required|string|max:255',
            'direccion_predio' => 'required|string|max:255|unique:predios,direccion_predio',
            'ruta' => 'required|string|max:255|unique:predios,ruta',
        ]);


        try {
            DB::beginTransaction();


            $datos = Predios::create([
                'cliente_id' => $validated['cliente_id'],
                'matricula_predial' => $validated['matricula_predial'],
                'direccion_predio' => $validated['direccion_predio'],
                'ruta' => $validated['ruta'],
            ]);

            DB::commit();

            return redirect()
                ->route('predios.index')
                ->with('success', 'Predio creado con Exito.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Hafallado en la creación del Predio: ' . $e->getMessage());
        }
    }
    
    public function export() 
    {
        return Excel::download(new PrediosExport, 'predios.xlsx');
    }
    
    public function importar(Request $request)
    {

        $file = $request->file('archivo');
   
        Excel::import(new PrediosImport, $file);

        return redirect()
                ->route('predios.index')
                ->with('success', 'Predios importados con Exito.');
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Predios::with('cliente')->findOrFail($id);

        return Inertia::render('Predios/Show', [
            'datos' => $data,
        ]); 
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request,  string $id)
    {
        $data = Predios::with('cliente')->findOrFail($id);

         $clientes = Clientes::where('estado', 'activo')
            ->when($request->search, function ($query) use ($request) {
                $query->where('nombre', 'like', "%{$request->search}%")
                    ->orWhere('documento', 'like', "%{$request->search}%");
            })
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'documento']);

        return Inertia::render('Predios/Edit', [
            'datos' => $data,
            'clientes' => $clientes,
             'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = Predios::findOrFail($id);

        $validated = $request->validate([

            'cliente_id' => 'required|integer|max:255',
            'matricula' => 'required|string|max:255',
            'direccion' => 'required|string|max:255|unique:predios,direccion_predio,'. $data->id,
            'ruta' => 'required|string|max:255|unique:predios,ruta,'. $data->id,
            'estado' => 'required'
        ]);

        try {
            DB::beginTransaction();

            $data->update([
                'cliente_id' => $validated['cliente_id'],
                'direccion_predio' => $validated['direccion'],
                'matricula_predial' => $validated['matricula'],
                'ruta' => $validated['ruta'],
                'estado_servicio' => $validated['estado'] ?? $data->estado,
            ]);

            DB::commit();

            return redirect()
                ->route('predios.index')
                ->with('success', 'Predio actualizado con exito.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Ha fallado la actualización del predio: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = Predios::findOrFail($id);

        try {
            DB::beginTransaction();

            $data->delete();

            DB::commit();

            return redirect()
                ->route('predios.index')
                ->with('success', 'Tarifa borrada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', 'Fallo la eliminacion de la tarifa: ' . $e->getMessage());
        }
    }
}
