<?php

namespace App\Http\Controllers;

use App\Models\Clientes;
use App\Models\Facturacion;
use App\Models\Pagos;
use App\Models\Predios;
use App\Models\CategoriasPredios;
use App\Models\Barrios;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Obtener métricas para el dashboard
     */
    public function index()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        
        // 1. Métricas de clientes
        $totalClientes = Clientes::count();
        $clientesActivos = Clientes::where('estado', 'activo')->count();
        
        // 2. Métricas de predios
        $totalPredios = Predios::count();
        $prediosConectados = Predios::where('estado_servicio', 'conectado')->count();
        $prediosSuspendidos = Predios::where('estado_servicio', 'suspendido')->count();
        
        // 3. Métricas de facturación
        $facturasPendientes = Facturacion::where('estado', 'emitida')->count();
        $facturasVencidas = Facturacion::where('estado', 'vencida')->count();
        $facturasPagadas = Facturacion::where('estado', 'pagada')->count();
        
        // 4. Métricas financieras
        $ingresosMesActual = Facturacion::where('estado', 'pagada')
            ->whereBetween('fecha_emision', [$startOfMonth, $endOfMonth])
            ->sum('total_factura');
            
        $totalFacturadoMes = Facturacion::whereBetween('fecha_emision', [$startOfMonth, $endOfMonth])
            ->sum('total_factura');
            
        $tasaCobranza = $totalFacturadoMes > 0 ? 
            round(($ingresosMesActual / $totalFacturadoMes) * 100, 2) : 0;
        
        // 5. Distribución de predios por categoría
        $distribucionCategorias = CategoriasPredios::withCount(['predios' => function($query) {
            $query->where('estado_servicio', 'conectado');
        }])->get()->map(function($categoria) {
            return [
                'name' => $categoria->nombre,
                'value' => $categoria->predios_count,
                'color' => $this->getColorForCategory($categoria->id)
            ];
        });
        
        // 6. Distribución de pagos por método
        $distribucionPagos = Pagos::select('medio_pago')
            ->selectRaw('COUNT(*) as count, SUM(valor_pagado) as total')
            ->whereBetween('fecha_pago', [$startOfMonth, $endOfMonth])
            ->groupBy('medio_pago')
            ->get()
            ->map(function($pago) {
                return [
                    'name' => $pago->medio_pago ?: 'No especificado',
                    'value' => $pago->count,
                    'total' => $pago->total,
                    'color' => $this->getColorForPaymentMethod($pago->medio_pago)
                ];
            });
        
        // 7. Ingresos últimos 6 meses
        $ingresosUltimosMeses = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();
            
            $ingreso = Facturacion::where('estado', 'pagada')
                ->whereBetween('fecha_emision', [$start, $end])
                ->sum('total_factura');
                
            $ingresosUltimosMeses[] = [
                'month' => $month->format('M'),
                'revenue' => $ingreso
            ];
        }
        
        // 8. Actividad reciente - incluye todos los tipos de actividad
        $actividadReciente = Activity::with(['causer', 'subject'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function($activity) {
                return [
                    'id' => $activity->id,
                    'description' => $activity->description,
                    'subject_type' => $activity->subject_type,
                    'subject_id' => $activity->subject_id,
                    'causer_name' => $activity->causer ? $activity->causer->nombre ?? $activity->causer->name ?? 'Sistema' : 'Sistema',
                    'causer_type' => $activity->causer_type,
                    'properties' => $activity->properties,
                    'created_at' => $activity->created_at->diffForHumans(),
                    'created_at_raw' => $activity->created_at->toDateTimeString(),
                    'type' => $this->getActivityType($activity->description, $activity->subject_type)
                ];
            });

        return response()->json([
            'stats' => [
                'totalClientes' => $totalClientes,
                'clientesActivos' => $clientesActivos,
                'totalPredios' => $totalPredios,
                'prediosConectados' => $prediosConectados,
                'prediosSuspendidos' => $prediosSuspendidos,
                'facturasPendientes' => $facturasPendientes,
                'facturasVencidas' => $facturasVencidas,
                'facturasPagadas' => $facturasPagadas,
                'ingresosMesActual' => $ingresosMesActual,
                'totalFacturadoMes' => $totalFacturadoMes,
                'tasaCobranza' => $tasaCobranza,
            ],
            'charts' => [
                'distribucionCategorias' => $distribucionCategorias,
                'distribucionPagos' => $distribucionPagos,
                'ingresosUltimosMeses' => $ingresosUltimosMeses,
            ],
            'actividadReciente' => $actividadReciente,
            'updatedAt' => $now->toDateTimeString()
        ]);
    }
    
    /**
     * Determinar tipo de actividad para estilización
     */
    private function getActivityType($description, $subjectType)
    {
        $description = strtolower($description);
        
        if (str_contains($description, 'creat') || str_contains($description, 'registr')) {
            return 'created';
        }
        
        if (str_contains($description, 'updat') || str_contains($description, 'actualiz')) {
            return 'updated';
        }
        
        if (str_contains($description, 'delet') || str_contains($description, 'elimin')) {
            return 'deleted';
        }
        
        if (str_contains($description, 'login') || str_contains($description, 'sesión')) {
            return 'auth';
        }
        
        if (str_contains($description, 'pago') || str_contains($description, 'payment')) {
            return 'payment';
        }
        
        if (str_contains($description, 'factura') || str_contains($description, 'invoice')) {
            return 'billing';
        }
        
        if (str_contains($description, 'cliente') || str_contains($description, 'client')) {
            return 'client';
        }
        
        if (str_contains($description, 'predio') || str_contains($description, 'property')) {
            return 'property';
        }
        
        return 'general';
    }
    
    /**
     * Obtener color para categoría (para gráficos)
     */
    private function getColorForCategory($categoryId)
    {
        $colors = [
            'hsl(var(--chart-1))',
            'hsl(var(--chart-2))',
            'hsl(var(--chart-3))',
            'hsl(var(--chart-4))',
            'hsl(var(--chart-5))',
            'hsl(var(--chart-6))',
        ];
        
        return $colors[$categoryId % count($colors)] ?? 'hsl(var(--chart-1))';
    }
    
    /**
     * Obtener color para método de pago
     */
    private function getColorForPaymentMethod($method)
    {
        $colorMap = [
            'efectivo' => 'hsl(var(--chart-1))',
            'transferencia' => 'hsl(var(--chart-2))',
            'tarjeta' => 'hsl(var(--chart-3))',
            'cheque' => 'hsl(var(--chart-4))',
            'pse' => 'hsl(var(--chart-5))',
        ];
        
        return $colorMap[strtolower($method)] ?? 'hsl(var(--chart-6))';
    }
}
