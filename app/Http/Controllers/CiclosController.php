<?php

namespace App\Http\Controllers;

use App\Models\CategoriasPredios;
use App\Models\CiclosFacturacion;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;


class CiclosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = CiclosFacturacion::when($request->search, function ($query) use ($request) {
            $query->where('anio', 'like', "%{$request->search}%")
            ->orWhere('mes', 'like', "%{$request->search}%")
                ->orWhere('estado', 'like', "%{$request->search}%");
        })
            ->orderBy('created_at', 'desc')
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Ciclos/Index', [
            'datos' => $data,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $data = CategoriasPredios::select('id', 'nombre')
            ->orderBy('id')
            ->get();

        return Inertia::render('Ciclos/Create', [
            'datos' => $data,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
           'categoria_id'   => 'required|exists:categorias_predios,id',
            'nombre'         => 'required|string|max:100',
            'valor'          => 'required|numeric|between:-9999999999.99,9999999999.99|regex:/^-?\d{1,10}(\.\d{1,2})?$/|:tarifas,valor',
            'valor_conexion'          => 'required|numeric|between:-9999999999.99,9999999999.99|regex:/^-?\d{1,10}(\.\d{1,2})?$/|:tarifas,valor_conexion',
            'valor_reconexion'          => 'required|numeric|between:-9999999999.99,9999999999.99|regex:/^-?\d{1,10}(\.\d{1,2})?$/|:tarifas,valor_reconexion',
            'vigente_desde'  => 'required|date',
        ]);

        try {
            // DB::beginTransaction();

            // $datos = CiclosFacturacion::create([
            //     'categoria_id' =>$validated['categoria_id'],
            //     'nombre' => ucfirst(strtolower($validated['nombre'])),
            //     'valor' => $validated['valor'],
            //     'valor_conexion' => $validated['valor_conexion'],
            //     'valor_reconexion' => $validated['valor_reconexion'],
            //     'vigente_desde' => $validated['vigente_desde'],
            // ]);

            // DB::commit();


          CiclosFacturacion::crearNuevaTarifa($validated);

            return redirect()
                ->route('ciclos.index')
                ->with('success', 'Tarifa creada con Exito.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Hafallado en la creación de la Tarifa: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $data = CiclosFacturacion::findOrFail($id);

        return Inertia::render('Ciclos/Show', [
            'datos' => $data,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $data = CiclosFacturacion::findOrFail($id);
        return Inertia::render('Ciclos/Edit', [
            'datos' => $data
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = CiclosFacturacion::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255,' . $data->id,
           'valor' => 'required|numeric|between:-9999999999.99,9999999999.99|regex:/^-?\d{1,10}(\.\d{1,2})?$/|:tarifas,valor',
            'valor_conexion' => 'required|numeric|between:-9999999999.99,9999999999.99|regex:/^-?\d{1,10}(\.\d{1,2})?$/|:tarifas,valor_conexion',
            'valor_reconexion' => 'required|numeric|between:-9999999999.99,9999999999.99|regex:/^-?\d{1,10}(\.\d{1,2})?$/|:tarifas,valor_reconexion',
            // 'estado' => 'required|in:activa,inactiva',


        ]);

        try {
            DB::beginTransaction();

            $data->update([
                'nombre' => ucfirst(strtolower($validated['nombre'])),
                'valor' => $validated['valor'],
                'valor_conexion' => $validated['valor_conexion'],
                'valor_reconexion' => $validated['valor_reconexion'],
                // 'estado' => $validated['estado'] ?? $data->estado,
            ]);

            DB::commit();

            return redirect()
                ->route('ciclos.index')
                ->with('success', 'Tarifa actualizada con exito.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Ha fallado la actualización de la tarifa: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = CiclosFacturacion::inactiva()->findOrFail($id);

        try {
            DB::beginTransaction();

            $data->delete();

            DB::commit();

            return redirect()
                ->route('ciclos.index')
                ->with('success', 'Tarifa borrada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', 'Fallo la eliminacion de la tarifa: ' . $e->getMessage());
        }
    }
}
