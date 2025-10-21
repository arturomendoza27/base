<?php

namespace App\Http\Controllers;

use App\Models\Tarifas;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;


class TarifasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = Tarifas::when($request->search, function ($query) use ($request) {
            $query->where('nombre', 'like', "%{$request->search}%")
                ->orWhere('estado', 'like', "%{$request->search}%");
        })
            ->orderBy('created_at', 'desc')
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Tarifas/Index', [
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
        $data = Tarifas::select('id', 'nombre')
            ->orderBy('nombre')
            ->get()
            ->pluck('nombre');

        return Inertia::render('Tarifas/Create', [
            'datos' => $data,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:tarifas,nombre',
            'valor' => 'required|numeric|between:-9999999999.99,9999999999.99|regex:/^-?\d{1,10}(\.\d{1,2})?$/|:tarifas,valor',
        ]);

        try {
            DB::beginTransaction();

            $datos = Tarifas::create([
                'nombre' => ucfirst(strtolower($validated['nombre'])),
                'valor' => $validated['valor'],
            ]);

            DB::commit();

            return redirect()
                ->route('tarifas.index')
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
         $data = Tarifas::findOrFail($id);

        return Inertia::render('Tarifas/Show', [
            'datos' => $data,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $data = Tarifas::findOrFail($id);
        return Inertia::render('Tarifas/Edit', [
            'datos' => $data
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = Tarifas::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:tarifas,nombre,' . $data->id,
           'valor' => 'required|numeric|between:-9999999999.99,9999999999.99|regex:/^-?\d{1,10}(\.\d{1,2})?$/|:tarifas,valor',
            'estado' => 'required|in:activa,inactiva',


        ]);

        try {
            DB::beginTransaction();

            $data->update([
                'nombre' => ucfirst(strtolower($validated['nombre'])),
                'valor' => $validated['valor'],
                'estado' => $validated['estado'] ?? $data->estado,
            ]);

            DB::commit();

            return redirect()
                ->route('tarifas.index')
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
        $data = Tarifas::findOrFail($id);

        try {
            DB::beginTransaction();

            $data->delete();

            DB::commit();

            return redirect()
                ->route('tarifas.index')
                ->with('success', 'Tarifa borrada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', 'Fallo la eliminacion de la tarifa: ' . $e->getMessage());
        }
    }
}
