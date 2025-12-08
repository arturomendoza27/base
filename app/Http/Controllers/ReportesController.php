<?php

namespace App\Http\Controllers;

use App\Models\Facturacion;
use App\Models\Pagos;
use App\Models\Predios;
use App\Models\Clientes;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportesController extends Controller
{
    /**
     * Reporte de Facturación
     */
    public function facturacion(Request $request)
    {
        $request->validate([
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'estado' => 'nullable|in:emitida,pagada,vencida,anulada',
            'cliente_id' => 'nullable|exists:clientes,id',
        ]);

        $query = Facturacion::with(['cliente', 'predio', 'ciclo']);

        // Filtros
        if ($request->filled('fecha_inicio')) {
            $query->whereDate('fecha_emision', '>=', $request->fecha_inicio);
        }
        
        if ($request->filled('fecha_fin')) {
            $query->whereDate('fecha_emision', '<=', $request->fecha_fin);
        }
        
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }
        
        if ($request->filled('cliente_id')) {
            $query->where('cliente_id', $request->cliente_id);
        }

        $facturas = $query->orderBy('fecha_emision', 'desc')->get();

        // Estadísticas
        $totalFacturado = $facturas->sum('total_factura');
        $totalPagado = $facturas->where('estado', 'pagada')->sum('total_factura');
        $totalPendiente = $facturas->where('estado', 'emitida')->sum('total_factura');
        $totalVencido = $facturas->where('estado', 'vencida')->sum('total_factura');

        return response()->json([
            'facturas' => $facturas,
            'estadisticas' => [
                'total_facturas' => $facturas->count(),
                'total_facturado' => $totalFacturado,
                'total_pagado' => $totalPagado,
                'total_pendiente' => $totalPendiente,
                'total_vencido' => $totalVencido,
                'tasa_cobranza' => $totalFacturado > 0 ? round(($totalPagado / $totalFacturado) * 100, 2) : 0,
            ],
            'filtros' => $request->all(),
        ]);
    }

    /**
     * Reporte de Pagos / Recaudo
     */
    public function pagos(Request $request)
    {
        $request->validate([
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'medio_pago' => 'nullable|string',
        ]);

        $query = Pagos::with(['factura.cliente', 'factura.predio']);

        // Filtros
        if ($request->filled('fecha_inicio')) {
            $query->whereDate('fecha_pago', '>=', $request->fecha_inicio);
        }
        
        if ($request->filled('fecha_fin')) {
            $query->whereDate('fecha_pago', '<=', $request->fecha_fin);
        }
        
        if ($request->filled('medio_pago')) {
            $query->where('medio_pago', $request->medio_pago);
        }

        $pagos = $query->orderBy('fecha_pago', 'desc')->get();

        // Estadísticas
        $totalRecaudado = $pagos->sum('valor_pagado');
        $pagosPorMetodo = $pagos->groupBy('medio_pago')->map(function ($grupo) {
            return [
                'count' => $grupo->count(),
                'total' => $grupo->sum('valor_pagado'),
            ];
        });

        // Pagos por día
        $pagosPorDia = $pagos->groupBy(function ($pago) {
            return Carbon::parse($pago->fecha_pago)->format('Y-m-d');
        })->map(function ($grupo) {
            return $grupo->sum('valor_pagado');
        });

        return response()->json([
            'pagos' => $pagos,
            'estadisticas' => [
                'total_pagos' => $pagos->count(),
                'total_recaudado' => $totalRecaudado,
                'pagos_por_metodo' => $pagosPorMetodo,
                'promedio_pago' => $pagos->count() > 0 ? $totalRecaudado / $pagos->count() : 0,
            ],
            'pagos_por_dia' => $pagosPorDia,
            'filtros' => $request->all(),
        ]);
    }

    /**
     * Reporte de Cartera Vencida
     */
    public function carteraVencida(Request $request)
    {
        $request->validate([
            'dias_mora_min' => 'nullable|integer|min:0',
            'dias_mora_max' => 'nullable|integer|min:0',
        ]);

        // Usamos una consulta directa ya que no hay modelo para cartera_vencida
        $query = DB::table('cartera_vencida')
            ->join('facturacion', 'cartera_vencida.factura_id', '=', 'facturacion.id')
            ->join('predios', 'cartera_vencida.predio_id', '=', 'predios.id')
            ->join('clientes', 'predios.cliente_id', '=', 'clientes.id')
            ->select(
                'cartera_vencida.*',
                'facturacion.numero as factura_numero',
                'facturacion.fecha_vencimiento',
                'facturacion.total_factura',
                'predios.direccion_predio',
                'predios.matricula_predial',
                'clientes.nombre as cliente_nombre',
                'clientes.documento as cliente_documento'
            );

        // Filtros
        if ($request->filled('dias_mora_min')) {
            $query->where('dias_mora', '>=', $request->dias_mora_min);
        }
        
        if ($request->filled('dias_mora_max')) {
            $query->where('dias_mora', '<=', $request->dias_mora_max);
        }
        
        if ($request->filled('estado')) {
            $query->where('cartera_vencida.estado', $request->estado);
        }

        $cartera = $query->orderBy('dias_mora', 'desc')->get();

        // Estadísticas
        $totalVencido = $cartera->sum('valor_pendiente');
        $carteraPorDiasMora = $cartera->groupBy(function ($item) {
            if ($item->dias_mora <= 30) return '0-30 días';
            if ($item->dias_mora <= 60) return '31-60 días';
            if ($item->dias_mora <= 90) return '61-90 días';
            return 'Más de 90 días';
        })->map(function ($grupo) {
            return [
                'count' => $grupo->count(),
                'total' => $grupo->sum('valor_pendiente'),
            ];
        });

        return response()->json([
            'cartera_vencida' => $cartera,
            'estadisticas' => [
                'total_registros' => $cartera->count(),
                'total_vencido' => $totalVencido,
                'promedio_dias_mora' => $cartera->count() > 0 ? round($cartera->avg('dias_mora'), 2) : 0,
                'cartera_por_dias_mora' => $carteraPorDiasMora,
            ],
            'filtros' => $request->all(),
        ]);
    }

    /**
     * Reporte de Caja
     */
    public function caja(Request $request)
    {
        $request->validate([
            'fecha' => 'nullable|date',
        ]);

        $fecha = $request->filled('fecha') ? $request->fecha : Carbon::today()->toDateString();

        // Movimientos de caja del día
        $movimientos = Pagos::whereDate('fecha_pago', $fecha)
            ->with(['factura.cliente'])
            ->orderBy('fecha_pago', 'desc')
            ->get();

        // Resumen por método de pago
        $resumenPorMetodo = $movimientos->groupBy('medio_pago')->map(function ($grupo) {
            return [
                'count' => $grupo->count(),
                'total' => $grupo->sum('valor_pagado'),
            ];
        });

        // Total del día
        $totalDia = $movimientos->sum('valor_pagado');

        // Saldo anterior (total de días anteriores)
        $saldoAnterior = Pagos::whereDate('fecha_pago', '<', $fecha)->sum('valor_pagado');

        return response()->json([
            'movimientos' => $movimientos,
            'resumen' => [
                'fecha' => $fecha,
                'total_dia' => $totalDia,
                'saldo_anterior' => $saldoAnterior,
                'saldo_acumulado' => $saldoAnterior + $totalDia,
                'resumen_por_metodo' => $resumenPorMetodo,
                'total_movimientos' => $movimientos->count(),
            ],
            'filtros' => $request->all(),
        ]);
    }

    /**
     * Reporte de Predios Suspendidos
     */
    public function suspendidos(Request $request)
    {
        $predios = Predios::where('estado_servicio', 'suspendido')
            ->with(['cliente', 'categoria', 'barrio'])
            ->orderBy('fecha_suspension', 'desc')
            ->get();

        // Estadísticas
        $totalSuspendidos = $predios->count();
        $suspendidosPorBarrio = $predios->groupBy('barrio.nombre')->map->count();
        $suspendidosPorCategoria = $predios->groupBy('categoria.nombre')->map->count();

        // Tiempo promedio de suspensión
        $tiempoPromedio = $predios->filter(function ($predio) {
            return $predio->fecha_suspension !== null;
        })->avg(function ($predio) {
            return Carbon::parse($predio->fecha_suspension)->diffInDays(Carbon::now());
        });

        return response()->json([
            'predios_suspendidos' => $predios,
            'estadisticas' => [
                'total_suspendidos' => $totalSuspendidos,
                'suspendidos_por_barrio' => $suspendidosPorBarrio,
                'suspendidos_por_categoria' => $suspendidosPorCategoria,
                'tiempo_promedio_suspension' => round($tiempoPromedio, 2),
            ],
        ]);
    }

    /**
     * Reporte de Predios Desconectados
     */
    public function desconectados(Request $request)
    {
        // Predios que nunca han sido conectados o fueron desconectados permanentemente
        $predios = Predios::where(function ($query) {
                $query->where('estado_servicio', 'desconectado')
                    ->orWhereNull('fecha_conexion')
                    ->orWhereNotNull('fecha_suspension');
            })
            ->where(function ($query) {
                $query->whereNull('fecha_reconexion')
                    ->orWhere('fecha_reconexion', '<', 'fecha_suspension');
            })
            ->with(['cliente', 'categoria', 'barrio'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Estadísticas
        $totalDesconectados = $predios->count();
        $desconectadosPorBarrio = $predios->groupBy('barrio.nombre')->map->count();
        $desconectadosPorCategoria = $predios->groupBy('categoria.nombre')->map->count();

        // Razones de desconexión (inferidas)
        $razones = [
            'nunca_conectado' => $predios->whereNull('fecha_conexion')->count(),
            'suspendido_sin_reconexion' => $predios->whereNotNull('fecha_suspension')
                ->where(function ($query) {
                    $query->whereNull('fecha_reconexion')
                        ->orWhere('fecha_reconexion', '<', 'fecha_suspension');
                })->count(),
        ];

        return response()->json([
            'predios_desconectados' => $predios,
            'estadisticas' => [
                'total_desconectados' => $totalDesconectados,
                'desconectados_por_barrio' => $desconectadosPorBarrio,
                'desconectados_por_categoria' => $desconectadosPorCategoria,
                'razones_desconexion' => $razones,
            ],
        ]);
    }

    /**
     * Exportar reporte a PDF
     */
    public function exportarPdf(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:facturacion,pagos,cartera_vencida,caja,suspendidos,desconectados',
            'formato' => 'required|in:pdf,excel',
        ]);

        $tipo = $request->tipo;
        $formato = $request->formato;
        
        // Obtener datos según el tipo
        $datos = [];
        $titulo = '';
        
        switch ($tipo) {
            case 'facturacion':
                $datos = $this->facturacion($request);
                $titulo = 'Reporte de Facturación';
                break;
            case 'pagos':
                $datos = $this->pagos($request);
                $titulo = 'Reporte de Pagos / Recaudo';
                break;
            case 'cartera_vencida':
                $datos = $this->carteraVencida($request);
                $titulo = 'Reporte de Cartera Vencida';
                break;
            case 'caja':
                $datos = $this->caja($request);
                $titulo = 'Reporte de Caja';
                break;
            case 'suspendidos':
                $datos = $this->suspendidos($request);
                $titulo = 'Reporte de Predios Suspendidos';
                break;
            case 'desconectados':
                $datos = $this->desconectados($request);
                $titulo = 'Reporte de Predios Desconectados';
                break;
        }

        // Aquí se implementaría la generación real de PDF o Excel
        // Por ahora retornamos los datos en JSON
        return response()->json([
            'mensaje' => 'Exportación generada exitosamente',
            'tipo' => $tipo,
            'formato' => $formato,
            'titulo' => $titulo,
            'datos' => json_decode($datos->getContent(), true),
            'fecha_generacion' => Carbon::now()->toDateTimeString(),
        ]);
    }
}
