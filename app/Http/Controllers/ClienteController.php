<?php

namespace App\Http\Controllers;

use App\Exports\ClientesExport;
use App\Imports\ClientesImport;
use App\Models\Clientes;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ClienteController extends Controller
{
    public function index(Request $request)
    {
        $clientes = Clientes::when($request->search, function ($query) use ($request) {
            $query->where('nombre', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        })
            ->orderBy('created_at', 'desc')
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes,
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
        $clientes = Clientes::select('id', 'nombre')
            ->orderBy('nombre')
            ->get()
            ->pluck('nombre');

        return Inertia::render('Clientes/Create', [
            'clientes' => $clientes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:clientes,nombre',
            'documento' => 'nullable|string|max:10|unique:clientes,documento',
            'email' => 'nullable|string|email|max:255|unique:clientes,email',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            $clientes = Clientes::create([
                'nombre' => strtoupper($validated['nombre']),
                'email' => strtolower($validated['email']) ?? null,
                'documento' => $validated['documento'] ?? null,
                'telefono' => $validated['telefono'] ?? null,
                'direccion' => $validated['direccion'] ?? null,
            ]);

            DB::commit();

            return redirect()
                ->route('clientes.index')
                ->with('success', 'Cliente creado con Exito.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Hafallado en la creación del cliente: ' . $e->getMessage());
        }
    }

    public function export() 
    {
        return Excel::download(new ClientesExport, 'clientes.xlsx');
    }
    
    public function importar(Request $request)
    {

        $file = $request->file('archivo');
   
        Excel::import(new ClientesImport, $file);

        return redirect()
                ->route('clientes.index')
                ->with('success', 'Clientes importados con Exito.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $cliente = Clientes::findOrFail($id);

        return Inertia::render('Clientes/Show', [
            'cliente' => $cliente,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $cliente = Clientes::findOrFail($id);



        return Inertia::render('Clientes/Edit', [
            'cliente' => $cliente
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $clientes = Clientes::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:clientes,nombre,' . $clientes->id,
            'documento' => 'nullable|string|max:10|unique:clientes,documento,' . $clientes->id,
            'email' => 'nullable|string|email|max:255|unique:clientes,email,' . $clientes->id,
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string|max:255',
            'estado' => 'required|in:activo,inactivo',


        ]);

        try {
            DB::beginTransaction();

            $clientes->update([
                'nombre' => strtoupper($validated['nombre']),
                'email' => strtolower($validated['email']) ?? null,
                'documento' => $validated['documento'] ?? null,
                'telefono' => $validated['telefono'] ?? null,
                'direccion' => $validated['direccion'] ?? null,
                'estado' => $validated['estado'] ?? $clientes->estado,
            ]);

            DB::commit();

            return redirect()
                ->route('clientes.index')
                ->with('success', 'Cliente actualizado con exito.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Ha fallado la actualización del cliente: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $clientes = Clientes::findOrFail($id);

        try {
            DB::beginTransaction();

            $clientes->delete();

            DB::commit();

            return redirect()
                ->route('clientes.index')
                ->with('success', 'Cliente borrado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', 'Fallo la eliminacion del Cliente: ' . $e->getMessage());
        }
    }
}
