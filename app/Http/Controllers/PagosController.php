<?php

namespace App\Http\Controllers;

use App\Models\CiclosFacturacion;
use App\Models\Facturacion;
use App\Models\Pagos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PagosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $ciclo = CiclosFacturacion::with('facturas.predio.cliente')
            ->latest('created_at')
            ->first();

        $data = Facturacion::conCicloAbierto()->with('predio.cliente', 'predio.categoria', 'ciclo')

            ->when($request->search, function ($query) use ($request) {
                $query->where('id', 'like', "%{$request->search}%")
                    ->orWhere('total_factura', 'like', "%{$request->search}%")
                    ->orWhereRelation('predio.cliente', 'nombre', 'like', "%{$request->search}%");
            })->where('ciclo_id', $ciclo->id)
            ->orderByDesc('fecha_emision')
            ->paginate(1000)
            ->withQueryString();
        return Inertia::render('Caja/Index', [
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

        //eviar los datos de facturacion 
        $ciclo = CiclosFacturacion::with('facturas.predio.cliente')
            ->latest('created_at')
            ->first();

        $data = Facturacion::with('predio.cliente', 'ciclo')

            ->when($request->search, function ($query) use ($request) {
                $query->where('id', 'like', "%{$request->search}%")
                    ->orWhere('total_factura', 'like', "%{$request->search}%")
                    ->orWhereRelation('predio.cliente', 'nombre', 'like', "%{$request->search}%");
            })->where('ciclo_id', $ciclo->id)
            ->orderByDesc('fecha_emision')
            ->paginate(5)
            ->withQueryString();


        return Inertia::render('Caja/Index', [
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

        $factura = Facturacion::conCicloAbierto()->find($request->factura_id);
        

        if (!$factura) {
            return redirect()
                ->route('pagos.index')
                ->with('error', 'No se puede realizar el pago, el cliclo se encuantra cerrado, debe generar una nueva factura');
        }



        $saldo = $factura->total_factura - $request->valor_pagado;

        $validated = $request->validate([
            'factura_id' => 'required|integer|unique:pagos,factura_id',
            'valor_pagado' => 'required|integer',
            'medio_pago' => 'required|string|max:255|',
            'recibo_banco' => 'nullable|string|string|max:50',
            'recibo_numero' => 'nullable|string|max:50',
            'recibo_fecha' => 'nullable|date',
        ], [
            'factura_id.unique' => 'El pago de la factura Número :input ya fue registrado y no se puede realizar otro pago.',
        ]);

        try {

            DB::beginTransaction();

            $pagos = Pagos::create([
                'factura_id' => $validated['factura_id'],
                'valor_pagado' => $validated['valor_pagado'],
                'saldo_restante' => $saldo,
                'medio_pago' => $validated['medio_pago'],
                'recibo_banco' => $validated['recibo_banco'] ?? null,
                'recibo_numero' => $validated['recibo_numero'] ?? null,
                'recibo_fecha' => $validated['recibo_fecha'] ?? null,

            ]);

            //actualizar la tabla facturacion el estado validar el tipo de estado
            if ($saldo <= 0) {
                $factura->update(['estado' => 'pagada']);
            } else {
                $factura->update(['estado' => 'abono']);
            }



            DB::commit();
           return Inertia::render('Caja/Index', [
            'datos' => $pagos,
            'messages' => [
                'title' => 'Éxito',
                'message' => 'Pago registrado correctamente',
                'type' => 'success'
            ]
        ]);
            // return redirect()->route('caja.index')->with([
            //     'success',
            //     'Pago registrado correctamente',
            //     'pago' => $pagos,
            // ]);
            // return redirect()
            //     ->route('caja.index')
            //     ->with('success', 'Pago recibido con Exito.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Hafallado el registro del pago: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        //
    }
}
