<?php

namespace App\Http\Controllers;

use App\Models\CategoriasPredios;
use App\Models\CiclosFacturacion;
use App\Models\Facturacion;
use App\Models\Pagos;
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

    public function show(string $id)
    {
        // $data = CiclosFacturacion::with([
        //     'facturas' => function ($q) {
        //         $q->where('estado', 'pagada')
        //           ->with('predio.cliente');
        //     }
        // ])->find($id);

// === Cargar ciclo y sus facturas ===
$ciclo = CiclosFacturacion::with('facturas')->findOrFail($id);

// === MÉTRICAS BASE ===
$numero_facturas_generadas = $ciclo->facturas->count();
$numero_facturas_pagadas   = $ciclo->facturas->where('estado', 'pagada')->count();
$numero_facturas_abonadas  = $ciclo->facturas->where('estado', 'abono')->count();

// === TOTAL FACTURADO (solo positivos)
$total_facturado = Facturacion::whereIn('id', $ciclo->facturas->pluck('id'))
    ->where('total_factura', '>', 0)
    ->sum('total_factura');

// === TOTAL RECAUDADO (desde pagos)
$idsFacturas = $ciclo->facturas->pluck('id');
$total_recaudado = Pagos::whereIn('factura_id', $idsFacturas)->sum('valor_pagado');

// === TOTAL ABONADO (valor pagado de facturas parcialmente pagadas)
$total_abonado = Pagos::whereIn('factura_id', $idsFacturas)
    ->whereHas('factura', fn($q) => $q->where('estado', 'abono'))
    ->sum('valor_pagado');

// === TOTAL PAGADAS (valor total de facturas con estado 'pagada')
$valor_pagadas = $ciclo->facturas
    ->where('estado', 'pagada')
    ->sum('total_factura');

// === TOTAL DE RECAUDOS ANTERIORES ===
$total_recaudos_anteriores = 0;

foreach ($ciclo->facturas as $factura) {
    if ($factura->total_factura < 0) {
        $saldo_anterior = $factura->saldo_anterior ?? 0;
        $saldo_actual   = $factura->saldo_actual ?? 0;
        $total_factura  = $factura->total_factura ?? 0;

        // Cálculo base
        $recaudo = $saldo_anterior + $total_factura - $saldo_actual;

        // Si el saldo actual es positivo (saldo a favor), lo usamos directamente
        if ($saldo_actual > 0) {
            $recaudo = $saldo_actual;
        }

        // Evitar negativos
        if ($recaudo < 0) {
            $recaudo = 0;
        }

        $total_recaudos_anteriores += $recaudo;
    }
}

// === DETECTAR PREDIOS SUSPENDIDOS ===
$prediosSuspendidos = collect();

foreach ($ciclo->facturas->where('estado', 'vencida') as $facturaActual) {
    $predioId = $facturaActual->predio_id;

    $facturaAnterior = Facturacion::where('predio_id', $predioId)
        ->where('id', '<', $facturaActual->id)
        ->orderByDesc('id')
        ->first();

    if ($facturaAnterior && $facturaAnterior->estado === 'vencida') {
        $prediosSuspendidos->push($predioId);
    }
}

$prediosSuspendidos = $prediosSuspendidos->unique();

// === FACTURAS SUSPENDIDAS EN ESTE CICLO ===
$facturasSuspendidas = $ciclo->facturas->whereIn('predio_id', $prediosSuspendidos);
$numero_suspendidas  = $facturasSuspendidas->count();
$valor_suspendidas   = $facturasSuspendidas->sum('total_factura');

// === FACTURAS VENCIDAS (excluyendo suspendidas)
$facturasVencidas = $ciclo->facturas
    ->where('estado', 'vencida')
    ->whereNotIn('predio_id', $prediosSuspendidos);

$numero_vencidas  = $facturasVencidas->count();
$valor_vencidas   = $facturasVencidas->sum('total_factura');

// === SALDO RESTANTE DE FACTURAS ABONADAS ===
$saldo_restante_abonadas = 0;

foreach ($ciclo->facturas->where('estado', 'abono') as $factura) {
    $pagado = Pagos::where('factura_id', $factura->id)->sum('valor_pagado');
    $saldo_restante = ($factura->total_factura ?? 0) - $pagado;

    if ($saldo_restante > 0) {
        $saldo_restante_abonadas += $saldo_restante;
    }
}

// === CARTERA VENCIDA ===
$cartera_vencida = $valor_vencidas + $valor_suspendidas + $saldo_restante_abonadas;

// === EVITAR NEGATIVOS ===
$limpiar = fn($v) => (is_numeric($v) && $v < 0) ? 0 : $v;

// === RESPUESTA FINAL ===
$response = [
    'ciclo'                     => $ciclo->mes . ' ' .$ciclo->anio,
    'numero_facturas'           => $numero_facturas_generadas,
    'total_facturado'           => $limpiar($total_facturado),

    'numero_pagadas'            => $numero_facturas_pagadas,
    'valor_pagadas'             => $limpiar($valor_pagadas),

    'numero_abonadas'           => $numero_facturas_abonadas,
    'valor_abonadas'            => $limpiar($total_abonado),

    'numero_vencidas'           => $numero_vencidas,
    'valor_vencidas'            => $limpiar($valor_vencidas),

    'numero_suspendidas'        => $numero_suspendidas,
    'valor_suspendidas'         => $limpiar($valor_suspendidas),

    'saldo_restante_abonadas'   => $limpiar($saldo_restante_abonadas),
    'cartera_vencida'           => $limpiar($cartera_vencida),

    'total_recaudado'           => $limpiar($total_recaudado),
    'total_recaudos_anteriores' => $limpiar($total_recaudos_anteriores),
];

 
        return Inertia::render('Ciclos/Show', [
            'datos' => $response,
        ]);
    }

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


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    { 
        $data = CiclosFacturacion::findOrFail($id);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
       $data = CiclosFacturacion::findOrFail($id);

          try {
            DB::beginTransaction();

            $data->update([
                'estado' => "cerrado",

            ]);

            DB::commit();

            return redirect()
                ->route('ciclos.index')
                ->with('success', 'Ciclo cerrado con exito.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Ha fallado el cierre del ciclo: ' . $e->getMessage());
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
