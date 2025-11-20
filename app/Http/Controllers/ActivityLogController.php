<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::query();

        // Búsqueda global
        if ($search = $request->search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'LIKE', "%$search%")
                    ->orWhere('log_name', 'LIKE', "%$search%");
            });
        }

        // Filtro por tipo
        if ($type = $request->type) {
            $query->where('log_name', $type);
        }

        // Filtro por usuario
        if ($user = $request->user_id) {
            $query->where('causer_id', $user);
        }

        // Rango de fechas
        if ($request->filled('from') && $request->filled('to')) {
            $query->whereBetween('created_at', [
                $request->from . ' 00:00:00',
                $request->to . ' 23:59:59'
            ]);
        }

        $logs = $query
            ->with('causer')  //  ← SOLUCIÓN
            ->latest()
            ->paginate(5)
            ->withQueryString();
        $types = Activity::select('log_name')->distinct()->pluck('log_name');

        return Inertia::render('ActivityLog/Index', [
            'logs' => $logs,
            'filters' => $request->all(),
            'types' => $types,
        ]);
    }

    public function show($id)
    {
        $log = Activity::with('causer')->findOrFail($id);

        return Inertia::render('ActivityLog/Show', [
            'log' => $log,
        ]);
    }
}
