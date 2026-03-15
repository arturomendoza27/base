<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\CiclosFacturacion;
use Picqer\Barcode\BarcodeGeneratorPNG;
use App\Models\Facturacion;
use App\Models\Pagos;
use App\Models\Predios;
use App\Models\Tarifas;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FacturacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // cargamos facturas por ciclo
        // $data = CiclosFacturacion::with('facturas.predio.cliente')
        //     ->when($request->search, function ($query) use ($request) {
        //         $query->where('facturas', 'id', 'like', "%{$request->search}%");
        //     })
        //     ->orWhereRelation('facturas', 'total_factura', 'like', "%{$request->search}%")
        //     ->orWhereRelation('facturas.predio.cliente', 'nombre', 'like', "%{$request->search}%") // <-- búsqueda por nombre del cliente
        //     ->orderByDesc('anio')
        //     ->orderByDesc('mes')
        //     ->paginate(5)
        //     ->withQueryString();


        // return Inertia::render('Facturacion/Index', [
        //     'datos' => $data,
        //     'filters' => [
        //         'search' => $request->search,
        //     ],
        // ]);
        $ciclo = CiclosFacturacion::with('facturas.predio.cliente')
            ->latest('created_at')
            ->first();
        if (!$ciclo) {
            return redirect()
                ->route('facturacion')
                ->with('error', 'No existe un ciclo de facturación creado');
        }
        $data = Facturacion::conCicloAbierto()->with('predio.cliente', 'ciclo')

            ->when($request->search, function ($query) use ($request) {
                $query->where('id', 'like', "%{$request->search}%")
                    ->orWhere('total_factura', 'like', "%{$request->search}%")
                    ->orWhereRelation('predio.cliente', 'nombre', 'like', "%{$request->search}%");
            })->where('ciclo_id', $ciclo->id)
            ->orderByDesc('fecha_emision')
            ->paginate(5)
            ->withQueryString();

        // dd( $ciclo);
        return Inertia::render('Facturacion/Index', [
            'datos' => $data,
            'filters' => [
                'search' => $request->search,
            ],
        ]);

        // $filter = Facturacion::with('cliente', 'predio', 'ciclo')
        //     ->when($request->search, function ($query) use ($request) {
        //         $query->where('direccion_predio', 'like', "%{$request->search}%");
        //     })->orWhereRelation('cliente', 'nombre',  'like', "%{$request->search}%")
        //     ->orWhereRelation('cliente', 'documento',  'like', "%{$request->search}%")

        //     ->orderBy('created_at', 'desc')
        //     ->latest()
        //     ->paginate(5)
        //     ->withQueryString();

        // return Inertia::render('Facturacion/Index', [
        //     'datos' => $data[0],
        //     'filters' => [
        //         'search' => $request->search,
        //     ],
        // ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Cargar datos necesarios para el formulario de creación de factura
        $clientes = \App\Models\Clientes::where('estado', 'activo')->get();
        $predios = \App\Models\Predios::with('categoria', 'cliente')->get();
        $ciclos = \App\Models\CiclosFacturacion::where('estado', 'abierto')->get();

        // Calcular saldo anterior para cada predio
        $prediosConSaldo = $predios->map(function ($predio) {
            $saldoAnterior = 0;
            $ultimaFactura = Facturacion::where('predio_id', $predio->id)->latest('id')->first();
            
            if ($ultimaFactura) {
                $pagosRealizados = Pagos::where('factura_id', $ultimaFactura->id)->sum('valor_pagado');
                $saldoPendiente = floatval($ultimaFactura->total_factura) - floatval($pagosRealizados);
                $saldoAnterior = $saldoPendiente;
            }
            
            // Agregar saldo anterior al objeto predio
            $predio->saldo_anterior = $saldoAnterior;
            return $predio;
        });

        return Inertia::render('Facturacion/Create', [
            'clientes' => $clientes,
            'predios' => $prediosConSaldo,
            'ciclos' => $ciclos,
        ]);
    }

    /**
     * Facturacion masiva .
     */
    public function facturar(Request $request)
    {
        return Inertia::render('Facturacion/Facturar');
    }
    public function Masiva(Request $request)
    {

        DB::beginTransaction();

        try {

            $fechaActual = Carbon::now();
            $fechaAnterior = Carbon::now()->subMonth();
            $mes = $fechaAnterior->translatedFormat('F');
            $anio = $fechaAnterior->year;

            // === 1️⃣ Verificar si el ciclo anterior está cerrado ===
            $ultimoCiclo = CiclosFacturacion::latest('id')->first();

            if ($ultimoCiclo && $ultimoCiclo->estado !== 'cerrado') {
                return redirect()
                    ->route('facturacion.index')
                    ->with('error', "El ciclo anterior aún no está cerrado. No puede iniciar un nuevo proceso de facturación. ");
            }

            // === 2️⃣ Verificar que no exista ya un ciclo para el mes actual ===
            $existeCiclo = CiclosFacturacion::where('anio', $anio)
                ->where('mes',  $mes)
                ->exists();

            if ($existeCiclo) {
                return redirect()
                    ->route('facturacion.index')
                    ->with('success', "Ya existe un ciclo de facturación para este mes. ");
            }

            // === 3️⃣ Crear el nuevo ciclo ===
            $nuevoCiclo = CiclosFacturacion::create([
                'anio' => $anio,
                'mes' => $mes,
                'estado' => 'abierto',
                'fecha_inicio' => Carbon::now()->startOfMonth(),
                'fecha_fin' => Carbon::now()->endOfMonth(),
            ]);


            // === 4️⃣ Iniciar proceso de facturación ===
            $predios = Predios::with('categoria', 'cliente')->get();
            $contadorFacturas = 0;
            activity()->disableLogging();
            foreach ($predios as $predio) {
                // Validar si el predio está desconectado o suspendido - no generar factura
                if ($predio->estado_servicio && in_array($predio->estado_servicio, ['desconectado', 'suspendido'])) {
                    continue;
                }
                
                // Buscar la tarifa vigente según la categoría del predio
                $tarifa = Tarifas::where('categoria_id', $predio->categoria_id)
                    ->where('estado', 'activa')
                    ->whereDate('vigente_desde', '<=', $fechaActual)
                    ->where(function ($query) use ($fechaActual) {
                        $query->whereNull('vigente_hasta')
                            ->orWhereDate('vigente_hasta', '>=', $fechaActual);
                    })
                    ->first();
                // Si no hay tarifa vigente, saltamos el predio 
                if (!$tarifa) continue;
                // Verificar si las dos últimas facturas están vencidas
                $ultimasDos = Facturacion::where('predio_id', $predio->id)
                    ->orderByDesc('fecha_emision')
                    ->take(2)
                    ->get();

                // Solo aplicar si existen al menos 2 facturas
                if ($ultimasDos->count() === 2) {
                    $ambasVencidas = $ultimasDos->every(fn($f) => $f->estado === 'vencida');
                    if ($ambasVencidas) {
                        // Marcar predio como suspendido si manejas ese estado
                        $predio->update(['estado_servicio' => 'suspendido']);

                        // Saltar este predio, no generar factura
                        continue;
                    }
                }
                $ultimaFactura = Facturacion::where('predio_id', $predio->id)
                    ->latest('id')
                    ->first();
                $saldoAnterior = 0;
                if ($ultimaFactura) {
                    // Sumar todos los abonos o pagos parciales
                    $pagosRealizados = Pagos::where('factura_id', $ultimaFactura->id)->sum('valor_pagado');
                    $saldoPendiente = floatval($ultimaFactura->total_factura) - floatval($pagosRealizados);

                    // Si todavía hay saldo pendiente, lo arrastramos al siguiente ciclo
                    $saldoAnterior = $saldoAnterior = $saldoPendiente;

                    // (Opcional) Si ya se pagó todo, marcar como pagada
                    if ($saldoPendiente <= 0) {
                        $ultimaFactura->update(['estado' => 'pagada']);
                    }
                }


                // Valores base
                $saldoActual     = floatval($tarifa->valor);
                $saldoConexion   = 0;
                $saldoReconexion = 0;
                $concepto        = 'Consumo mensual de agua';
                $totalFactura = $saldoAnterior + $tarifa->valor;


                //cambia estado pagada en caso que venga en 0 el total para los que pagan por adelantado


                // Crear factura base (ejemplo: sin cálculo de consumo aún)
                $facturacion = Facturacion::create([
                    'ciclo_id' => $nuevoCiclo->id,
                    'predio_id' => $predio->id,
                    'cliente_id' => $predio->cliente_id,
                    'categoria_id' => $predio->categoria_id,
                    'tarifa_id' => $tarifa->id,
                    'fecha_emision' => Carbon::now()->startOfMonth(),
                    'fecha_vencimiento' => $fechaActual->copy()->addDays(15),
                    'concepto' => $concepto,
                    'saldo_anterior' => $saldoAnterior, //operacion para obetener este saldo en facturas
                    'saldo_actual' => $saldoActual,
                    'valor_conexion' => $saldoConexion,
                    'valor_reconexion' => $saldoReconexion,
                    'total_factura' => $totalFactura,
                    'estado' => 'pendiente', // 👈 correcto estado por defecto
                    'generada_automaticamente' => true,
                    'observaciones' => $request->observaciones,
                ]);

                if ($totalFactura <= 0) {

                    Pagos::create([
                        'factura_id' => $facturacion->id,
                        'valor_pagado' => 0, // valor del crédito o pago aplicado
                        'saldo_restante' => $totalFactura,
                        'fecha_pago' => now(),
                        'medio_pago' => 'Saldo a favor del usuario2',
                        'recibo_numero' => 'Pago automático por saldo a favor de facturas anteriores',
                    ]);

                    $facturacion->update(['estado' => 'pagada']);
                }

                $contadorFacturas++;
            }
            // Se vuelve a activar el logging automático
            activity()->enableLogging();

            // Registrar un solo log consolidado
            activity('facturacion_masiva')
                ->performedOn($nuevoCiclo)
                ->causedBy(Auth::user())
                ->withProperties([
                    'total_facturas' => $contadorFacturas,
                    'desde' => Carbon::now()->startOfMonth(),
                    'hasta' => $fechaActual->copy()->addDays(15),
                ])
                ->log("Facturación masiva generada: {$contadorFacturas} facturas para el ciclo {$nuevoCiclo} {$nuevoCiclo->mes} {$nuevoCiclo->anio}");
            DB::commit();


            return redirect()
                ->route('facturacion.index')
                ->with('success', "$contadorFacturas Facturas generadas exitosamente para el mes de $nuevoCiclo->mes de $nuevoCiclo->anio ");

            // return response()->json([
            //     'message' => "Facturación generada exitosamente para {$contadorFacturas} predios.",
            //     'ciclo' => $nuevoCiclo
            // ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->route('facturacion.index')
                ->with('error', "Error al generar la facturación" .  $e);
            // return response()->json([
            //     'error' => 'Error al generar la facturación: ' . $e->getMessage()
            // ], 500);
        }
    }
    /**
     * Final Facturacion masiva .
     */

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // Validar datos requeridos
            $validated = $request->validate([
                'predio_id' => 'required|exists:predios,id',
                'ciclo_id' => 'required|exists:ciclos_facturacion,id',
                'cliente_id' => 'required|exists:clientes,id',
                'fecha_emision' => 'required|date',
                'fecha_vencimiento' => 'required|date',
                'concepto' => 'required|string',
                'saldo_anterior' => 'nullable|numeric|min:0',
                'saldo_actual' => 'required|numeric|min:0',
                'saldo_conexion' => 'nullable|numeric|min:0',
                'saldo_reconexion' => 'nullable|numeric|min:0',
                'total_factura' => 'required|numeric|min:0',
                'estado' => 'required|in:pendiente,pagada,vencida,anulada',
                'observaciones' => 'nullable|string',
            ]);

            // Obtener el predio
            $predio = Predios::with('categoria', 'cliente')->find($request->predio_id);
            
            if (!$predio) {
                return redirect()
                    ->route('facturacion.create')
                    ->with('error', 'El predio no existe.');
            }

            // Validar si el predio está desconectado o suspendido - no generar factura
            // if ($predio->estado_servicio && in_array($predio->estado_servicio, ['desconectado', 'suspendido'])) {
            //     return redirect()
            //         ->route('facturacion.create')
            //         ->with('error', "No se puede generar factura para un predio con estado: {$predio->estado_servicio}.");
            // }

            // Obtener la tarifa vigente según la categoría del predio
            $fechaActual = Carbon::now();
            $tarifa = Tarifas::where('categoria_id', $predio->categoria_id)
                ->where('estado', 'activa')
                ->whereDate('vigente_desde', '<=', $fechaActual)
                ->where(function ($query) use ($fechaActual) {
                    $query->whereNull('vigente_hasta')
                        ->orWhereDate('vigente_hasta', '>=', $fechaActual);
                })
                ->first();

            if (!$tarifa) {
                // Obtener información de la categoría para el mensaje de error
                $categoriaNombre = $predio->categoria ? $predio->categoria->nombre : 'desconocida';
                return redirect()
                    ->route('facturacion.create')
                    ->withErrors([
                        'tarifa' => "No hay una tarifa vigente para la categoría '{$categoriaNombre}' del predio seleccionado. Por favor, cree una tarifa para esta categoría antes de generar la factura."
                    ]);
            }

            // Verificar si el ciclo existe y está abierto
            $ciclo = CiclosFacturacion::find($request->ciclo_id);
            if (!$ciclo || $ciclo->estado !== 'abierto') {
                return redirect()
                    ->route('facturacion.create')
                    ->with('error', 'El ciclo de facturación no está disponible o no está abierto.');
            }

            // Calcular saldo anterior automáticamente (última factura pendiente)
            $saldoAnterior = 0;
            $ultimaFactura = Facturacion::where('predio_id', $predio->id)->latest('id')->first();
            if ($ultimaFactura) {
                $pagosRealizados = Pagos::where('factura_id', $ultimaFactura->id)->sum('valor_pagado');
                $saldoPendiente = floatval($ultimaFactura->total_factura) - floatval($pagosRealizados);
                $saldoAnterior = $saldoPendiente;
            }

            // Crear la factura
            $facturacion = Facturacion::create([
                'ciclo_id' => $request->ciclo_id,
                'predio_id' => $request->predio_id,
                'cliente_id' => $request->cliente_id,
                'categoria_id' => $predio->categoria_id,
                'tarifa_id' => $tarifa->id,
                'fecha_emision' => $request->fecha_emision,
                'fecha_vencimiento' => $request->fecha_vencimiento,
                'concepto' => $request->concepto,
                'saldo_anterior' => $saldoAnterior, // Usar saldo calculado automáticamente
                'saldo_actual' => $request->saldo_actual,
                'saldo_conexion' => $request->saldo_conexion,
                'saldo_reconexion' => $request->saldo_reconexion,
                'total_factura' => $request->total_factura,
                'estado' => $request->estado,
                'generada_automaticamente' => false,
                'observaciones' => $request->observaciones,
            ]);

            // Si la factura está marcada como pagada y el total es 0 o positivo, crear un pago automático
            if ($request->estado === 'pagada' && $request->total_factura <= 0) {
                Pagos::create([
                    'factura_id' => $facturacion->id,
                    'valor_pagado' => 0,
                    'saldo_restante' => $request->total_factura,
                    'fecha_pago' => now(),
                    'medio_pago' => 'Saldo a favor del usuario',
                    'recibo_numero' => 'Pago automático por saldo a favor',
                ]);
                $predio->update(['estado_servicio' => 'activo']);

            }

            DB::commit();

            // Registrar actividad
            activity('facturacion_manual')
                ->performedOn($facturacion)
                ->causedBy(Auth::user())
                ->withProperties([
                    'predio_id' => $predio->id,
                    'ciclo_id' => $ciclo->id,
                    'total_factura' => $request->total_factura,
                ])
                ->log("Factura manual creada para el predio {$predio->matricula_predial}");

            return redirect()
                ->route('facturacion.index')
                ->with('success', 'Factura creada exitosamente.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return redirect()
                ->route('facturacion.create')
                ->withErrors($e->validator)
                ->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->route('facturacion.create')
                ->with('error', 'Error al crear la factura: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Facturacion $facturacion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Facturacion $facturacion)
    {
        // Cargar la factura con sus relaciones
        $facturacion->load(['predio.cliente', 'predio.categoria', 'predio.barrio', 'ciclo']);
        
        // Cargar datos necesarios para el formulario
        $clientes = \App\Models\Clientes::where('estado', 'activo')->get();
        $predios = \App\Models\Predios::with('categoria', 'cliente', 'barrio')->get();
        $ciclos = \App\Models\CiclosFacturacion::all();

        return Inertia::render('Facturacion/Edit', [
            'factura' => $facturacion,
            'clientes' => $clientes,
            'predios' => $predios,
            'ciclos' => $ciclos,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Facturacion $facturacion)
    {
        DB::beginTransaction();

        try {
            // Validar datos requeridos
            $validated = $request->validate([
                'predio_id' => 'required|exists:predios,id',
                'ciclo_id' => 'required|exists:ciclos_facturacion,id',
                'cliente_id' => 'required|exists:clientes,id',
                'fecha_emision' => 'required|date',
                'fecha_vencimiento' => 'required|date',
                'concepto' => 'required|string',
                'saldo_anterior' => 'nullable|numeric|min:0',
                'saldo_actual' => 'required|numeric|min:0',
                'saldo_conexion' => 'nullable|numeric|min:0',
                'saldo_reconexion' => 'nullable|numeric|min:0',
                'total_factura' => 'required|numeric',
                'estado' => 'required|in:pendiente,pagada,vencida,anulada,abono',
                'observaciones' => 'nullable|string',
            ]);

            // Obtener el predio
            $predio = Predios::with('categoria')->find($request->predio_id);
            
            if (!$predio) {
                return redirect()
                    ->route('facturacion.edit', $facturacion->id)
                    ->with('error', 'El predio no existe.');
            }

            // Obtener la tarifa vigente según la categoría del predio
            $fechaActual = Carbon::now();
            $tarifa = Tarifas::where('categoria_id', $predio->categoria_id)
                ->where('estado', 'activa')
                ->whereDate('vigente_desde', '<=', $fechaActual)
                ->where(function ($query) use ($fechaActual) {
                    $query->whereNull('vigente_hasta')
                        ->orWhereDate('vigente_hasta', '>=', $fechaActual);
                })
                ->first();

            // Actualizar la factura
            $facturacion->update([
                'ciclo_id' => $request->ciclo_id,
                'predio_id' => $request->predio_id,
                'cliente_id' => $request->cliente_id,
                'categoria_id' => $predio->categoria_id,
                'tarifa_id' => $tarifa ? $tarifa->id : $facturacion->tarifa_id,
                'fecha_emision' => $request->fecha_emision,
                'fecha_vencimiento' => $request->fecha_vencimiento,
                'concepto' => $request->concepto,
                'saldo_anterior' => $request->saldo_anterior ?? 0,
                'saldo_actual' => $request->saldo_actual,
                'saldo_conexion' => $request->saldo_conexion ?? 0,
                'saldo_reconexion' => $request->saldo_reconexion ?? 0,
                'total_factura' => $request->total_factura,
                'estado' => $request->estado,
                'observaciones' => $request->observaciones,
            ]);

            // Si el estado cambia a pagada, actualizar el estado del servicio del predio
            if ($request->estado === 'pagada') {
                $predio->update(['estado_servicio' => 'activo']);
            }

            DB::commit();

            // Registrar actividad
            activity('facturacion_edicion')
                ->performedOn($facturacion)
                ->causedBy(Auth::user())
                ->withProperties([
                    'predio_id' => $predio->id,
                    'ciclo_id' => $request->ciclo_id,
                    'total_factura' => $request->total_factura,
                    'estado' => $request->estado,
                ])
                ->log("Factura #{$facturacion->id} actualizada para el predio {$predio->matricula_predial}");

            return redirect()
                ->route('facturacion.index')
                ->with('success', 'Factura actualizada exitosamente.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return redirect()
                ->route('facturacion.edit', $facturacion->id)
                ->withErrors($e->validator)
                ->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()
                ->route('facturacion.edit', $facturacion->id)
                ->with('error', 'Error al actualizar la factura: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Facturacion $facturacion)
    {
        //
    }

    // private function generateBarcode($idFactura)
    // {
    //    $generator = new BarcodeGeneratorPNG();
    // $barcodeData = $idFactura;

    // // PNG image binary
    // $barcodeImage = $generator->getBarcode($barcodeData, $generator::TYPE_CODE_128);

    // // Convert to base64
    // $barcodeBase64 = base64_encode($barcodeImage);

    // return $barcodeBase64;
    // }


    private function generateBarcode($idFactura)
    {
        $generator = new BarcodeGeneratorPNG();
        $barcodeData = $idFactura;

        // 1. Generar barcode en PNG (binario)
        $barcodeImage = $generator->getBarcode($barcodeData, $generator::TYPE_CODE_128);

        // 2. Convertir a imagen GD
        $image = imagecreatefromstring($barcodeImage);

        // 3. Rotar 90 grados (sentido antihorario)
        $rotated = imagerotate($image, 90, 0);

        // 4. Convertir imagen rotada nuevamente a PNG
        ob_start();
        imagepng($rotated);
        $rotatedPng = ob_get_clean();

        // 5. Convertir a Base64
        $barcodeBase64 = base64_encode($rotatedPng);

        return $barcodeBase64;
    }

    public function facturasPdf($id)
    {
        // Aumenta límites para seguridad
        ini_set('max_execution_time', 300);
        ini_set('memory_limit', '512M');


        $facturas = Facturacion::with('predio.barrio', 'predio.cliente', 'ciclo')
            ->where('ciclo_id', $id)
            ->orderByRaw(
                "CAST( (SELECT ruta FROM predios WHERE predios.id = facturacion.predio_id LIMIT 1) AS UNSIGNED )"
            )
            ->get();


        // Generar barcode para cada factura
        $generator = new BarcodeGeneratorPNG();

        foreach ($facturas as $factura) {
            // Cambia $factura->id por lo que quieras usar para el barcode
            $codigo = $factura->id;

            $factura->barcode = base64_encode(
                $generator->getBarcode($codigo, $generator::TYPE_CODE_128)
            );
        }

        $pdf = Pdf::loadView('pdf.facturacion', [
            'facturas' => $facturas,

        ])->setPaper('letter', 'portrait');

        return $pdf->stream('facturacion_ciclo_' . $id . '.pdf');
        // return $pdf->stream("facturacion.pdf");  //personalizar por nombre de mes y año
    }


    public function facturasPdfCliente($id)
    {

        // Aumenta límites para seguridad
        ini_set('max_execution_time', 300);
        ini_set('memory_limit', '512M');


        $factura = Facturacion::with('predio.barrio', 'predio.cliente', 'ciclo')
            ->where('predio_id', $id)
            ->latest('created_at')
            ->first();


        // $factura = Facturacion::with('predio.cliente', 'ciclo')
        //     ->where('ciclo_id', $id)
        //     ->orderByDesc('ruta')
        //     ->get();

        $barcode = $this->generateBarcode($factura->id);
        $pdf = Pdf::loadView('pdf.factura', [
            'factura' => $factura,
            'barcode' => $barcode,
        ])->setPaper('letter', 'portrait');

        return $pdf->stream('facturacion_predio_' . $id . '.pdf');
        // return $pdf->stream("facturacion.pdf");  //personalizar por nombre de mes y año
    }
}
